<?php
class Intento {
    // Properties
    public $id;
    public $fecha;
    public $JSonResul;

    // Constructor
    function __construct($id,$fecha, $JSonResul) {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->JSonResul = $JSonResul;
      }
  
    // Methods
    function get_id() {
      return $this->id;
    }

    function get_fecha() {
      return $this->fecha;
    }

    function get_JSonResul() {
        return $this->JSonResul;
      }

  }
?>