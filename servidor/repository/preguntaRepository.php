<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/conexion.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/pregunta.php');

function crearPregunta($enunciado, $r1, $r2, $r3, $correcta) {
    $con = basedatos();
    $con->exec("INSERT INTO `pregunta`(enunciado, respuesta1, respuesta2, respuesta3, correcta) VALUES ('$enunciado','$r1','$r2', '$r3', '$correcta')");
    // Necesitamos saber cual es el id de la pregunta qeu acabamos de introducir para poder 
    // relacionarla con la dificultad
    return $con->lastInsertId();
}

function crearPreguntaConUrl($enunciado, $r1, $r2, $r3, $correcta, $url, $tipo) {
    $con = basedatos();
    $con->exec("
    INSERT INTO `pregunta`(enunciado, respuesta1, respuesta2, respuesta3, correcta, `url`, tipoUrl) 
    VALUES ('$enunciado','$r1','$r2', '$r3', '$correcta', '$url', '$tipo' )"
    );
    // Necesitamos saber cual es el id de la pregunta qeu acabamos de introducir para poder 
    // relacionarla con la dificultad
    return $con->lastInsertId();
}

function modificarPregunta($preguntaId, $enunciado, $r1, $r2, $r3, $correcta, $url, $tipo) {
    basedatos()->exec("
    UPDATE `pregunta` SET enunciado = '$enunciado' , 
        respuesta1 = '$r1', respuesta2 = '$r2', respuesta3 = '$r3', correcta = '$correcta', 
        `url` = '$url' , tipoUrl = '$tipo'
    WHERE id = $preguntaId");
}

function asignarDificultadAPregunta($preguntaId, $dificultadId){
    basedatos()->exec("INSERT INTO `pregunta_dificultad`(pregunta_id, dificultad_id) VALUES ('$preguntaId','$dificultadId')");
}

function asignarCategoriaAPregunta($preguntaId, $categoriaId) {
    basedatos()->exec("INSERT INTO `pregunta_categoria`(pregunta_id, categoria_id) VALUES ('$preguntaId','$categoriaId')");
}

function eliminarPregunta($id) {
    basedatos()->exec("DELETE FROM `pregunta` where id = $id");
}

function obtenerPreguntasConParametros($dificultadId, $categoriaId) {
    $consultas = basedatos()->query("Select * from pregunta  p 
    inner join pregunta_dificultad pd on pd.pregunta_id = p.id 
    inner join pregunta_categoria pc on pc.pregunta_id = p.id 
    where pd.dificultad_id = $dificultadId 
    and pc.categoria_id = $categoriaId");
    $preguntas = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $preguntas[] = new Pregunta(
            $resultados->id, 
            $resultados->enunciado, 
            $resultados->respuesta1,
            $resultados->respuesta2, 
            $resultados->respuesta3,
            $resultados->correcta,
            $resultados->url,
            $resultados->tipoUrl
        );
    }
    return $preguntas;
}

function obtenerPreguntas() {
    $consultas = basedatos()->query("Select * from pregunta");
    $preguntas = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $preguntas[] = new Pregunta(
            $resultados->id, 
            $resultados->enunciado, 
            $resultados->respuesta1,
            $resultados->respuesta2, 
            $resultados->respuesta3,
            $resultados->correcta,
            $resultados->url,
            $resultados->tipoUrl
        );
    }
    return $preguntas;
}

function obtenerPreguntasAleatoriasPorDificultad($dificultad, $cantidad) {
    $consultas = basedatos()->query("
        SELECT p.* 
        FROM `pregunta` as p
        inner join `pregunta_dificultad` as pd on p.id = pd.pregunta_id
        WHERE pd.dificultad_id = $dificultad
        order by rand()
        limit $cantidad;
    ");
    $preguntas = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $preguntas[] = new Pregunta(
            $resultados->id, 
            $resultados->enunciado, 
            $resultados->respuesta1,
            $resultados->respuesta2, 
            $resultados->respuesta3,
            $resultados->correcta,
            $resultados->url,
            $resultados->tipoUrl
        );
    }
    return $preguntas;
}

function obtenerPreguntasSeleccionadasPorDificultad($dificultadId, $preguntasId){
    $consultas = basedatos()->query("
        SELECT p.* 
        FROM `pregunta` as p
        inner join `pregunta_dificultad` as pd on p.id = pd.pregunta_id
        WHERE pd.dificultad_id = $dificultadId  
        AND p.id in ($preguntasId)
    ");
    $preguntas = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $preguntas[] = new Pregunta(
            $resultados->id, 
            $resultados->enunciado, 
            $resultados->respuesta1,
            $resultados->respuesta2, 
            $resultados->respuesta3,
            $resultados->correcta,
            $resultados->url,
            $resultados->tipoUrl
        );
    }
    return $preguntas;
}

?>