/*var titulos = document.querySelectorAll("h2");
titulos.forEach(function(titulo) {
    titulo.addEventListener("click", function() {
        var contenido = this.nextElementSibling;
        contenido.classList.toggle("activo");
    });
});*/

var secciones = document.querySelectorAll("section");

function cambiarFondo() {
    
    secciones.forEach(function(seccion) {

        var measurements = seccion.getBoundingClientRect();
        var mitad = window.innerWidth / 2;
   
    if (measurements.top <= mitad && measurements.bottom >= mitad) {
        document.body.style.backgroundColor = seccion.dataset.fondo;
        document.body.style.color = seccion.dataset.texto;
    }
    })
}

window.addEventListener('scroll',cambiarFondo);

var hooverWordies = document.querySelectorAll('.hooverWord');

hooverWordies.forEach(function(explainer) {
    

})