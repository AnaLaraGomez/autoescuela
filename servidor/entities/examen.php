<?php
class Examen {
    // Properties
    public $id;
    public $fecha;
    public $creador;

    // Constructor
    function __construct($id,$fecha, $creador) {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->creador = $creador;
      }
  
    // Methods
    function get_id() {
      return $this->id;
    }

    function get_fecha() {
      return $this->fecha;
    }

    function get_creador() {
        return $this->creador;
      }

  }
?>