var dificultadId = 1;
var usuarios = [];
var usuariosObjetivos = [];
var preguntas = [];
var preguntasObjetivos = [];
var preguntasModo = '';

window.addEventListener("load", function() {
    let crearExamenBtn = this.document.getElementById('crearExamenBtn');
    crearExamenBtn.addEventListener('click', () => crearExamen())

    let añadirAlumnoBtn = this.document.getElementById('añadirAlumno');
    añadirAlumnoBtn.addEventListener('click', () => añadirAlumno())

    let preguntas = this.document.getElementById('preguntas');
    let alumnos = this.document.getElementById('alumnos');
    alumnos.style.display = 'none';
    preguntas.style.display = 'none';

    configurarEventosDeSelects();
    cargarUsuariosEnSelect();
    cargarCategorias();
    
    function cargarUsuariosEnSelect() {
        fetch('http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php?all')
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json()
        }).then((users) => {
            let alumnos = users.filter(u => u.rol == 'alumno');
            usuarios = alumnos;
            usuariosObjetivos = alumnos;

            let selectorAlumnos = document.getElementById('selectorAlumnos');
            alumnos.forEach(alumnoActual => {
                let option = document.createElement('option');
                option.innerHTML = alumnoActual.email;
                option.value = alumnoActual.email;
                selectorAlumnos.appendChild(option);
            })
        })
    }

    function cargarCategorias()  {
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiCategoria.php';
        fetch(url)
        .then((respuesta) => {
            return respuesta.json()
        }).then((listaCategorias) => {
            let selectorCategoria = document.getElementById("filtroCategoria");
            listaCategorias.forEach(categoriaActual => {
                let opcionActual = document.createElement("option");
                opcionActual.value = categoriaActual.id;
                opcionActual.innerHTML=categoriaActual.nombre;
                selectorCategoria.appendChild(opcionActual);
            
            });
        })
    }

    function configurarEventosDeSelects() {
        let dificultad = this.document.getElementById('dificultad');
        dificultad.addEventListener('change', (e)=>{
            let val = e.target.value;
            dificultadId = val;
        })
        let alumnosModo = this.document.getElementById('alumnosModo');
        alumnosModo.addEventListener('change', (e)=>{
            let val = e.target.value;
            if(val == 'todos') {
                alumnos.style.display = 'none';
            }else {
                alumnos.style.display = 'unset';
                usuariosObjetivos = [];
            }
        })
        let preguntasModo = this.document.getElementById('preguntasModo');
        preguntasModo.addEventListener('change', (e)=>{
            let val = e.target.value;
            preguntasModo = val;
            if(val == 'aleatorio') {
                preguntas.style.display = 'none';
            }else {
                preguntas.style.display = 'unset';
            }
        })
        let filtroCategoria = this.document.getElementById('filtroCategoria');
        filtroCategoria.addEventListener('change', (e)=>{
            let val = e.target.value;
            cargarPreguntas(val)
        })
    }

    function cargarPreguntas(categoria) {
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiPregunta.php?dificultad=${dificultadId}&categoria=${categoria}`;
        fetch(url)
        .then((respuesta) => {
            return respuesta.json()
        }).then((preguntasJSon) => {
            preguntas = preguntasJSon;
            pintarPreguntas();
        })
    }

    function pintarPreguntas(){
        let tablaPreguntasDisponibles = document.getElementById('preguntasDisponibles');

        limpiarListaPreguntas(tablaPreguntasDisponibles);
        
        preguntas.forEach(preguntaActual => {
            if(preguntasObjetivos.includes(preguntaActual)){
                return;
            }
            let fila = document.createElement('tr');
            fila.setAttribute('data-tipo-fila', 'disponibles');
            let colPregunta = document.createElement('td');
            colPregunta.append(document.createTextNode(preguntaActual.enunciado));
            let colAcciones = document.createElement('td');
            let añadirPreguntaBtn = document.createElement('button');
            añadirPreguntaBtn.appendChild(document.createTextNode('Añadir'));
            añadirPreguntaBtn.classList.add('accept-btn');
            añadirPreguntaBtn.addEventListener('click', () =>{
                añadirPregunta(preguntaActual);
                pintarPreguntasSeleccionadas()
                pintarPreguntas();
            })
            colAcciones.appendChild(añadirPreguntaBtn);
            fila.appendChild(colPregunta);
            fila.appendChild(colAcciones);
            tablaPreguntasDisponibles.appendChild(fila);
        });
    }

    function pintarPreguntasSeleccionadas () {
        let tablaPreguntasSeleccionadas = document.getElementById('preguntasSeleccionadas');

        limpiarListaPreguntas(tablaPreguntasSeleccionadas)

        preguntasObjetivos.forEach(preguntaActual => {
            let fila = document.createElement('tr');
            fila.setAttribute('data-tipo-fila', 'seleccionada');
            let colPregunta = document.createElement('td');
            colPregunta.append(document.createTextNode(preguntaActual.enunciado));
            let colAcciones = document.createElement('td');
            let eliminarPreguntaBtn = document.createElement('button');
            eliminarPreguntaBtn.appendChild(document.createTextNode('Quitar'));
            eliminarPreguntaBtn.classList.add('delete-btn');
            eliminarPreguntaBtn.addEventListener('click', () =>{

                preguntasObjetivos = preguntasObjetivos.filter(preguntaLista => preguntaLista.id != preguntaActual.id);
                pintarPreguntasSeleccionadas();
                pintarPreguntas();
                
            })
            colAcciones.appendChild(eliminarPreguntaBtn);
            fila.appendChild(colPregunta);
            fila.appendChild(colAcciones);
            tablaPreguntasSeleccionadas.appendChild(fila);
        });
    }

    function limpiarListaPreguntas(tabla) {
        let filas = [...tabla.getElementsByTagName('tr')];
        for (let i=0; i < filas.length; i ++) {
            if(filas[i].getAttribute('data-tipo-fila')) {
                filas[i].remove();
            }
        }
    }
    
    function añadirPregunta(pregunta) {
        if(!preguntasObjetivos.includes(pregunta)){
            preguntasObjetivos.push(pregunta);
        }
    }

    function crearExamen() {
        let usuariosObjetivosId = obtenerUsuariosObjetivosIdsEnString();
        let preguntasObjetivosId = obtenerPreguntasObjetivosIdsEnString();
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?dificultad=${dificultadId}&usuariosobjetivos=${usuariosObjetivosId}`;
        url = url.concat(preguntasModo == 'aleatorio' ? '' : `&preguntasobjetivos=${preguntasObjetivosId}`);
        let opciones = {
            method: "POST",
        };
        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json();
        }).then(examenJson => {
            if(examenJson.id != null) {
                let toastExito = document.getElementById("toastExito");
                let parrafoExito = document.createElement("p");
                let texto = document.createTextNode("El examen se ha generado con éxito! 😃👍🏻");
                parrafoExito.append(texto);
                parrafoExito.classList.add("exito");
                toastExito.appendChild(parrafoExito);
                toastExito.style.display = 'inherit';

                setTimeout(() => {
                    toastExito.removeChild(parrafoExito);
                    toastExito.style.display = 'none';
                }, 3000);
            } else {
                let toastError = document.getElementById('toastError');
                toastError.innerHTML = '';
                let parrafoError = document.createElement('p');
                parrafoError.appendChild(document.createTextNode("Opps! Algo ha salido mal"));
                toastError.appendChild(parrafoError);
                toastError.style.display = 'inherit';
                setTimeout(()=> toastError.style.display = 'none', 3000);
            }
        });
    }

    function obtenerUsuariosObjetivosIdsEnString() {
        let ids = [];
        usuariosObjetivos.forEach(usuarioActual => {
            let id = usuarioActual.id;
            ids.push(id)
        })
        return ids.join(',');
    }

    function obtenerPreguntasObjetivosIdsEnString(){
        let ids = [];
        preguntasObjetivos.forEach(preguntaActual => {
            let id = preguntaActual.id;
            ids.push(id)
        })
        return ids.join(',');
    }

    function añadirAlumno() {
        let alumnoSeleccionado = document.getElementById('alumnoSeleccionado').value; 
        for (const usuarioActual of usuarios) {
            if(usuarioActual.email == alumnoSeleccionado) {
                if(usuariosObjetivos.includes(usuarioActual)) {
                    document.getElementById('alumnoSeleccionado').value = '';
                    return;
                }
                usuariosObjetivos.push(usuarioActual);
                break;
            }
        }

        document.getElementById('alumnoSeleccionado').value = '';

        limpiarListaAlumnos();
        pintarListaAlumnos();

    }

    function limpiarListaAlumnos() {
        let alumnosSeleccionados = document.getElementById('alumnosSeleccionados');
        alumnosSeleccionados.innerHTML = '';
    }

    function pintarListaAlumnos() {
        let alumnosSeleccionados = document.getElementById('alumnosSeleccionados');
        usuariosObjetivos.forEach(usuarioActual => {
            let li = document.createElement('li');
            let botonQuitarDeLista = document.createElement('button');
            botonQuitarDeLista.classList.add('delete-btn');
            botonQuitarDeLista.addEventListener('click', () =>{
                usuariosObjetivos = usuariosObjetivos.filter(usuarioLista => usuarioLista != usuarioActual);
                limpiarListaAlumnos();
                pintarListaAlumnos();
            })
            li.appendChild(document.createTextNode(usuarioActual.email));
            li.appendChild(botonQuitarDeLista);
            alumnosSeleccionados.appendChild(li);
        })
    }

});