<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/preguntaRepository.php');


if($_SERVER['REQUEST_METHOD'] == 'POST') 
{
    if(isset($_GET['editar'])) {
        editarPregunta();
        return;
    }

    $dificultadId=$_POST['dificultad'];
    $categoriaId=$_POST['categoria'];
    $enunciado=$_POST['enunciado'];
    $respuesta1=$_POST['respuesta1'];
    $respuesta2=$_POST['respuesta2'];
    $respuesta3=$_POST['respuesta3'];
    $correcta=$_POST['correcta'];


    $erroresValidacion=array();
    $erroresValidacion=campoRequerido($enunciado, 'enunciado', "Es obligatorio añadir un enunciado", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta1, 'respuesta1', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta2, 'respuesta2', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta3, 'respuesta3', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($correcta, 'correcta',"Es obligatorio introducir una respuesta correcta", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        echo json_encode($erroresValidacion);
        return;
    }

    // Compobar si es admin o profe ?

    $user = obtenerUsuarioDeSessionORedireccionarLogin();

    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    if(isset($_FILES['archivo'])) {
        // 1 Guardar la imagen en nuestro servidor
        $tipoFichero = $_FILES['archivo']['type'];
        $extension = explode('/', $tipoFichero)[1];
        $nombreAleatorioDelFichero= uniqid() . ".$extension";
        move_uploaded_file($_FILES['archivo']['tmp_name'],"../../archivos/$nombreAleatorioDelFichero");
        // 2 creamos pregunyta añadiendo la URL y el tipo
        $url = "/autoescuela/archivos/$nombreAleatorioDelFichero";
        $preguntaId = crearPreguntaConUrl($enunciado,$respuesta1, $respuesta2,$respuesta3,$correcta, $url, $tipoFichero);
    } else {
        $preguntaId = crearPregunta($enunciado,$respuesta1, $respuesta2,$respuesta3,$correcta);
    }
    
    asignarDificultadAPregunta($preguntaId, $dificultadId);
    asignarCategoriaAPregunta($preguntaId, $categoriaId);

    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);

}elseif($_SERVER['REQUEST_METHOD'] == 'GET') {
    if(!isset($_GET['dificultad']) || !isset($_GET['categoria'])) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    $preguntas = obtenerPreguntasConParametros($_GET['dificultad'], $_GET['categoria']);
    echo json_encode($preguntas);
}
elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    if(!isset($_GET['preguntaId'])) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }
    // Compobar si es admin o profe ?

    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    eliminarPregunta($_GET['preguntaId']);
    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);
    return;

}
function editarPregunta() {
    // Editar pregunta
    $preguntaId=$_POST['preguntaId'];
    $enunciado=$_POST['enunciado'];
    $respuesta1=$_POST['respuesta1'];
    $respuesta2=$_POST['respuesta2'];
    $respuesta3=$_POST['respuesta3'];
    $correcta=$_POST['correcta'];
    $url=$_POST['url'];
    $tipoUrl= $_POST['tipoUrl'];

    if(isset($_FILES['archivo'])) {
        $tipoUrl = $_FILES['archivo']['type'];
        $extension = explode('/', $tipoUrl)[1];
        $nombreAleatorioDelFichero= uniqid() . ".$extension";
        move_uploaded_file($_FILES['archivo']['tmp_name'],"../../archivos/$nombreAleatorioDelFichero");
        // 2 creamos pregunyta añadiendo la URL y el tipo
        $url = "/autoescuela/archivos/$nombreAleatorioDelFichero";
    }


    $erroresValidacion=array();
    $erroresValidacion=campoRequerido($enunciado, 'enunciado', "Es obligatorio añadir un enunciado", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta1, 'respuesta1', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta2, 'respuesta2', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($respuesta3, 'respuesta3', "Es obligatorio introducir una respuesta aqui", $erroresValidacion);
    $erroresValidacion=campoRequerido($correcta, 'correcta',"Es obligatorio introducir una respuesta correcta", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        echo json_encode($erroresValidacion);
        return;
    }

    // Compobar si es admin o profe ?

    $user = obtenerUsuarioDeSessionORedireccionarLogin();

    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    modificarPregunta($preguntaId, $enunciado, $respuesta1, $respuesta2, $respuesta3, $correcta, $url, $tipoUrl);
    $respuesta ['succeed'] = true;
    echo json_encode($respuesta);
}

function obtenerUsuarioDeSessionORedireccionarLogin() {
    $sessionId = $_COOKIE['AUTOESCUELA_SESSION_ID'];
    if(!estaLogueado($sessionId)) {
        header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/acceso/login.html");
        exit;
    }

    return leerDatosSession($sessionId);
}

?>