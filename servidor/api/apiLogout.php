<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    logout($_COOKIE['AUTOESCUELA_SESSION_ID']);
    header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/acceso/login.html");
    exit;
}

?>