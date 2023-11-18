window.addEventListener("load", function() {

    // Animacion coche por la cara 🙂
    setInterval(()=>{
        let coche = document.getElementById("coche");
        let señal = document.getElementById("señal");
        coche.classList.remove("coche");
        señal.classList.remove("señal");
        señal
        setTimeout(() =>{
                señal.classList.add("señal");
                coche.classList.add("coche");
        }, 1000)
    }, 36000);


    document.getElementById('logout').addEventListener('click', () => logout());

    let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php';
    fetch(url)
    .then((respuesta) => {
        if(respuesta.redirected) {
            document.location = respuesta.url;
        }
        return respuesta.json()
    }).then((user) => {
        pintarDatosUsuario(user);
    });
    
    function pintarDatosUsuario(user) {    
        if(user.moderado == 0) {
            redireccionar('salaDeEspera/salaDeEspera.html');
            return;
        }
        pintarBotonesEnHeader(user);
        pintarPerfilUsuario(user);
        switch(user.rol) {
            case 'admin':
                // Página por defecto
                redireccionar('gestion/gestion.html');
                break;
            case 'profesor':
                redireccionar('examen/generarExamen.html');
                break;
            case 'alumno':
                redireccionar('examen/examenesAnteriores.html');
                break;   
        }
    }
    
    function pintarBotonesEnHeader(user) {
        switch(user.rol) {
            case 'admin':
                // Añadir los botones de admin
                pintarBoton('Gestión', 'gestion/gestion.html',"gestion")
                pintarBoton('Preguntas', 'preguntas/preguntas.html',"pregunta")
                pintarBoton('Generar Examen', 'examen/generarExamen.html',"generarExamen")

                break;
            case 'profesor':
                // Añadir los botones de profesor
                pintarBoton('Preguntas', 'preguntas/preguntas.html',"pregunta")
                pintarBoton('Generar Examen', 'examen/generarExamen.html',"generarExamen")
                break;
            case 'alumno':
                // Añadir los botones de alumno
                break;   
        }

        // Añadir los botones comunes
        pintarBoton('Exámenes pendientes','examen/examenesPendientes.html','examenesPendientes');
        pintarBoton('Exámenes anteriores','examen/examenesAnteriores.html','examenesAnteriores');
        pintarBoton('Ponte a prueba!','examen/ponteAPrueba.html?tipo=ponteaprueba','examen');

    }

    function pintarBoton(nombre, url,claseIcono) {
        let botones = document.getElementById('botones');
        let boton = document.createElement('li');
        boton.classList.add(claseIcono);
        boton.onclick = () => redireccionar(url);
        let texto = document.createTextNode(nombre);
        boton.append(texto);
        botones.appendChild(boton);
    }

    function redireccionar(url) {
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://autoescuelaprisas.com/autoescuela/interfaz/' + url;
    }

    function pintarPerfilUsuario(user) {
        let nombre = document.getElementById("nombre");
        let rol = document.getElementById("rol");
        nombre.innerHTML = user.email;
        rol.innerHTML = user.rol;
    }

    function logout() {
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiLogout.php';
        let opciones = {
            method: "POST",
        };

        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                // Fuente: https://www.w3schools.com/js/js_cookies.asp
                document.cookie = "AUTOESCUELA_SESSION_ID=; expires=; path=/";
                document.location = respuesta.url;
            }
        })

    }
})




