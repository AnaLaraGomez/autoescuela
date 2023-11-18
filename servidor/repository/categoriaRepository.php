<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/categoria.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/conexion.php');

function obtenerCategorias() {
    $consultas = basedatos()->query("Select * from categoria");
    $categorias = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $categorias[] = new Categoria(
            $resultados->id, 
            $resultados->nombre
        );
    }
    return $categorias;
}

function crearCategoria($nombre){
    $con = basedatos();
    $con->exec("INSERT INTO `categoria`(nombre) VALUES ('$nombre')");
    return  $con->lastInsertId();
}

function asignarCategoriaAPregunta($preguntaId, $categoriaId){
    basedatos()->exec("INSERT INTO `pregunta_categoria`(pregunta_Id, categoria_Id) VALUES ('$preguntaId','$categoriaId')");
}


function eliminarCategoria($categoriaId){
    basedatos()->exec("DELETE FROM `categoria` where id = $categoriaId");
}
?>