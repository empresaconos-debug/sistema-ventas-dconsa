let productos = [];
let stock = [];

console.log("stock.js cargado");

const authToken = localStorage.getItem("token");


async function registrarStock(){

    const producto_id =
    document.getElementById(
        "productoIngreso"
    ).value;

    let tienda_id;

        if(
            localStorage.getItem("rol")
            === "ADMIN"
        ){

            tienda_id =
            document.getElementById(
                "tiendaIngreso"
            ).value;

        }else{

            tienda_id =
            localStorage.getItem(
                "tienda_id"
            );

        }

    const cantidad =
    document.getElementById(
        "cantidadIngreso"
    ).value;

    const observacion =
    document.getElementById(
        "observacionIngreso"
    ).value;

    if(!cantidad){

        alert(
            "Ingrese cantidad"
        );

        return;

    }

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/stock/ingresar",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
            },

           body:JSON.stringify({

                tienda_id,
                producto_id,
                cantidad,
                observacion

            })
        }
    );

    const datos =
    await respuesta.json();

    if(!respuesta.ok){

        alert(
            datos.error
        );

        return;

    }

    alert(
        "Stock registrado"
    );

    cerrarModalStock();

    document.getElementById(
        "cantidadIngreso"
    ).value = "";

    document.getElementById(
        "observacionIngreso"
    ).value = "";

    cargarStock();

}



async function cargarProductos(){

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/productos",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    productos =
    await respuesta.json();

    let html = "";

    productos
    .filter(p => p.activo)
    .forEach(producto => {

        html += `
        <option value="${producto.id}">
            ${producto.nombre}
        </option>
        `;

    });

    document.getElementById(
        "productoIngreso"
    ).innerHTML = html;

}


function renderizarTabla(lista){

    let html = "";

    lista.forEach(item => {

        let estado = "";

        if(item.cantidad <= 0){

            estado =
            "🔴 Agotado";

        }else if(item.cantidad <= 5){

            estado =
            "🟡 Bajo";

        }else{

            estado =
            "🟢 Disponible";

        }

        html += `

        <tr>

            <td>${item.nombre}</td>

            <td>S/ ${item.precio}</td>

            <td>${item.cantidad}</td>

            <td>${estado}</td>

        </tr>

        `;

    });

    document.getElementById(
        "tablaStock"
    ).innerHTML = html;

}

async function cargarStock(){

    try{

        let tienda;

        if(
            localStorage.getItem("rol")
            === "ADMIN"
        ){

            tienda =
            document.getElementById(
                "tienda"
            ).value;

            const nombreTienda =
            document.getElementById(
                "tienda"
            ).options[
                document.getElementById(
                    "tienda"
                ).selectedIndex
            ].text;

            document.getElementById(
                "tituloStockTienda"
            ).innerText =
            `📦 Stock por Tienda: ${nombreTienda}`;

        }else{

            tienda =
            localStorage.getItem(
                "tienda_id"
            );

            document.getElementById(
                "tituloStockTienda"
            ).innerText =
            "📦 Mi Stock";

        }

        const respuesta =
        await fetch(
            `https://sistema-dconsa-api.onrender.com/api/stock/tienda/${tienda}`,
            {
                headers:{
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        stock =
        await respuesta.json();

        renderizarTabla(
            stock
        );

    }catch(error){

        console.error(
            error
        );

    }

}



function filtrarStock(){

    const texto =
    document.getElementById(
        "buscar"
    ).value
    .toLowerCase();

    const filtrados =
    stock.filter(item =>
        item.nombre
        .toLowerCase()
        .includes(texto)
    );

    renderizarTabla(filtrados);

}

function abrirModalStock(){

    const modal =
    document.getElementById(
        "modalStock"
    );

    modal.style.display =
    "flex";

    if(
        localStorage.getItem("rol")
        === "TIENDA"
    ){

        document.getElementById(
            "grupoTiendaStock"
        ).style.display =
        "none";

    }else{

        document.getElementById(
            "grupoTiendaStock"
        ).style.display =
        "block";

    }

}

function cerrarModalStock(){

    const modal =
    document.getElementById(
        "modalStock"
    );

    modal.style.display =
    "none";

}

function abrirModalPorcionar(){

    document.getElementById(
        "modalPorcionar"
    ).style.display =
    "flex";

    cargarTortasPorcionar();

}

function cerrarModalPorcionar(){

    document.getElementById(
        "modalPorcionar"
    ).style.display =
    "none";

}

function cargarTortasPorcionar(){

    let html = "";

    stock
    .filter(
        item =>

            item.categoria_id === 1

            &&

            item.cantidad > 0

            &&

            !item.nombre
            .toLowerCase()
            .includes(
                "porcion"
            )
    )
    .forEach(
        item => {

            html += `
            <option value="${item.id}">
                ${item.nombre}
                (${item.cantidad})
            </option>
            `;

        }
    );

    document.getElementById(
        "productoPorcionar"
    ).innerHTML =
    html;

}

async function guardarPorcionamiento(){

    const producto_id =
    document.getElementById(
        "productoPorcionar"
    ).value;

    const cantidad_tortas =
    document.getElementById(
        "cantidadTortas"
    ).value;

    const cantidad_porciones =
    document.getElementById(
        "totalPorciones"
    ).value;

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/stock/porcionar",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
            },

            body:JSON.stringify({

                producto_id,
                cantidad_tortas,
                cantidad_porciones

            })
        }
    );

    const datos =
    await respuesta.json();

    if(
        !respuesta.ok
    ){

        alert(
            datos.error
        );

        return;

    }

    alert(
        datos.mensaje
    );

    cerrarModalPorcionar();

    cargarStock();

}


async function calcularPorciones(){

    const tortas =
    Number(
        document.getElementById(
            "cantidadTortas"
        ).value
    );

    const porciones =
    Number(
        document.getElementById(
            "porcionesPorTorta"
        ).value
    );

    document.getElementById(
        "totalPorciones"
    ).value =
    tortas * porciones;

}

function abrirModalDescarte(){

    document.getElementById(
        "modalDescarte"
    ).style.display =
    "flex";

    cargarProductosDescarte();

}

function cerrarModalDescarte(){

    document.getElementById(
        "modalDescarte"
    ).style.display =
    "none";

}

function cargarProductosDescarte(){

    let html = "";

    stock
    .filter(
        item =>
        Number(
            item.cantidad
        ) > 0
    )
    .forEach(
        item => {

            html += `
            <option value="${item.id}">
                ${item.nombre}
                (${item.cantidad})
            </option>
            `;

        }
    );

    document.getElementById(
        "productoDescarte"
    ).innerHTML =
    html;

}

async function guardarDescarte(){

    const producto_id =
    document.getElementById(
        "productoDescarte"
    ).value;

    const cantidad =
    document.getElementById(
        "cantidadDescarte"
    ).value;

    const motivo =
    document.getElementById(
        "motivoDescarte"
    ).value;

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/stock/descartar",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`
            },

            body:JSON.stringify({

                producto_id,
                cantidad,
                motivo

            })
        }
    );

    const datos =
    await respuesta.json();

    if(
        !respuesta.ok
    ){

        alert(
            datos.error
        );

        return;

    }

    alert(
        datos.mensaje
    );

    cerrarModalDescarte();

    cargarStock();

}

window.cargarStock = cargarStock;

window.onload = () => {


    const rol =
localStorage.getItem(
    "rol"
);

if(rol === "TIENDA"){

    document.getElementById(
        "gestionStockHeader"
    ).style.display =
    "none";

    document.getElementById(
        "gestionStockCard"
    ).style.display =
    "none";


}



    cargarProductos();
    cargarStock();

};