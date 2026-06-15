
let productos = [];

let productoEditando = null;

const authToken = localStorage.getItem("token");

async function cargarProductos(){

    const respuesta = await fetch(
        "https://sistema-dconsa-api.onrender.com/api/productos",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    productos =
    await respuesta.json();

    console.log(productos);
    
    renderizarTabla(productos);

}

function renderizarTabla(lista){

    let html = "";

    lista.forEach(producto => {

        html += `

        <tr>

            <td>${producto.id}</td>

            <td>${producto.nombre}</td>

            <td>${producto.categoria}</td>

            <td>S/ ${producto.precio}</td>

            <td>

                ${
                    producto.activo
                    ? "🟢 Activo"
                    : "🔴 Inactivo"
                }

            </td>

            <td>

                <button
                    class="btn"
                    onclick="editarProducto(
                        ${producto.id},
                        '${producto.nombre}',
                        ${producto.precio}
                    )"
                >
                    ✏️
                </button>

                ${
                    producto.activo
                    ?

                    `<button
                        class="btn"
                        onclick="desactivarProducto(
                            ${producto.id}
                        )"
                    >
                        🔴
                    </button>`

                    :

                    `<button
                        class="btn"
                        onclick="activarProducto(
                            ${producto.id}
                        )"
                    >
                        🟢
                    </button>`
                }

            </td>

        </tr>

        `;

    });

    document.getElementById(
        "tablaProductos"
    ).innerHTML = html;

}

async function guardarProducto(){

    const nombre =
    document.getElementById(
        "nombre"
    ).value;

    const categoria_id =
    document.getElementById(
        "categoria"
    ).value;

    const precio =
    document.getElementById(
        "precio"
    ).value;

    if(!nombre || !precio){

        alert(
            "Complete todos los campos"
        );

        return;
    }

    if(productoEditando){

        await fetch(

            `https://sistema-dconsa-api.onrender.com/api/productos/${productoEditando}`,

            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json",
                    Authorization:
                    `Bearer ${authToken}`
                },

                body:JSON.stringify({
                    categoria_id,
                    nombre,
                    precio
                })
            }

        );

        productoEditando = null;

    }else{

        const respuesta = await fetch(
                "https://sistema-dconsa-api.onrender.com/api/productos",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:
                        `Bearer ${authToken}`
                    },
                    body:JSON.stringify({
                        categoria_id,
                        nombre,
                        precio
                    })
                }
            );

            const datos = await respuesta.json();

            if(!respuesta.ok){

                alert(datos.error);

                return;

            }

    }

    limpiarFormulario();

    cargarProductos();

}

function editarProducto(
    id,
    nombre,
    precio
){

    productoEditando = id;

    document.getElementById(
        "nombre"
    ).value = nombre;

    document.getElementById(
        "precio"
    ).value = precio;

    document.getElementById(
        "nombre"
    ).readOnly = true;

    document.getElementById(
        "categoria"
    ).disabled = true;

    document.querySelector(
        ".page-title"
    ).innerText =
    "Actualizar Precio";

    document.getElementById(
        "btnGuardar"
    ).innerText =
    "Actualizar Precio";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

async function desactivarProducto(id){

    if(
        !confirm(
            "¿Desactivar producto?"
        )
    ){
        return;
    }

    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/productos/${id}`,
        {
            method:"DELETE",
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    cargarProductos();

}

function filtrarProductos(){

    const texto =
    document.getElementById(
        "buscar"
    ).value
    .toLowerCase();

    const filtrados =
    productos.filter(
        producto =>
        producto.nombre
        .toLowerCase()
        .includes(texto)
    );

    renderizarTabla(
        filtrados
    );

}


function limpiarFormulario(){

    document.getElementById(
        "nombre"
    ).value = "";

    document.getElementById(
        "precio"
    ).value = "";

    document.getElementById(
        "nombre"
    ).readOnly = false;

    document.getElementById(
        "categoria"
    ).disabled = false;

    document.querySelector(
        ".page-title"
    ).innerText =
    "Productos";

    document.getElementById(
        "btnGuardar"
    ).innerText =
    "Guardar";

    productoEditando = null;

}

async function activarProducto(id){

    const respuesta = await fetch(
        `https://sistema-dconsa-api.onrender.com/api/productos/activar/${id}`,
        {
            method:"PUT",
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const datos =
    await respuesta.json();

    if(!respuesta.ok){

        alert(datos.error);

        return;

    }

    cargarProductos();

}

cargarProductos();