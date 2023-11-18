<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/categoriaRepository.php');

if($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    $categorias = obtenerCategorias();
    echo json_encode($categorias);
    return;
}

elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre=$_POST['nombre'];

    $erroresValidacion=array();
    $erroresValidacion=campoRequerido($nombre, 'nombre', "Es obligatorio añadir un nombre a la categoría", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        echo json_encode($erroresValidacion);
        return;
    }

    // Compobar si es admin o profe ?

    $user = obtenerUsuarioDeSessionORedireccionarLogin();

    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
       $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    $categoriaId = crearCategoria($nombre);

    $respuesta ['succeed'] = true;
    $respuesta ['categoriaId'] = $categoriaId;
    echo json_encode($respuesta);
    return;
}

elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if(!isset($_GET['categoriaId'])) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }
    // Compobar si es admin o profe ?
    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }
    eliminarCategoria($_GET['categoriaId']);
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