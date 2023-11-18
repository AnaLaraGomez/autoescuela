<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/conexion.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/user.php');

function obtenerUsuarioPorEmail($usuario) {
    $consultas = basedatos()->query("Select * from user where email = '$usuario'");
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
        return new Usuario(
            $resultados->id, 
            $resultados->email, 
            $resultados->password,
            $resultados->rol, 
            $resultados->foto,
            $resultados->moderado
        );
    }
}

function obtenerUsuarioPorId($userId) {
    $consultas = basedatos()->query("Select * from user where id = '$userId'");
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
        return new Usuario(
            $resultados->id, 
            $resultados->email, 
            $resultados->password,
            $resultados->rol, 
            $resultados->foto,
            $resultados->moderado
        );
    }
}

function crearUsuario($usuario, $password, $rol, $moderado = 0) {
    basedatos()->exec("INSERT INTO `user`(email, rol, `password`, moderado) VALUES ('$usuario','$rol','$password', $moderado)");
}

function obtenerUsuarios() {
    $consultas = basedatos()->query("Select * from user");
    $usuarios = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $usuarios[] = new Usuario(
            $resultados->id, 
            $resultados->email, 
            $resultados->password,
            $resultados->rol, 
            $resultados->foto,
            $resultados->moderado
        );
    }
    return $usuarios;
}

function eliminarUsuario($userId) {
    basedatos()->exec("DELETE FROM `user` WHERE id = $userId");
}

function actualizarUsuario($usuarioAModificar) {
    $rol = $usuarioAModificar->get_rol();
    $moderado = $usuarioAModificar->get_moderado();
    $userId = $usuarioAModificar->get_id();
    basedatos()->exec("UPDATE `user` SET `rol`='$rol',`moderado`= $moderado WHERE id = $userId ");
}
?>