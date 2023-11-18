<?php
class Pregunta {
    // Properties
    public $id;
    public $enunciado;
    public $respuesta1;
    public $respuesta2;
    public $respuesta3;
    public $correcta;
    public $url;
    public $tipoUrl;
    

    // Constructor
    function __construct($id,$enunciado,$respuesta1,$respuesta2,$respuesta3,$correcta,$url,$tipoUrl) {
        $this->id = $id;
        $this->enunciado = $enunciado;
        $this->respuesta1 = $respuesta1; 
        $this->respuesta2 = $respuesta2; 
        $this->respuesta3 = $respuesta3; 
        $this->correcta = $correcta; 
        $this->url = $url; 
        $this->tipoUrl = $tipoUrl;
      }
  
    // Methods
    function get_id() {
      return $this->id;
    }

    function get_enunciado() {
      return $this->enunciado;
    }

    function get_respuesta1() {
      return $this->respuesta1;
    }

    function get_respuesta2() {
        return $this->respuesta2;
      }

    function get_respuesta3() {
    return $this->respuesta3;
    }
    
    function get_correcta() {
      return $this->correcta;
    }

    function get_url() {
      return $this->url;
    }

    function get_tipoUrl() {
        return $this->tipoUrl;
      }
  }
?>