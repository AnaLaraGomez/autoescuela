<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/conexion.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/examen.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/intento.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/entities/pregunta.php');

function crearExamen($userId) {

    // Necesitamos saber cual es el id del examen qeu acabamos de introducir para poder 
    // relacionarlo con pregintas y con usuarios
    // Fuente: https://www.w3schools.com/php/php_mysql_insert_lastid.asp
    $con = basedatos();
    $con->exec("INSERT INTO `examen`(creador) VALUES ($userId)");
    return $con->lastInsertId();
}

function insertarPreguntasEnExamen($examenId, $preguntas) {
    foreach($preguntas as $preguntaActual) {
        $preguntaId = $preguntaActual->get_id();
        basedatos()->exec("INSERT INTO `examen_pregunta`(examen_id, pregunta_id) VALUES ($examenId, $preguntaId)");
    }
}

function insertarAlumnosEnExamen($examenId, $usariosObjetivos) {
    foreach($usariosObjetivos as $usuarioActual) {
        basedatos()->exec("INSERT INTO `examen_user_intento`(examen_id, `user_id`) VALUES ($examenId, $usuarioActual)");
    }
}

function obtenerPreguntasPorExamen($examenId) {
    $consultas = basedatos()->query("SELECT p.* FROM `pregunta` p 
    inner join `examen_pregunta` ep on ep.examen_id = $examenId
    WHERE p.id = ep.pregunta_id");
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

function obtenerExamenesPendientes($userId) { //[ {id, fecha, creador}, {id, fecha, creador} ]
    $consultas = basedatos()->query("Select e.id, e.fecha, u.email as creador from examen e 
    inner join examen_user_intento eui on eui.examen_id = e.id 
    inner join user u on u.id = e.creador 
    WHERE eui.user_id = $userId 
    AND eui.intento_id is null");
    $examenes = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
         $examenes[] = new Examen($resultados->id, $resultados->fecha, $resultados->creador);
    }
    return $examenes;
}

function obtenerExamenesAnteriores($userId) { //[ {examen: {id, fecha, creador}}, intento:{id, fecha, jSonResul} } ]
    $consultas = basedatos()->query("Select e.fecha, e.id, i.JSonResul, u.email as creador from examen e 
    inner join examen_user_intento eui on eui.examen_id = e.id 
    inner join intento i on i.id = eui.intento_id 
    inner join user u on u.id = e.creador 
    WHERE eui.user_id = $userId 
    AND eui.intento_id is not null");
    $examenes = array();
    while ($resultados = $consultas->fetch(PDO::FETCH_OBJ)) {
        $entry[] = array();
        $entry['examen'] = new Examen($resultados->id, $resultados->fecha, $resultados->creador);
        $entry['intento'] = new Intento($resultados->id, $resultados->fecha, $resultados->JSonResul);

        $examenes[] = $entry;
    }

    return $examenes;
}

function guardarExamen($examenId, $userId, $JSonResul) {
    // Insertar Intento
    $con = basedatos();
    $con->exec("INSERT INTO `intento`(JSonResul) VALUES ('$JSonResul')");

    $intentoId = $con->lastInsertId();
    // Insertamos/Actualizamos el id de intento en la tabla que relaciona el usuario y el examen
    $con->exec("UPDATE `examen_user_intento` SET intento_id = $intentoId WHERE user_id = $userId AND examen_id = $examenId");
}

?>

