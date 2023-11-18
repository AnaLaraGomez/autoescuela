<?php
class Categoria {
    // Properties
    public $id;
    public $nombre;

    // Constructor
    function __construct($id,$nombre) {
        $this->id = $id;
        $this->nombre = $nombre;
      }
  
    // Methods
    function get_id() {
      return $this->id;
    }

    function get_nombre() {
      return $this->nombre;
    }

  }
?>