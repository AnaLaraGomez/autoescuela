window.addEventListener("load", function() {
    let examenesPendientesPorAlumnoContenedor = document.getElementById('examenesPendientesPorAlumnoContenedor');
    examenesPendientesPorAlumnoContenedor.style.display = 'none';
    fetch('http://autoescuelaprisas.com/autoescuela/servidor/api/apiUser.php')
    .then((respuesta) => {
        if(respuesta.redirected) {
            document.location = respuesta.url;
        }
        return respuesta.json()
    }).then((user) => {
        if(user.rol == 'admin'|| user.rol == 'profesor') {
            examenesPendientesPorAlumnoContenedor.style.display = 'unset';
            cargarUsuariosEnSelect();
            let verExamenesAlumnoBtn = document.getElementById('verExamenesAlumnoBtn');
            let examenesPendientesPorAlumno = document.getElementById('examenesPendientesPorAlumno');
            let selectorAlumnos = document.getElementById('selectorAlumnos');
            
            verExamenesAlumnoBtn.addEventListener('click', () => {
                let userId = selectorAlumnos.value;
                cargaExamenesPendientes(userId, examenesPendientesPorAlumno);
            });
        }
    
    })

    let examenesPendientes = document.getElementById('examenesPendientes');
    cargaExamenesPendientes('', examenesPendientes);


    function cargaExamenesPendientes(userId, examenesPendientes){
        let url = `http://autoescuelaprisas.com/autoescuela/servidor/api/apiExamen.php?tipo=pendientes&user=${userId}`;
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
                fila.setAttribute('data-tipo-fila', 'pendiente')
                let colFecha = document.createElement('td');
                colFecha.classList.add('descripcion');
                colFecha.append(document.createTextNode(examenActual.fecha));
                let colCreador = document.createElement('td');
                colCreador.classList.add('descripcion');
                colCreador.append(document.createTextNode(examenActual.creador));
    
                let colAcciones = document.createElement('td');
                if(userId == '') {
                    let accederBtn = document.createElement('button');
                    accederBtn.appendChild(document.createTextNode('Acceder'));
                    accederBtn.addEventListener('click', () => {
                        document.location = `http://autoescuelaprisas.com/autoescuela/interfaz/examen/ponteAPrueba.html?tipo=examen&examenId=${examenActual.id}`
                    });
                    accederBtn.classList.add('acceder-btn');
                    colAcciones.appendChild(accederBtn);
                }

                fila.appendChild(colFecha);
                fila.appendChild(colCreador);
                fila.appendChild(colAcciones);
                examenesPendientes.appendChild(fila);
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