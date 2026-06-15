
console.log("ventas.js cargado");

const authToken = localStorage.getItem("token");

let productos = [];

let carrito = [];

let total = 0;



async function cargarProductos(){

    const respuesta =
    await fetch(
        "http://localhost:3000/api/stock/mi-tienda",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    productos =
    await respuesta.json();

    console.log(
        "PRODUCTOS:",
        productos
    );

    let html = "";

    productos.forEach(producto => {

        html += `
        <option value="${producto.id}">
            ${producto.nombre}
            (${producto.cantidad})
        </option>
        `;

    });

    document.getElementById(
        "productoVenta"
    ).innerHTML = html;

}


function agregarProductoVenta(){

    const producto_id =
    document.getElementById(
        "productoVenta"
    ).value;

    const cantidad =
    Number(
        document.getElementById(
            "cantidadVenta"
        ).value
    );

    if(cantidad <= 0){

        alert(
            "Cantidad inválida"
        );

        return;

    }

    const producto =
    productos.find(
        p => p.id == producto_id
    );

    if(!producto){

        alert(
            "Producto no encontrado"
        );

        return;

    }

    if(
        cantidad >
        producto.cantidad
    ){

        alert(
            `Stock disponible: ${producto.cantidad}`
        );

        return;

    }

    const existe =
    carrito.find(
        item =>
        item.producto_id ==
        producto_id
    );

    if(existe){

        alert(
            "Producto ya agregado"
        );

        return;

    }

    carrito.push({

        producto_id:
        producto.id,

        nombre:
        producto.nombre,

        precio:
        Number(producto.precio),

        cantidad

    });

    renderizarCarrito();

}

function renderizarCarrito(){

    let html = "";

    total = 0;

    carrito.forEach(
        (item,index) => {

            const subtotal =
            item.precio *
            item.cantidad;

            total += subtotal;

            html += `

            <tr>

                <td>
                    ${item.nombre}
                </td>

                <td>
                    ${item.cantidad}
                </td>

                <td>
                    S/ ${item.precio}
                </td>

                <td>
                    S/ ${subtotal}
                </td>

                <td>

                    <button
                        class="btn"
                        onclick="
                        eliminarProductoVenta(
                            ${index}
                        )"
                    >
                        ❌
                    </button>

                </td>

            </tr>

            `;

        }
    );

    document.getElementById(
        "detalleVenta"
    ).innerHTML = html;

    document.getElementById(
        "totalVenta"
    ).innerText =
    `Total: S/ ${total}`;

}

function eliminarProductoVenta(index){

    carrito.splice(
        index,
        1
    );

    renderizarCarrito();

}

async function registrarVenta(){

    if(carrito.length === 0){

        alert(
            "Agregue productos al carrito"
        );

        return;

    }

    const metodo_pago =
    document.getElementById(
        "metodoPago"
    ).value;

    if(
        document.getElementById(
            "dniCliente"
        ).value === ""
    ){

        document.getElementById(
            "dniCliente"
        ).value =
        "00000000";

        document.getElementById(
            "nombreCliente"
        ).value =
        "PUBLICO GENERAL";

    }

    const dni_cliente =
    document.getElementById(
        "dniCliente"
    ).value;

    const nombre_cliente =
    document.getElementById(
        "nombreCliente"
    ).value;

    try{

        const respuesta =
        await fetch(
            "http://localhost:3000/api/ventas",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${authToken}`
                },

                body:JSON.stringify({

                    metodo_pago,

                    dni_cliente,

                    nombre_cliente,

                    productos:
                    carrito.map(item => ({

                        producto_id:
                        item.producto_id,

                        cantidad:
                        item.cantidad

                    }))

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

        await imprimirBoletaVenta(
            datos
        );

        await abrirCajon();

        alert(
            "Venta registrada correctamente"
        );

        carrito = [];

        renderizarCarrito();

        await cargarProductos();

    }catch(error){

        console.error(error);

        alert(
            "Error al registrar venta"
        );

    }

}



async function buscarDni(){

    const dni =
    document.getElementById(
        "dniCliente"
    ).value;

    if(
        dni.length !== 8
    ){

        alert(
            "Ingrese un DNI válido"
        );

        return;

    }

    const respuesta =
    await fetch(
        `http://localhost:3000/api/reniec/dni/${dni}`
    );

    const datos =
    await respuesta.json();

    if(!respuesta.ok){

        alert(
            datos.error
        );

        return;

    }

    document.getElementById(
        "nombreCliente"
    ).value =
    datos.nombre;

}


window.onload = () => {

    const rol =
    localStorage.getItem(
        "rol"
    );

    if(
        rol === "TIENDA"
    ){

        const titulo =
        document.getElementById(
            "tituloVentas"
        );

        const subtitulo =
        document.getElementById(
            "subtituloVentas"
        );

        if(titulo){

            titulo.innerText =
            "🛒 Punto de Venta";

        }

        if(subtitulo){

            subtitulo.innerText =
            "Registro de ventas";

        }

    }

    cargarProductos();

};