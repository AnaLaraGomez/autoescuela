<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/user.php');

$cookieId= 'AUTOESCUELA_SESSION_ID';

function estaLogueado($sessionId){
    if(empty($sessionId)){
        return false;
    }
    if(empty($_SESSION [$sessionId])) {
        return false;
    }

    return true;
}

function login($userObject) {
    global $cookieId;
    $sessionId = uniqid();
    $_SESSION [$sessionId] = serialize($userObject);
    setcookie($cookieId, $sessionId,  calcularTreintaDiasAPartirDeAhora(), '/');
}

function leerDatosSession($sessionId) {
    return unserialize($_SESSION[$sessionId]);
}

function logout($sessionId) {
   // setcookie($cookieId, $sessionId, time() + 100, '/');
    unset($_SESSION [$sessionId]);
}

function calcularTreintaDiasAPartirDeAhora() {
    return time()+60*60*24*30;
}

?>