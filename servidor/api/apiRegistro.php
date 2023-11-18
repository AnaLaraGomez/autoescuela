<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/userRepository.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario=$_POST['usuario'];
    $rol=$_POST['rol'];
    $password=$_POST['password'];
    $password2=$_POST['password2'];

    // El formulario tiene los campos obligatorios?
    $erroresValidacion=array();
    $erroresValidacion = campoRequerido($usuario, 'usuario', "Es obligatorio rellenar el campo usuario", $erroresValidacion);
    $erroresValidacion = campoRequerido($password, 'password', "Es obligatorio introducir una contraseña", $erroresValidacion);
    $erroresValidacion = campoRequerido($password2, 'password2', "Es obligatorio introducir repetir la contraseña", $erroresValidacion);

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

    // Las contraseñas coinciden?
    if($password != $password2) {
        $erroresValidacion['passwordDiferente'] = "Las contraseñas introducidas no coinciden";
        echo json_encode($erroresValidacion);
        return;
    }

    // Introducir nuevo usuario en base de datos
    crearUsuario($usuario, $password, $rol);
    header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/acceso/login.html");
    exit();
} 
?>