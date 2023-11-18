<?php 

function campoRequerido($campo, $claveError, $mensajeError, $errores) {
    if(empty($campo) ){
        $errores[$claveError]=$mensajeError;
    }
    return $errores;
}

function credencialesCorrectas($usuario, $password, $userObj) {

    $errores = array();
    if(empty($userObj)){
        $errores['usuario2']="El usuario introducido no existe";
    }

    if(!empty($userObj) && $password!=$userObj->get_password()){
        $errores['password2']="La contraseña no es correcta";
    }
    return $errores;
}
?>