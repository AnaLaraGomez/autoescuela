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