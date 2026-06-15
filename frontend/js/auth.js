const token =
localStorage.getItem("token");

if(!token){

    window.location.href =
    "login.html";

}

const rol =
localStorage.getItem("rol");

const paginaActual =
window.location.pathname
.split("/")
.pop();

if(rol === "TIENDA"){

    const paginasProhibidas = [

        "productos.html",
        "usuarios.html"

    ];

    if(
        paginasProhibidas.includes(
            paginaActual
        )
    ){

        window.location.href =
        "stock.html";

    }

}

if(
    rol === "ADMIN" &&
    paginaActual === "ventas.html"
){

    window.location.href =
    "ventas-historial.html";

}