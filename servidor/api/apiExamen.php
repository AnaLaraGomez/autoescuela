<?php
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/sessionHelper.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/helpers/validator.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/examenRepository.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/autoescuela/servidor/repository/preguntaRepository.php');

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Genera Examen y me lo devuelves
    $dificultadId = $_GET['dificultad'];

    // lista en formato string separado por comas
    $usariosObjetivos = $_GET['usuariosobjetivos'];
    if(empty($dificultadId)) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }
    if(empty($usariosObjetivos)) {
        $respuesta ['succeed'] = false;
        echo json_encode($respuesta);
        return;
    }

    $usariosObjetivos = explode(',', $usariosObjetivos);
    // Criterios generacion ? Dificultad, Categoria ????

    // 1º Crear Entrada en tabla Examen en Base de datos  
    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    $examenId = crearExamen($user->get_id());

    // 2º Hacer insercion en la tabla examen_usuario
    insertarAlumnosEnExamen($examenId, $usariosObjetivos);
    // 3º Seleccionar preguntas aleatorias en base a los criterios o las preguntas que mandan por $_GET
    if(isset($_GET['preguntasobjetivos'])) {
        $preguntasId = $_GET['preguntasobjetivos'];
        $preguntas = obtenerPreguntasSeleccionadasPorDificultad($dificultadId, $preguntasId);
    } else {
        $preguntas = obtenerPreguntasAleatoriasPorDificultad($dificultadId, 10);
    }

    // 4º Hacer insercion en la tabla examen_preguntas
    insertarPreguntasEnExamen($examenId, $preguntas);

    // 5º Eliminar las respuestas correctas del objeto antes de mandarlo
    $preguntasLimpias = limpiarPreguntas($preguntas);

    // 6º Mandar con json_encode todo el examen
    $respuesta = array();
    $respuesta['id'] = $examenId;
    $respuesta['creador'] = $user->get_id();
    $respuesta['preguntas'] = $preguntasLimpias;
    echo json_encode($respuesta);
    return;
    
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $tipo = $_GET['tipo'];
    $userId = $_GET['user'];

    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    if($user->get_rol() != 'admin' && $user->get_rol() != 'profesor') {
        // Eres alumno
        $userId = $user->get_id();
    } else {
        if(empty($userId)) {
            $userId = $user->get_id();
        }
    }

    if($tipo == 'anteriores') {
        $resultados = obtenerExamenesAnteriores($userId);
        $resultadosCompletos = array();
        foreach($resultados as $resultado) {
            $preguntas = obtenerPreguntasPorExamen($resultado['examen']->get_id());
            $respuestaUsuario = $resultado['intento']->get_JSonResul();
            $respuestaUsuarioObj = json_decode($respuestaUsuario);  // [{id, respuesta}]
            $correccion = array();
            foreach($respuestaUsuarioObj as $respuestaUsuarioActual) {
                if(!empty($respuestaUsuarioActual->respuesta)) {
                    foreach($preguntas as $preguntaActual) {
                        if($preguntaActual->get_id() == $respuestaUsuarioActual->id) {
                            $entrada = array();
                            $entrada['id'] = $preguntaActual->get_id();
                            $entrada['correcta'] =$respuestaUsuarioActual->respuesta == $preguntaActual->get_correcta();
                            $correccion[] = $entrada;
                            break;
                        }
                    }
                } else {
                    $entrada = array();
                    $entrada['id'] = $respuestaUsuarioActual->id;
                    $entrada['correcta'] = false;
                    $correccion[] = $entrada;

                }
            }
            $resultadoNuevo = array();
            $resultadoNuevo['correccion'] = $correccion;
            $resultadoNuevo['examen'] = $resultado['examen'];
            $resultadoNuevo['intento'] = $resultado['intento'];
            $resultadosCompletos[] = $resultadoNuevo;
        }
        
        $resultados = $resultadosCompletos;
    } elseif($tipo == 'pendientes') {
        $resultados = obtenerExamenesPendientes($userId);
    } else {
        $examenId = $_GET['examen'];
        if(!isset($examenId)) {
            $respuesta ['succeed'] = false;
            echo json_encode($respuesta);
            return;
        }
        $preguntas = obtenerPreguntasPorExamen($examenId);

        $preguntasLimpias = limpiarPreguntas($preguntas);
        // Mandar con json_encode todo el examen
        $respuesta = array();
        $respuesta['id'] = $examenId;
        $respuesta['creador'] = ''; // Lo necesitamos ??

        $respuesta['preguntas'] = $preguntasLimpias;
        echo json_encode($respuesta);
        return;
    }
    echo json_encode($resultados);
    return;

} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $examenId = $_GET['examen'];
    $JSonResul = file_get_contents("php://input");

    $erroresValidacion=array();
    $erroresValidacion=campoRequerido($examenId, 'examen', "Es obligatorio introducir un identificador de examen", $erroresValidacion);
    $erroresValidacion=campoRequerido($JSonResul, 'JSonResul', "Es obligatorio introducir una respuesta de examen", $erroresValidacion);

    if(!empty($erroresValidacion)) {
        // respondemos a JavaScript con el echo
        // El echo contiene los errores en formato JSON
        $erroresValidacion['succeed'] = false;
        echo json_encode($erroresValidacion);
        return;
    }

    $user = obtenerUsuarioDeSessionORedireccionarLogin();
    $userId = $user->get_id();

    guardarExamen($examenId, $userId, $JSonResul);
    $erroresValidacion['succeed'] = true;
    echo json_encode($erroresValidacion);

}

function obtenerUsuarioDeSessionORedireccionarLogin() {
    $sessionId = $_COOKIE['AUTOESCUELA_SESSION_ID'];
    if(!estaLogueado($sessionId)) {
        header("Location: http://autoescuelaprisas.com/autoescuela/interfaz/acceso/login.html");
        exit;
    }

    return leerDatosSession($sessionId);
}

function limpiarPreguntas($preguntas) {
    $preguntasLimpias = array();
    foreach($preguntas as $preguntaActual) {
        $preguntaLimpia = array();
        $preguntaLimpia['id'] = $preguntaActual->get_id();
        $preguntaLimpia['enunciado'] = $preguntaActual->get_enunciado();
        $preguntaLimpia['respuesta1'] = $preguntaActual->get_respuesta1();
        $preguntaLimpia['respuesta2'] = $preguntaActual->get_respuesta2(); 
        $preguntaLimpia['respuesta3'] = $preguntaActual->get_respuesta3(); 
        $preguntaLimpia['url'] = $preguntaActual->get_url(); 
        $preguntaLimpia['tipoURL'] = $preguntaActual->get_tipoUrl(); 
        $preguntaLimpia['idCategoria'] = 0; 
        $preguntaLimpia['idDificultad'] = $dificultadId; 
        $preguntasLimpias[] = $preguntaLimpia;
    }
    return $preguntasLimpias;
}

?>