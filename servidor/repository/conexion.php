<?php

static $conn;

function basedatos() {
    if(!isset($conn)) {
        $conn = new PDO('mysql:host=localhost;dbname=autoescuela', 'ana', 'root');
    }
    return $conn;
}

?>