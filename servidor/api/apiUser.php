<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/userRepository.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');

if ($_SERVER['REQUEST_METHOD']=='POST') {
    // Crear usuario a mano. Solo debe ser llamado por el administrador.
    $usuario=$_POST['usuario'];
    $password=$_POST['password'];
    $rol=$_POST['rol'];

    // El formulario tiene los campos obligatorios?
    $erroresValidacion=array();
    $erroresValidacion = campoRequerido($usuario, 'usuario', "Es obligatorio rellenar el campo usuario", $erroresValidacion);
    $erroresValidacion = campoRequerido($password, 'password', "Es obligatorio introducir una contraseña", $erroresValidacion);
    $erroresValidacion = campoRequerido($rol, 'rol', "Es obligatorio introducir un rol para el usuario", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        echo json_encode($erroresValidacion);
        return;
    }
    // El usuario existe?
    $userObj = obtenerUsuarioPorEmail($usuario);
    if(!empty($userObj)) {
        $erroresValidacion['usuarioExiste'] = 'El usuario introducido ya existe en el sistema';
        echo json_encode($erroresValidacion);
        return;
    }

    crearUsuario($usuario, $password, $rol, 1);
    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);
}

elseif ($_SERVER['REQUEST_METHOD']=='GET') {
    // Obtener toda la informacion del usuario actual (con la session abierta)
    // Util para pintar el header, saber el rol etc.
    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    
    // Queremos usuario actual o todos los de la DB ?
    if(isset($_GET['all'])) {
        // Comprobar que es usuario admin
        if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
            echo json_encode();
            return;
        }
        // Obtenemos todos los usuarios de la base de datos
        $usuarios = obtenerUsuarios();
        echo json_encode($usuarios);
    } else {
        echo json_encode($user);
    }
}

elseif ($_SERVER['REQUEST_METHOD']=='DELETE') {
    // Eliminar usuario del sistema. Solo debe ser llamado por el administrador.
    $respuesta = array();
    if(!isset($_GET['userId'])) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }
    $user = obtenerUsuarioDeSessionORedireccionarLogin();

    if($user->get_rol() != 'admin') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    eliminarUsuario($_GET['userId']);
    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);
}

elseif ($_SERVER['REQUEST_METHOD']=='PUT') {
    // Modificaciones del usuario, por ejemplo cambio de rol (solo admin).
    $respuesta = array();
    if(!isset($_GET['userId'])) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    $user = obtenerUsuarioDeSessionORedireccionarLogin();

    if($user->get_rol() != 'admin') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    
    // Recuperar de base de datos el usuario, modificarlo y volverlo a guardar
    $usuarioAModificar = obtenerUsuarioPorId($_GET['userId']);

    if(isset($_GET['moderado'])) {
        // hay qeu hacer un parseInt que en PHP se llama intval
        $usuarioAModificar->set_moderado(intval($_GET['moderado']));
    }
    if(isset($_GET['rol'])) {
        $usuarioAModificar->set_rol($_GET['rol']);
    }

    actualizarUsuario($usuarioAModificar);
    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);
    return;
}

function obtenerUsuarioDeSessionORedireccionarLogin() {
    $sessionId = $_COOKIE['AUTOESCUELA_SESSION_ID'];
    if(!estaLogueado($sessionId)) {
        header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/acceso/login.html");
        exit;
    }

    return leerDatosSession($sessionId);
}


?>