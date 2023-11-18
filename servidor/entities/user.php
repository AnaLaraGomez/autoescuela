<?php
class Usuario {
    // Properties
    public $id;
    public $email;
    public $password;
    public $rol;
    public $foto;
    public $moderado;
    

    // Constructor
    function __construct($id,$email,$password,$rol,$foto, $moderado) {
        $this->id = $id;
        $this->email = $email;
        $this->password = $password; 
        $this->rol = $rol; 
        $this->foto = $foto;
        $this->moderado = $moderado;
      }
  
    // Methods
    function get_id() {
      return $this->id;
    }

    function get_email() {
      return $this->email;
    }

    function get_password() {
      return $this->password;
    }
    
    function get_rol() {
      return $this->rol;
    }

    function get_foto() {
      return $this->foto;
    }

    function get_moderado() {
      return $this->moderado;
    }

    function set_moderado($value) {
      $this->moderado = $value;
    }
    
    function set_rol($value) {
      $this->rol = $value;
    }
  }
?>