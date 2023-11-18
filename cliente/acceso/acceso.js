

window.addEventListener("load", function() {
    let ojo = document.getElementById("ojo");
    ojo.addEventListener('click', () =>{
        let password = document.getElementById("password");
        if (password.type == 'password') {
            password.type = 'text';
            ojo.style.backgroundImage = "url('http://autoescuelaprisas.com/autoescuela/interfaz/images/eye.png')";
        } else {
            password.type = 'password';
            ojo.style.backgroundImage = "url('http://autoescuelaprisas.com/autoescuela/interfaz/images/sin-ver.png')";
        }
    });
});

function login() {
    let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiLogin.php';
    let formularioAEnviar = document.getElementById("login");

    let opciones = {
        method: "POST",
        body: new FormData(formularioAEnviar),
    };

    fetch(url, opciones)
    .then((respuesta) => {
        if(respuesta.redirected) {
            // si la api ha mandado un header Location, nos vamosa esa url
            document.location = respuesta.url;
        }

        return respuesta.json()
    })
    .then((respuestaEnJson) => {
        limpiaErrores();

        // Pintar los errores
        let grupoUsuario = document.getElementById("grupoUsuario");
        let grupoPassword = document.getElementById("grupoPassword");

        crearError(grupoUsuario,respuestaEnJson['usuario'])
        crearError(grupoPassword,respuestaEnJson['password'])
        crearError(grupoUsuario,respuestaEnJson['usuario2'])
        crearError(grupoPassword,respuestaEnJson['password2'])
    })
}

function registrar() {
    let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiRegistro.php';
    let formularioAEnviar = document.getElementById("registro");
    let opciones = {
        method: "POST",
        body: new FormData(formularioAEnviar),
    };

    fetch(url, opciones)
    .then((respuesta) => {
        if(respuesta.redirected) {
            // si la api ha mandado un header Location, nos vamosa esa url
            let mensajeExito = document.getElementById("mensajeExito");
            let parrafoExito = document.createElement("p");
            let texto = document.createTextNode("Se ha realizado el registro con éxito. Se te redireccionará al login en unos segundos");
            parrafoExito.append(texto);
            parrafoExito.classList.add("exito");
            mensajeExito.appendChild(parrafoExito);

            setTimeout(() =>  document.location = respuesta.url, 5000);
            return {};
        }
        return respuesta.json();
    }).then((respuestaEnJson) => {
        limpiaErrores();

        let grupoUsuario = document.getElementById("grupoUsuario");
        let grupoPassword = document.getElementById("grupoPassword");
        let grupoPassword2 = document.getElementById("grupoPassword2");

        crearError(grupoUsuario,respuestaEnJson['usuarioExiste']);
        crearError(grupoUsuario,respuestaEnJson['usuario']);
        crearError(grupoPassword,respuestaEnJson['password']);
        crearError(grupoPassword2,respuestaEnJson['password2']);
        crearError(grupoPassword2,respuestaEnJson['passwordDiferente']);
        
    })
}

function crearError(grupo, error){
    if(error) {
        let parrafoError = document.createElement("p");
        let texto = document.createTextNode(error);
        parrafoError.append(texto);
        parrafoError.classList.add("error");
        grupo.appendChild(parrafoError);
    }
}

function limpiaErrores() {
    // Por alguna razon, hay que clonar la lista para que no se 
    // lie con los otros errores que se crearan despues.
    let errores = [...document.getElementsByClassName("error")];
    for (const elementoActual of errores) {
        elementoActual.remove(); 
    }
}

