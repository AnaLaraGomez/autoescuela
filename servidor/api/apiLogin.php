<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/userRepository.php');


if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario=$_POST['usuario'];
    $password=$_POST['password'];

    if(estaLogueado($_COOKIE['AUTOESCUELA_SESSION_ID'])) {
        header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/index.html");
        exit;
    }
   
    $erroresValidacion=array();
    $erroresValidacion=campoRequerido($usuario, 'usuario', "Es obligatorio identificarse con un usuario", $erroresValidacion);
    $erroresValidacion=campoRequerido($password, 'password',"Es obligatorio introducir una contraseña", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        echo json_encode($erroresValidacion);
        return;
    }

    $userObj = obtenerUsuarioPorEmail($usuario);
    $erroresCredenciales = credencialesCorrectas($usuario, $password, $userObj);
    if(!empty($erroresCredenciales)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        echo json_encode($erroresCredenciales);
        return;
    }
    
    login($userObj);
    header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/index.html");
    exit;
}

?>