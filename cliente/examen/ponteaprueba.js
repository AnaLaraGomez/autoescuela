
var plantillaPregunta = 
`
<form class="pregunta">
    <div class="cabecera">
        <p class="identificador"></p>
        <p class="titulo"></p>
        <div class= "multimedia"></div>
    </div>
    <div class="respuestas">
        <input type="radio" name="respuesta" class="respuesta1" /><label class="respuesta1"></label></br>
        <input type="radio" name="respuesta" class="respuesta2" /><label class="respuesta2"></label></br>
        <input type="radio" name="respuesta" class="respuesta3" /><label class="respuesta3"></label></br>
    </div>
    <div class="botones">
        <button class="boton-secundario" type= "reset"> Borrar respuesta </button>  
        <label><input type="checkbox" class= "dudosaBtn" name="estado" value="dudosa">Dudosa</label>
    </div>
</form>
`

var preguntaPosicionActual = 0;
var examenGlobal;
var respuestaGlobal;
var dudosas = [];
var contestadas = [];

window.addEventListener("load", function() {
    let urlDeLaPagina = document.location.href;
    if(urlDeLaPagina.includes('tipo=ponteaprueba') ) {
        // cargar las cosas concretas de ponte a prueba
        let comenzarExamenBtn = document.getElementById("comenzarExamenBtn");
        comenzarExamenBtn.addEventListener('click',()=> comenzarExamen());
    } else if(urlDeLaPagina.includes('tipo=examen')) {
        let filtros = this.document.getElementById('filtros');
        filtros.style.display = 'none';

        // obtenemos el examenId
        let examenId = urlDeLaPagina.split('&examenId=')[1];
        obtenerExamenPorId(examenId);   
    }

    
    let prevBtn = document.getElementsByClassName('prev-btn')[0];
    let nextBtn = document.getElementsByClassName('next-btn')[0];
    let enviarExamenBtn = document.getElementById('enviarExamen');

    prevBtn.style.visibility="hidden";
    nextBtn.style.visibility="hidden";

    enviarExamenBtn.addEventListener('click',()=> enviarExamen());

    function obtenerExamenPorId(examenId) {
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?examen=${examenId}`;
        fetch(url)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json()
        }).then(examenJson => {
            inicializarRespuesta(examenJson);
            pintarExamen(examenJson);
        })
    }

    function comenzarExamen() {    
        // hacemos una llamada al servidor
        //  ??? pasando una categorya y una dificultad ???
        // Y el servidor nos responde con el 'posibleExamen'
    
        // Depemos pintar el 'posibleExamen' en el html
        fetch('http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php')
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json()
        }).then((user) => {
            // Obtener mi UserId
            let dificultadId = 1;
            let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?dificultad=${dificultadId}&usuariosobjetivos=${user.id}`;
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
                    inicializarRespuesta(examenJson);
                    pintarExamen(examenJson);
                });
        });
    }

    function enviarExamen() {
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?examen=${examenGlobal.id}`;
        let opciones = {
            method: "PUT",
            body: JSON.stringify(respuestaGlobal)
        };
        fetch(url, opciones)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json();
        }).then((respuestaOperacion) => {
            if(respuestaOperacion.succeed) {
                let toastExito = document.getElementById("toastExito");
                let parrafoExito = document.createElement("p");
                let texto = document.createTextNode("El examen se ha guardado con éxito! 😃👍🏻. Redirigiendo a la página de exámenes anteriores...");
                parrafoExito.append(texto);
                parrafoExito.classList.add("exito");
                toastExito.appendChild(parrafoExito);
                toastExito.style.display = 'inherit';
                localStorage.removeItem(`examen-${examenGlobal.id}`);


                setTimeout(() => {
                    toastExito.removeChild(parrafoExito);
                    toastExito.style.display = 'none';
                    document.location = 'http://autoescuelaprisas.com/autoescuela/interfaz/examen/examenesAnteriores.html';
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

    function pintarExamen(examen) {
        examenGlobal = examen
        let contenedorExamen = document.getElementById('examen');
        let navegadorExamen = document.getElementById('navegadorExamen');
        navegadorExamen.style.visibility="visible";

        let prevBtn = document.getElementsByClassName('prev-btn')[0];
        prevBtn.style.visibility="visible";

        prevBtn.addEventListener('click', () => {
            let nuevaPosicion = Math.max(0, preguntaPosicionActual-1)
            seleccionaPreguntaPorPosicion(nuevaPosicion)
        })
        let nextBtn = document.getElementsByClassName('next-btn')[0];
        nextBtn.style.visibility="visible";

        nextBtn.addEventListener('click', () => {
            let nuevaPosicion = Math.min(examenGlobal.preguntas.length-1, preguntaPosicionActual+1)
            seleccionaPreguntaPorPosicion(nuevaPosicion)
        })

        let ul = document.createElement('ul');
        
        document.getElementById('controles').style.visibility = 'visible';

        for(let i = 0; i < examen.preguntas.length ; i++) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(i+1))
            li.setAttribute('id', `selector-${i}`);
            li.addEventListener('click', () => {
                seleccionaPreguntaPorPosicion(i);
            })
            ul.appendChild(li)
        }

        navegadorExamen.appendChild(ul);
        
        pintarTodasLasPreguntas();     

        seleccionaPreguntaPorPosicion(0);
    }

    function pintarTodasLasPreguntas() {
        // Pintar todas las preguntas 
        
        let examenLocal = localStorage.getItem(`examen-${examenGlobal.id}`);
        examenLocal = examenLocal ? JSON.parse(examenLocal): [];
        respuestaGlobal = examenLocal;
        
        for(let i = 0; i < examenGlobal.preguntas.length; i++) {
            let preguntaActual = examenGlobal.preguntas[i];
            let contenedorPreguntas = document.getElementById('preguntas');
            let preguntaDiv = document.createElement('div');
            preguntaDiv.classList.add('pregunta-contenedor');
            preguntaDiv.innerHTML = plantillaPregunta;
            preguntaDiv.getElementsByClassName('pregunta')[0].setAttribute('id', `pregunta-${i}`)
            preguntaDiv.getElementsByClassName('titulo')[0].appendChild(document.createTextNode(preguntaActual.enunciado));
            preguntaDiv.getElementsByClassName('identificador')[0].appendChild(document.createTextNode('pregunta #' + preguntaActual.id));

            if(preguntaActual.url != null  &&  preguntaActual.url != undefined ) {
                if(preguntaActual.tipoURL.includes('image')) {
                    let media = document.createElement('img');
                    media.src = preguntaActual.url;
                    preguntaDiv.getElementsByClassName('multimedia')[0].appendChild(media);
                } else {
                    let media = document.createElement('video');
                    media.src = preguntaActual.url;
                    media.type = preguntaActual.tipoURL;
                    //media.setAttribute("autoplay",'');
                    //media.setAttribute("loop",'');
                    //media.setAttribute("muted",'');
                    media.onclick=function(){this.play()}
                    preguntaDiv.getElementsByClassName('multimedia')[0].appendChild(media);
                }
            }

            // find devuelve undefined/null si no lo encuentra o el objeto si lo encuentra
            let preguntaLocal = examenLocal.find(resp => resp.id == preguntaActual.id);
            let respSeleccionada = preguntaLocal ? preguntaLocal.respuesta : '';

            if(respSeleccionada != ''){
                if(!contestadas.includes(i)) {
                    contestadas.push(i)
                }
            }

            preguntaDiv.getElementsByClassName('respuesta1')[0].value = 1;
            preguntaDiv.getElementsByClassName('respuesta1')[0].addEventListener('click', () => registrarRespuesta(i, preguntaActual.id, '1'))
            preguntaDiv.getElementsByClassName('respuesta1')[1].innerHTML = preguntaActual.respuesta1;
            if(respSeleccionada == '1') {
                preguntaDiv.getElementsByClassName('respuesta1')[0].checked = true;
            }
            preguntaDiv.getElementsByClassName('respuesta2')[0].value = 2;
            preguntaDiv.getElementsByClassName('respuesta2')[0].addEventListener('click', () => registrarRespuesta(i, preguntaActual.id, '2'))
            preguntaDiv.getElementsByClassName('respuesta2')[1].innerHTML = preguntaActual.respuesta2;
            if(respSeleccionada == '2') {
                preguntaDiv.getElementsByClassName('respuesta2')[0].checked = true;
            }
    
            preguntaDiv.getElementsByClassName('respuesta3')[0].value = 3;
            preguntaDiv.getElementsByClassName('respuesta3')[0].addEventListener('click', () => registrarRespuesta(i, preguntaActual.id, '3'))
            preguntaDiv.getElementsByClassName('respuesta3')[1].innerHTML = preguntaActual.respuesta3;
            if(respSeleccionada == '3') {
                preguntaDiv.getElementsByClassName('respuesta3')[0].checked = true;
            }
            
            preguntaDiv.getElementsByClassName('dudosaBtn')[0]
                    .addEventListener('change', (event) => {
                        let estaSeleccionado = event.target.checked;
                        if(estaSeleccionado) {
                            dudosas.push(i);
                        } else {
                            dudosas = dudosas.filter(dudosaId => dudosaId != i);
                        }
                        pintarDudosas();
                    });

            preguntaDiv.addEventListener('reset' , (event) => {
                dudosas = dudosas.filter(dudosaId => dudosaId != i);
                pintarDudosas();

                respuestaGlobal.find(resp => resp.id == preguntaActual.id).respuesta = '';
                localStorage.setItem(`examen-${examenGlobal.id}`, JSON.stringify(respuestaGlobal));
                contestadas = contestadas.filter(pId => pId != i);
                pintarContestadas();
            });        

            contenedorPreguntas.appendChild(preguntaDiv);
        }
        pintarContestadas();
    }

    function limpiarPregunta() {
        let elementoSeleccionado = [...document.getElementsByClassName('seleccionado')];
        for(let i= 0; i < elementoSeleccionado.length; i++) {
            elementoSeleccionado[i].classList.remove('seleccionado');
        }
    }

    function seleccionaPreguntaPorPosicion(posicion) {
        limpiarPregunta();
        let li = document.getElementById(`selector-${posicion}`)
        li.classList.add('seleccionado');
        let pregunta = document.getElementById(`pregunta-${posicion}`)
        pregunta.classList.add('seleccionado');
        preguntaPosicionActual = posicion;
    }

    function inicializarRespuesta(examen) {
        respuestaGlobal = [];
        examen.preguntas.forEach(preguntaActual => {
            let pregunta = {
                id: preguntaActual.id,
                respuesta: ''
            };
            
            respuestaGlobal.push(pregunta);
        })
    }

    function registrarRespuesta(posicion, preguntaId, respuesta) {
        for (const respuestaActual of respuestaGlobal) {
            if(respuestaActual.id == preguntaId) {
                respuestaActual.respuesta = respuesta;
                localStorage.setItem(`examen-${examenGlobal.id}`, JSON.stringify(respuestaGlobal));
                if(!contestadas.includes(posicion)) {
                    contestadas.push(posicion)
                    pintarContestadas();
                }
                break;
            }
        }
    }

    function pintarDudosas() {
        // limpiar las clases
        let elementoSeleccionado = [...document.getElementsByClassName('dudosa')];
        for(let i= 0; i < elementoSeleccionado.length; i++) {
            elementoSeleccionado[i].classList.remove('dudosa');
        }
        
        dudosas.forEach(dudosaId => {
            let li = document.getElementById(`selector-${dudosaId}`)
            li.classList.add('dudosa');
        })
    }

    function pintarContestadas() {
        // limpiar las clases
        let elementoSeleccionado = [...document.getElementsByClassName('contestada')];
        for(let i= 0; i < elementoSeleccionado.length; i++) {
            elementoSeleccionado[i].classList.remove('contestada');
        }

        contestadas.forEach(contestadaId => {
            let li = document.getElementById(`selector-${contestadaId}`)
            li.classList.add('contestada');
        })
    }
});

