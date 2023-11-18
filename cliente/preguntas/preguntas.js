var listaPreguntas = [];
var listaCategorias = [];

window.addEventListener("load", function() {
    let modalCrearPregunta = document.getElementById('modalCrearPregunta');
    let modalEditarPregunta = document.getElementById('modalEditarPregunta');
    let btnCrearPregunta = document.getElementById('btnCrearPregunta');
    let btnCancelarModal = document.getElementById('btnCancelarModal');
    let btnGuardarModal = document.getElementById('btnGuardarModal');
    let crearCategoriaBtn = document.getElementById('crearCategoriaBtn');
    let buscarPreguntasBtn = document.getElementById('buscarPreguntasBtn');
    let btnCancelarModalEditar = document.getElementById('btnCancelarModalEditar');
    let btnGuardarModalEditar = document.getElementById('btnGuardarModalEditar');
    
    btnCrearPregunta.addEventListener('click', () => modalCrearPregunta.style.visibility = 'visible');
    btnCancelarModal.addEventListener('click', () => modalCrearPregunta.style.visibility = 'hidden');
    btnCancelarModalEditar.addEventListener('click', () => modalEditarPregunta.style.visibility = 'hidden');

    btnGuardarModal.addEventListener('click', () => guardarPregunta());
    crearCategoriaBtn.addEventListener('click', () => crearCategoria());
    buscarPreguntasBtn.addEventListener('click', () => listarPreguntas());
    btnGuardarModalEditar.addEventListener('click', () => modificarPregunta());

    cargarCategorias();
    
    function listarPreguntas()  {
        let dificultad = document.getElementById('filtroDificultad').value;
        let categoria = document.getElementById('filtroCategoria').value;
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiPregunta.php?dificultad=${dificultad}&categoria=${categoria}`;
        fetch(url)
        .then((respuesta) => {
            return respuesta.json()
        }).then((preguntas) => {
            listaPreguntas = preguntas;
            limpiarPreguntas();
            pintarPreguntas();
        });
    }

    function pintarPreguntas() {
        let bateriaPreguntas = document.getElementById('bateriaPreguntas');
        listaPreguntas.forEach(preguntaActual => {
            let pregunta = document.createElement('div');
            pregunta.classList.add('pregunta');
            let multimedia = document.createElement('div');
            multimedia.classList.add('multimedia');
            if(preguntaActual.url != null  &&  preguntaActual.url != undefined ) {
                if(preguntaActual.tipoUrl.includes('image')) {
                    let media = document.createElement('img')
                    media.src = preguntaActual.url;
                    multimedia.appendChild(media);

                } else {
                    let media = document.createElement('video')
                    media.src = preguntaActual.url;
                    media.type = preguntaActual.tipoUrl;
                    multimedia.appendChild(media);
                }
                
            }
           
            let enunciados = document.createElement('div');
            enunciados.classList.add('enunciados');
            let titulo = document.createElement('p');
            titulo.classList.add('titulo');
            titulo.appendChild(document.createTextNode(preguntaActual.enunciado));
            let tick = document.createElement('span');
            tick.classList.add('accept-btn');
            tick.innerHTML='correcta';
            let correcta = parseInt(preguntaActual.correcta);
            let respuestas = document.createElement('ol');
            respuestas.type = 'A';
            let respuesta1 = document.createElement('li');
            
            respuesta1.appendChild(document.createTextNode(preguntaActual.respuesta1))
            if(correcta == 1) {
                respuesta1.appendChild(tick);
            }

            let respuesta2 = document.createElement('li');
            respuesta2.appendChild(document.createTextNode(preguntaActual.respuesta2))
            if( correcta == 2) {
                respuesta2.appendChild(tick);
            }
            
            let respuesta3 = document.createElement('li');
            respuesta3.appendChild(document.createTextNode(preguntaActual.respuesta3))
            if(correcta == 3) {
                respuesta3.appendChild(tick);
            }

            respuestas.appendChild(respuesta1);
            respuestas.appendChild(respuesta2);
            respuestas.appendChild(respuesta3);

            enunciados.appendChild(titulo);
            enunciados.appendChild(respuestas);

            let botones = document.createElement('div');
            botones.classList.add('botones');

            let botonEditar = document.createElement('button');
            botonEditar.classList.add('edit-btn');
            botonEditar.innerHTML='Editar';
            botonEditar.addEventListener('click',()=> {
                document.getElementById('modalEditarPregunta').style.visibility = 'visible';
                rellenarModalEdicionPregunta(preguntaActual.id);
            });

            let botonEliminar = document.createElement('button');
            botonEliminar.classList.add('delete-btn');
            botonEliminar.innerHTML='Eliminar';
            botonEliminar.addEventListener('click', () => eliminarPregunta(preguntaActual.id));

            botones.appendChild(botonEditar);
            botones.appendChild(botonEliminar);

            pregunta.appendChild(multimedia);
            pregunta.appendChild(enunciados);
            pregunta.appendChild(botones);

            bateriaPreguntas.appendChild(pregunta);
            
        });
    }

    function limpiarPreguntas(){
        let bateriaPreguntas = document.getElementById('bateriaPreguntas');
        bateriaPreguntas.innerHTML = "";
    }

    function guardarPregunta() {
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiPregunta.php';
        let formularioAEnviar = document.getElementById("crearPregunta");
    
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
            if(respuestaEnJson.succeed) {
                let mensajeExito = document.getElementById("mensajeExito");
                let parrafoExito = document.createElement("p");
                let texto = document.createTextNode("La pregunta se ha guardado con éxito! 😃👍🏻");
                parrafoExito.append(texto);
                parrafoExito.classList.add("exito");
                mensajeExito.appendChild(parrafoExito);
                mensajeExito.style.display = 'inherit';
                //Solicitamos de forma automática la nueva lista de preguntas
                listarPreguntas();

                setTimeout(() => {
                    mensajeExito.removeChild(parrafoExito);
                    mensajeExito.style.display = 'none';

                    formularioAEnviar.reset();
                }, 3000);
                return;
            }
            // Pintar los errores
            let grupoEnunciado = document.getElementById("grupoEnunciado");
            let grupoRespuesta1 = document.getElementById("grupoRespuesta1");
            let grupoRespuesta2 = document.getElementById("grupoRespuesta2");
            let grupoRespuesta3 = document.getElementById("grupoRespuesta3");
            let grupoRespuestaCorrecta = document.getElementById("grupoRespuestaCorrecta");
    
            crearError(grupoEnunciado,respuestaEnJson['enunciado'])
            crearError(grupoRespuesta1,respuestaEnJson['respuesta1'])
            crearError(grupoRespuesta2,respuestaEnJson['respuesta2'])
            crearError(grupoRespuesta3,respuestaEnJson['respuesta3'])
            crearError(grupoRespuestaCorrecta,respuestaEnJson['correcta'])
        })
    }

    function eliminarPregunta(preguntaId){
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiPregunta.php?preguntaId=${preguntaId}`;
        let opciones = {
            method: "DELETE",
        };
        fetch(url,opciones)
        .then((respuesta) => {
            return respuesta.json()
        }).then (respuestaJson => {
            if(!respuestaJson.succeed){
                // hacemos un toast
                let toastError = document.getElementById('toastError');
                toastError.innerHTML = '';
                let texto = document.createElement('p');
                texto.appendChild(document.createTextNode("Opps! Algo ha salido mal"));
                toastError.appendChild(texto);
                toastError.style.display = 'inherit';
                setTimeout(()=> toastError.style.display = 'none', 3000);
                return;
            }
            listarPreguntas();
        })

    }

    function modificarPregunta() {
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiPregunta.php?editar';
        let formularioAEnviar = document.getElementById("editarPregunta");
    
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
            if(respuestaEnJson.succeed) {
                let mensajeExito = document.getElementById("mensajeExitoEditar");
                let parrafoExito = document.createElement("p");
                let texto = document.createTextNode("La pregunta se ha editado con éxito! 😃👍🏻");
                parrafoExito.append(texto);
                parrafoExito.classList.add("exito");
                mensajeExito.appendChild(parrafoExito);
                mensajeExito.style.display = 'inherit';
                //Solicitamos de forma automática la nueva lista de preguntas
                listarPreguntas();

                setTimeout(() => {
                    mensajeExito.removeChild(parrafoExito);
                    mensajeExito.style.display = 'none';
                    modalEditarPregunta.style.visibility = 'hidden'
                }, 3000);
                return;
            } else {
                // Pintar los errores
            let grupoEnunciado = document.getElementById("grupoEnunciadoEditar");
            let grupoRespuesta1 = document.getElementById("grupoRespuesta1Editar");
            let grupoRespuesta2 = document.getElementById("grupoRespuesta2Editar");
            let grupoRespuesta3 = document.getElementById("grupoRespuesta3Editar");
            let grupoRespuestaCorrecta = document.getElementById("grupoRespuestaCorrectaEditar");
    
            crearError(grupoEnunciado,respuestaEnJson['enunciado'])
            crearError(grupoRespuesta1,respuestaEnJson['respuesta1'])
            crearError(grupoRespuesta2,respuestaEnJson['respuesta2'])
            crearError(grupoRespuesta3,respuestaEnJson['respuesta3'])
            crearError(grupoRespuestaCorrecta,respuestaEnJson['correcta']) 
            }
        })
    }

    function cargarCategorias()  {
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiCategoria.php';
        fetch(url)
        .then((respuesta) => {
            return respuesta.json()
        }).then((categorias) => {
            listaCategorias = categorias;
            pintarCategorias();
        }).then(() => {
            listarPreguntas();
        })
    }

    function crearCategoria() {
        let crearCategoriaNombre = document.getElementById('crearCategoria').value;
        let url = 'http://autoescuelaprisas.com/autoescuela/servidor/api/apiCategoria.php';
        let opciones = {
            method: "POST",
            // Fuente: https://stackoverflow.com/questions/65290485/js-fetch-post-works-but-php-is-empty
            headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
            body: `nombre=${crearCategoriaNombre}`,
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
            let crearCategoriaFormulario = document.getElementById('crearCategoriaFormulario');
            crearError(crearCategoriaFormulario,respuestaEnJson['nombre']);
            if(respuestaEnJson.succeed) {
                document.getElementById('crearCategoria').value = '';
                let id = respuestaEnJson.categoriaId;
                let categoriaNueva = {id: id, nombre: crearCategoriaNombre };
                listaCategorias.push(categoriaNueva);
                pintarCategorias()
            }

        })

    }

    function pintarCategorias(){
        let selectorCategoria = document.getElementsByClassName("categorias");
        for(let i = 0; i<selectorCategoria.length; i++){
            selectorCategoria[i].innerHTML = '';
            listaCategorias.forEach(categoriaActual => {
                let opcionActual = document.createElement("option");
                opcionActual.value = categoriaActual.id;
                opcionActual.innerHTML=categoriaActual.nombre;
                selectorCategoria[i].appendChild(opcionActual);
            });
        }
        

    };

    function rellenarModalEdicionPregunta(preguntaId) {
        limpiaErrores();

        // encontrar la pregunta a editar
        let pregunta;
        for (const preguntaActual of listaPreguntas) {
            if(preguntaActual.id == preguntaId) {
                pregunta = preguntaActual;
                break;
            }
        } 

        let urlVideo = document.getElementById('urlVideo');

        // capturar el formulario y rellenarlo
        let formularioEditar = document.forms["modalEditarPregunta"];
        formularioEditar.urlImg.src = ''
        urlVideo.src = '';
        formularioEditar.archivo.value = '';

        formularioEditar.preguntaId.value = preguntaId;
        formularioEditar.enunciado.value = pregunta.enunciado;
        formularioEditar.respuesta1.value = pregunta.respuesta1;
        formularioEditar.respuesta2.value = pregunta.respuesta2;
        formularioEditar.respuesta3.value = pregunta.respuesta3;
        formularioEditar.correcta.value = pregunta.correcta;
        formularioEditar.url.value = pregunta.url;
        formularioEditar.tipoUrl.value = pregunta.tipoUrl;
        if(pregunta.tipoUrl.includes('image')) {
            formularioEditar.urlImg.src = pregunta.url;
        } else {
            urlVideo.src = pregunta.url;
            urlVideo.type = pregunta.tipoURL;
        }
    }
});