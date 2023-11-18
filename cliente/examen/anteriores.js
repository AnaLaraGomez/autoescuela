window.addEventListener("load", function() {

    let examenesAnterioresPorAlumnoContenedor = document.getElementById('examenesAnterioresPorAlumnoContenedor');
    examenesAnterioresPorAlumnoContenedor.style.display = 'none';
    fetch('http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php')
    .then((respuesta) => {
        if(respuesta.redirected) {
            document.location = respuesta.url;
        }
        return respuesta.json()
    }).then((user) => {
        if(user.rol == 'admin'|| user.rol == 'profesor') {
            examenesAnterioresPorAlumnoContenedor.style.display = 'unset';
            cargarUsuariosEnSelect();
            let verExamenesAlumnoBtn = document.getElementById('verExamenesAlumnoBtn');
            let examenesAnterioresPorAlumno = document.getElementById('examenesAnterioresPorAlumno');
            let selectorAlumnos = document.getElementById('selectorAlumnos');
            
            verExamenesAlumnoBtn.addEventListener('click', () => {
                let userId = selectorAlumnos.value;
                cargaExamenesAnteriores(userId, examenesAnterioresPorAlumno);
            });
        }
    
    })

    let examenesAnteriores = document.getElementById('examenesAnteriores');
    cargaExamenesAnteriores('', examenesAnteriores);

    function cargaExamenesAnteriores(userId, examenesAnteriores){
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?tipo=anteriores&user=${userId}`;
        fetch(url)
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json()
        }).then(respuestaJson => {
            if(respuestaJson.succeed == false) {
                return;
            }
            respuestaJson.forEach(examenActual => {
                let fila = document.createElement('tr');
                fila.setAttribute('data-tipo-fila', 'anteriores')
                let colFecha = document.createElement('td');
                colFecha.classList.add('descripcion');
                colFecha.append(document.createTextNode(examenActual.examen.fecha));

                let colCreador = document.createElement('td');
                colCreador.classList.add('descripcion');
                colCreador.append(document.createTextNode(examenActual.examen.creador));
    

                let colNota = document.createElement('td');
                colNota.classList.add('descripcion');
                let totalPreguntas = examenActual.correccion.length;
                let preguntasAcertadas = examenActual.correccion.filter(c => c.correcta == true).length;
                colNota.appendChild(document.createTextNode((preguntasAcertadas/totalPreguntas)*100));

                let grafica = document.createElement('div');
                grafica.classList.add('grafica');
                let porcentajeCorrecto = document.createElement('div');
                porcentajeCorrecto.classList.add('correcto');
                grafica.appendChild(porcentajeCorrecto);
                porcentajeCorrecto.style.width = `${(preguntasAcertadas/totalPreguntas)*100}%`;
                
                colNota.appendChild(grafica);

                let colAcciones = document.createElement('td');
                if(userId == '') {
                    let accederBtn = document.createElement('button');
                    accederBtn.appendChild(document.createTextNode('Repetir'));
                    accederBtn.addEventListener('click', () => {
                        document.location = `http://autoescuelaprisas.com/autoescuela/interfaz/examen/ponteAPrueba.html?tipo=examen&examenId=${examenActual.examen.id}`
                    });
                    accederBtn.classList.add('acceder-btn');
                    colAcciones.appendChild(accederBtn);
                }
                fila.appendChild(colFecha);
                fila.appendChild(colCreador);
                fila.appendChild(colNota);
                fila.appendChild(colAcciones);
                examenesAnteriores.appendChild(fila);
            });

        })
    }

    function cargarUsuariosEnSelect() {
        fetch('http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php?all')
        .then((respuesta) => {
            if(respuesta.redirected) {
                document.location = respuesta.url;
            }
            return respuesta.json()
        }).then((users) => {
            let alumnos = users.filter(u => u.rol == 'alumno');
            let selectorAlumnos = document.getElementById('selectorAlumnos');

            alumnos.forEach(alumnoActual => {
                let option = document.createElement('option');
                option.innerHTML = alumnoActual.email;
                option.value = alumnoActual.id;
                selectorAlumnos.appendChild(option);
            })
        })
    }
});