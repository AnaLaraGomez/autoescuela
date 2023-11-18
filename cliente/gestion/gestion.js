var pendientes = [];
var  usuariosActuales = [];

window.addEventListener("load", function() {
    var btnAltaUsuario = document.getElementById("crearUsuario");
    btnAltaUsuario.addEventListener("click",() => document.getElementById("altaUsuarioModal").style.visibility = 'visible');
    var btnCancelarModal = document.getElementById("btnCancelarModal");
    btnCancelarModal.addEventListener("click",() => document.getElementById("altaUsuarioModal").style.visibility = 'hidden');
    var btnAltaUsuarioModal = document.getElementById("btnAltaUsuarioModal");
    btnAltaUsuarioModal.addEventListener("click",() => altaUsuario());


    let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php?all';
    fetch(url)
    .then((respuesta) => {
        if(respuesta.redirected) {
            document.location = respuesta.url;
        }
        return respuesta.json()
    }).then((usuarios) => {
        pendientes = usuarios.filter((usuarioActual) => usuarioActual.moderado == 0);
        usuariosActuales = usuarios.filter((usuarioActual) => usuarioActual.moderado == 1);
        pintarUsuarios();
    });

    function pintarUsuarios() {
        let tablaUsuariosActuales = document.getElementById('usuariosActuales');
        let tablaUsuariosPendientes = document.getElementById('usuariosPendientes');

        pendientes.forEach(pendienteActual => {
            let fila = document.createElement('tr');
            fila.setAttribute('data-tipo-fila', 'pendiente');
            let colUsuario = document.createElement('td');
            colUsuario.classList.add('descripcion');
            colUsuario.append(document.createTextNode(pendienteActual.email));
            let colRol = document.createElement('td');
            let selectorRoles = document.createElement('select');
            let rol1 = document.createElement('option');
            let rol2 = document.createElement('option');
            let rol3 = document.createElement('option');
            rol1.append('admin');
            rol2.append('profesor');
            rol3.append('alumno');
            selectorRoles.appendChild(rol1);
            selectorRoles.appendChild(rol2);
            selectorRoles.appendChild(rol3);
            selectorRoles.value = pendienteActual.rol;
            selectorRoles.addEventListener('change', (evento) => {pendienteActual.rol = evento.target.value})
            colRol.append(selectorRoles);

            let colAcciones = document.createElement('td');
            let denegarBtn = document.createElement('button');
            denegarBtn.appendChild(document.createTextNode('Denegar'));
            denegarBtn.classList.add('denied-btn');
            denegarBtn.addEventListener('click', () => denegarUsuarioPendiente(pendienteActual));
            let aceptarBtn = document.createElement('button');
            aceptarBtn.appendChild(document.createTextNode('Aceptar'));
            aceptarBtn.addEventListener('click', () => aceptarUsuario(pendienteActual));
            aceptarBtn.classList.add('accept-btn');
            colAcciones.appendChild(denegarBtn);
            colAcciones.appendChild(aceptarBtn);
            fila.appendChild(colUsuario);
            fila.appendChild(colRol);
            fila.appendChild(colAcciones);
            tablaUsuariosPendientes.appendChild(fila);
        });

        usuariosActuales.forEach(usuarioActual => {
            let fila = document.createElement('tr');
            fila.setAttribute('data-tipo-fila', 'actuales')
            let colUsuario = document.createElement('td');
            colUsuario.classList.add('descripcion');
            colUsuario.append(document.createTextNode(usuarioActual.email))
            let colRol = document.createElement('td');
            let selectorRoles = document.createElement('select');
            let rol1 = document.createElement('option');
            let rol2 = document.createElement('option');
            let rol3 = document.createElement('option');
            rol1.append('admin');
            rol2.append('profesor');
            rol3.append('alumno');
            selectorRoles.appendChild(rol1);
            selectorRoles.appendChild(rol2);
            selectorRoles.appendChild(rol3);
            selectorRoles.value = usuarioActual.rol;
            selectorRoles.addEventListener('change', (event) => {usuarioActual.rol = event.target.value})
            colRol.append(selectorRoles);
            let colAcciones = document.createElement('td');
            let eliminarBtn = document.createElement('button');
            eliminarBtn.appendChild(document.createTextNode('Eliminar'));
            eliminarBtn.classList.add('delete-btn');
            eliminarBtn.addEventListener('click', () => denegarUsuarioPendiente(usuarioActual));
            let editarBtn = document.createElement('button');
            editarBtn.appendChild(document.createTextNode('Guardar'));
            editarBtn.addEventListener('click', () => aceptarUsuario(usuarioActual));
            editarBtn.classList.add('edit-btn');
            colAcciones.appendChild(eliminarBtn);
            colAcciones.appendChild(editarBtn);
            
            fila.appendChild(colUsuario);
            fila.appendChild(colRol);
            fila.appendChild(colAcciones);

            tablaUsuariosActuales.appendChild(fila);
        });
    }

    function limpiarTablas() {
        let filasTotales = [...document.getElementsByTagName('tr')];
        for (let i=0; i < filasTotales.length; i ++) {
            if(filasTotales[i].getAttribute('data-tipo-fila')) {
                filasTotales[i].remove();
            }
        }
    }

    function denegarUsuarioPendiente(usuario) {
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php?userId=${usuario.id}`;
        let opciones = {
            method: "DELETE",
        };
        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json();
        }).then((respuestaOperacion) => {
            if(respuestaOperacion.succeed) {
                pendientes = pendientes.filter((actual) => actual.id != usuario.id)
                usuariosActuales = usuariosActuales.filter((actual) => actual.id != usuario.id)
                limpiarTablas();
                pintarUsuarios();
            } 
        });
    }

    function aceptarUsuario(usuario) {
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php?userId=${usuario.id}&moderado=1&rol=${usuario.rol}`;
        let opciones = {
            method: "PUT",
        };
        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json();
        }).then((respuestaOperacion) => {
            if(respuestaOperacion.succeed) {
                pendientes = pendientes.filter((actual) => actual.id != usuario.id)
                usuariosActuales = usuariosActuales.filter((actual) => actual.id != usuario.id)
                usuariosActuales.push(usuario);
                limpiarTablas();
                pintarUsuarios();
                let toastExito = document.getElementById('toastExito');
                toastExito.innerHTML = '';
                let texto = document.createElement('p');
                texto.appendChild(document.createTextNode("Has modificado el usuario correctamente"));
                toastExito.appendChild(texto);
                toastExito.style.display = 'inherit';
                setTimeout(()=> toastExito.style.display = 'none', 2000);
            } 
        });
    }

    function altaUsuario(){
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php`;
        let formularioAEnviar = document.getElementById("altaUsuario");

        let opciones = {
            method: "POST",
            body: new FormData(formularioAEnviar)
        };
        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json();
        }).then(respuestaJson =>{
            limpiaErrores();
            let grupoUsuario = document.getElementById("grupoUsuario");
            let grupoPassword = document.getElementById("grupoPassword");
            let grupoRol = document.getElementById("grupoRol");

            crearError(grupoUsuario, respuestaJson.usuario);
            crearError(grupoPassword, respuestaJson.password);
            crearError(grupoRol, respuestaJson.rol);
            crearError(grupoUsuario,respuestaJson.usuarioExiste);
            
            if(respuestaJson.succeed){
                let mensajeExito = document.getElementById("mensajeExito");
                let parrafoExito = document.createElement("p");
                let texto = document.createTextNode("El usuario se ha dado de alta con éxito! 😃👍🏻");
                parrafoExito.append(texto);
                parrafoExito.classList.add("exito");
                mensajeExito.appendChild(parrafoExito);
                
                // Añadimos a la lista de usuarios el que acabamos de crear
                let usuarioCreado = {
                    email: document.forms["altaUsuario"].usuario.value ,
                    rol: document.forms["altaUsuario"].rol.value
                };
                usuariosActuales.push(usuarioCreado)
                limpiarTablas();
                pintarUsuarios();

                setTimeout(() => {
                    mensajeExito.removeChild(parrafoExito);
                    formularioAEnviar.reset();
                }, 3000);
                return;
            }

        })

    }
    

});