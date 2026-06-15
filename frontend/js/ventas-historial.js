
console.log(
    "VENTAS HISTORIAL CARGADO"
);

const authToken =
localStorage.getItem("token");

async function obtenerFechaServidor(){

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/sistema/fecha"
    );

    const datos =
    await respuesta.json();

    return datos.fecha;

}


function crearCabecera(){

    let html = "";

    if(rol === "ADMIN"){

        html = `
        <tr>

            <th>ID</th>
            <th>Fecha</th>
            <th>Tienda</th>
            <th>Usuario</th>
            <th>Método</th>
            <th>Total</th>
            <th>Acción</th>

        </tr>
        `;

    }else{

        html = `
        <tr>

            <th>Fecha</th>
            <th>Método</th>
            <th>Total</th>
            <th>Acción</th>

        </tr>
        `;

    }

    document.getElementById(
        "cabeceraVentas"
    ).innerHTML = html;

}



    async function cargarVentas(){

    const fecha =
    document.getElementById(
        "filtroFecha"
    ).value;

    const tienda =
    document.getElementById(
        "filtroTienda"
    )?.value || "";

    const respuesta =
    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/ventas?fecha=${fecha}&tienda=${tienda}`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const ventas =
    await respuesta.json();

    let html = "";

    ventas.forEach(venta => {

    const fecha =
    new Date(
        venta.fecha
    ).toLocaleString(
        "es-PE",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

    if(rol === "ADMIN"){

        html += `

        <tr>

            <td>${venta.id}</td>

            <td>${fecha}</td>

            <td>
                ${venta.tienda || "-"}
            </td>

            <td>
                ${venta.usuario}
            </td>

            <td>
                ${venta.metodo_pago}
            </td>

            <td>
                S/ ${venta.total}
            </td>

            <td>

                <button
                    class="btn"
                    onclick="
                    verDetalle(
                        ${venta.id}
                    )"
                >
                    👁
                </button>

            </td>

        </tr>

        `;

    }else{

        html += `

        <tr>

            <td>${fecha}</td>

            <td>
                ${venta.metodo_pago}
            </td>

            <td>
                S/ ${venta.total}
            </td>

            <td>

                <button
                    class="btn"
                    onclick="
                    verDetalle(
                        ${venta.id}
                    )"
                >
                    👁
                </button>

                <button
                    class="btn"
                    onclick="
                    reimprimirBoleta(
                        ${venta.id}
                    )"
                >
                    🖨️
                </button>

            </td>

        </tr>

        `;

    }

});


    document.getElementById(
        "tablaVentas"
    ).innerHTML = html;

}

async function verDetalle(id){

    const respuesta =
    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/ventas/${id}`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const detalle =
    await respuesta.json();

    let html = "";

    detalle.forEach(item => {

        html += `

        <tr>

            <td>${item.nombre}</td>

            <td>${item.cantidad}</td>

            <td>${item.precio_unitario}</td>

            <td>${item.subtotal}</td>

        </tr>

        `;

    });

    document.getElementById(
        "detalleVenta"
    ).innerHTML = html;

    document.getElementById(
        "modalDetalle"
    ).style.display =
    "flex";

}

function cerrarDetalle(){

    document.getElementById(
        "modalDetalle"
    ).style.display =
    "none";

}
async function reimprimirBoleta(id){

    const respuesta =
    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/ventas/${id}/boleta`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
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

    console.log("REIMPRESION");
await imprimirBoletaVenta(
    datos
);
console.log("FIN REIMPRESION");

}

async function exportarExcel(){

    const fecha =
    document.getElementById(
        "filtroFecha"
    ).value;

    const tienda =
    document.getElementById(
        "filtroTienda"
    )?.value || "";

    const respuesta =
    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/ventas/excel?fecha=${fecha}&tienda=${tienda}`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    if(!respuesta.ok){

    const texto =
    await respuesta.text();

    console.log(texto);

    alert(
        "Error exportando Excel"
    );

    return;

}

    const blob =
    await respuesta.blob();

    const url =
    window.URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        "a"
    );

    a.href = url;

    a.download =
    "ventas.xlsx";

    document.body.appendChild(
        a
    );

    a.click();

    a.remove();

    window.URL.revokeObjectURL(
        url
    );

}

async function exportarventasExcel(){

    const fecha =
    document.getElementById(
        "filtroFecha"
    ).value;

    const tienda =
    document.getElementById(
        "filtroTienda"
    )?.value || "";

    const respuesta =
    await fetch(
        `https://sistema-dconsa-api.onrender.com/api/ventas/excel?fecha=${fecha}&tienda=${tienda}`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const blob =
    await respuesta.blob();

    const url =
    window.URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        "a"
    );

    a.href = url;

    a.download =
    "ventas.xlsx";

    a.click();

}


window.onload = async () => {

    crearCabecera();

    const fechaServidor =
    await obtenerFechaServidor();

    document.getElementById(
        "filtroFecha"
    ).value =
    fechaServidor;

    if(
        localStorage.getItem("rol")
        !== "ADMIN"
    ){

        document.getElementById(
            "filtroTiendaContainer"
        ).style.display =
        "none";

    }

    cargarVentas();

};