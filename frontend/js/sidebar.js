

const rolSidebar = localStorage.getItem("rol");

let paginaInicio =
"dashboard-admin.html";

if(
    rolSidebar ===
    "TIENDA"
){

    paginaInicio =
    "dashboard-tienda.html";

}

let menuProductos = "";

let menuUsuarios = "";

let menuVentas = "";

if(rolSidebar === "ADMIN"){

    menuProductos = `

    <li onclick="window.location.href='productos.html'">
        <i class="fa-solid fa-box"></i>
        Productos
    </li>

    `;

    menuUsuarios = `

    <li onclick="window.location.href='usuarios.html'">
        <i class="fa-solid fa-users"></i>
        Usuarios
    </li>

    `;

}else if(rolSidebar === "TIENDA"){

    menuVentas = `

    <li onclick="window.location.href='ventas.html'">
        <i class="fa-solid fa-cash-register"></i>
        Ventas
    </li>

    `;

}

document.getElementById(
    "sidebar-container"
).innerHTML = `

<div class="sidebar">

    <div class="logo">

        <h2>D'CONSA</h2>

        <div class="usuario-info">

            <div id="nombreRol">
                ...
            </div>

            <div id="nombreUsuario">
                ...
            </div>

        </div>

    </div>

    <ul>

        <li onclick="window.location.href='${paginaInicio}'">
            <i class="fa-solid fa-house"></i>
            Inicio
        </li>

        ${menuProductos}

        <li onclick="window.location.href='stock.html'">
            <i class="fa-solid fa-warehouse"></i>
            Stock
        </li>

        ${menuVentas}

        <li onclick="window.location.href='ventas-historial.html'">
            <i class="fa-solid fa-file-invoice-dollar"></i>
            Historial Ventas
        </li>


        <li onclick="window.location.href='cierre-caja.html'">
            <i class="fa-solid fa-receipt"></i>
            Cierre Caja
        </li>

        ${menuUsuarios}

        <li onclick="window.location.href='perfil.html'">
            <i class="fa-solid fa-user"></i>
            Perfil
        </li>

        <li onclick="cerrarSesion()">
            <i class="fa-solid fa-right-from-bracket"></i>
            Salir
        </li>

    </ul>

</div>

`;