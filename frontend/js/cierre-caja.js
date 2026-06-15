const authToken = localStorage.getItem("token");

async function cargarResumenCaja(){

    const respuesta =
    await fetch(
        "http://localhost:3000/api/cierre-caja/resumen",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const datos =
    await respuesta.json();

    document.getElementById(
        "ventasDia"
    ).innerText =
    datos.ventas || 0;

    document.getElementById(
        "totalEfectivo"
    ).innerText =
    `S/ ${datos.total_efectivo}`;

    document.getElementById(
        "totalYape"
    ).innerText =
    `S/ ${datos.total_yape}`;

    document.getElementById(
        "totalTarjeta"
    ).innerText =
    `S/ ${datos.total_tarjeta}`;

    document.getElementById(
        "totalGeneral"
    ).innerText =
    `S/ ${datos.total_general}`;

}

async function cargarDetalleCaja(){

    const respuesta =
    await fetch(
        "http://localhost:3000/api/cierre-caja/detalle",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const datos =
    await respuesta.json();

    const detalle =
    datos.ventas;

    window.porcionamientosHoy =
    datos.porcionamientos || [];

    window.descartesHoy =
    datos.descartes || [];

    let html = "";

    detalle.forEach(item => {

        html += `

        <tr>

            <td>
                ${item.producto}
            </td>

            <td>
                ${item.cantidad}
            </td>

            <td>
                ${item.metodo_pago}
            </td>

            <td>
                S/ ${item.total}
            </td>

        </tr>

        `;

    });

    document.getElementById(
        "detalleCaja"
    ).innerHTML = html;

}

async function cerrarCaja(){

    if(
        !confirm(
            "¿Cerrar caja?"
        )
    ){
        return;
    }

    const respuesta =
    await fetch(
        "http://localhost:3000/api/cierre-caja/cerrar",
        {
            method:"POST",

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

    imprimirCaja();

setTimeout(
    async ()=>{

        try{

            await abrirCajon();

        }catch(error){

            console.error(
                error
            );

        }

        alert(
            datos.mensaje
        );

        location.reload();

    },
    2000
);

}

async function imprimirCaja(){

    const fecha =
    document.getElementById(
        "fechaCaja"
    ).innerText;

    const ventas =
    document.getElementById(
        "ventasDia"
    ).innerText;

    const efectivo =
    document.getElementById(
        "totalEfectivo"
    ).innerText;

    const yape =
    document.getElementById(
        "totalYape"
    ).innerText;

    const tarjeta =
    document.getElementById(
        "totalTarjeta"
    ).innerText;

    const total =
    document.getElementById(
        "totalGeneral"
    ).innerText;

    const detalle =
    document.getElementById(
        "detalleCaja"
    ).innerHTML;

    const porcionamientos =
    window.porcionamientosHoy || [];

    const descartes =
    window.descartesHoy || [];

    const ventana =
    window.open(
        "",
        "",
        "width=320,height=800"
    );

    ventana.document.write(`

<html>

<head>

<style>

@page{

    size:80mm auto;

    margin:0;

}

body{

    width:80mm;

    margin:0;

    padding:5px;

    font-family:monospace;

    font-size:11px;

}

h3{

    margin:0;

    text-align:center;

}

table{

    width:100%;

    border-collapse:collapse;

    font-size:10px;

}

td{

    padding:2px;

}

.center{

    text-align:center;

}

hr{

    border:none;

    border-top:1px dashed black;

}

</style>

</head>

<body>

        <h3>
            D'CONSA
        </h3>

        <div class="center">

            CIERRE DE CAJA

        </div>

        <hr>

        Fecha:
        ${fecha}

        <br>

        Ventas:
        ${ventas}

        <hr>

        <table>

            <thead>

                <tr>

                    <td>
                        Prod.
                    </td>

                    <td>
                        Cant.
                    </td>

                    <td>
                        Pago
                    </td>

                    <td>
                        Total
                    </td>

                </tr>

            </thead>    
    
            <tbody> 
    
                ${detalle}

            </tbody>

        </table>

        <hr>


        ${
    porcionamientos.length > 0
    ?
    `
    <hr>

    <b>
        PORCIONAMIENTOS
    </b>

    <br><br>

    ${
        porcionamientos
        .map(
            p => `
                ${p.nombre}
                <br>

                ${p.cantidad_tortas}
                torta(s)
                →
                ${p.cantidad_porciones}
                porciones

                <br><br>
            `
        )
        .join("")
    }
    `
    :
    ""
}

    ${
    descartes.length > 0
    ?
    `
    <hr>

    <b>
        DESCARTES
    </b>

    <br><br>

    ${
        descartes
        .map(
            d => `
                ${d.nombre}
                <br>

                Cantidad:
                ${d.cantidad}

                <br>

                Motivo:
                ${d.motivo}

                <br><br>
            `
        )
        .join("")
    }
    `
    :
    ""
}

        EFECTIVO:
        ${efectivo}

        <br>

        YAPE:
        ${yape}

        <br>

        TARJETA:
        ${tarjeta}

        <hr>

        <b>

            TOTAL:
            ${total}

        </b>

        <hr>


    </body>

    </html>

    `);

    ventana.document.close();

    ventana.focus();

    ventana.print();

}


async function cargarCierres(){

    const fecha =
    document.getElementById(
        "filtroFecha"
    ).value;

    const tienda =
    document.getElementById(
        "filtroTienda"
    ).value;

    let url =
    "http://localhost:3000/api/cierre-caja";

    const params =
    new URLSearchParams();

    if(fecha){

        params.append(
            "fecha",
            fecha
        );

    }

    if(tienda){

        params.append(
            "tienda",
            tienda
        );

    }

    if(
        params.toString()
    ){

        url +=
        "?" +
        params.toString();

    }

    const respuesta =
    await fetch(
        url,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const datos =
    await respuesta.json();

    const tbody =
    document.getElementById(
        "tablaCierres"
    );

    tbody.innerHTML =
    "";

    datos.forEach(
        cierre => {

            const fechaCierre =
            new Date(
                cierre.fecha
            );

            const fechaFormateada =
            fechaCierre.toLocaleDateString(
                "es-PE",
                {
                    day:"2-digit",
                    month:"2-digit",
                    year:"numeric"
                }
            );

            tbody.innerHTML +=
            `
            <tr>

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${cierre.tienda}
                </td>

                <td>
                    ${cierre.cantidad_ventas}
                </td>

                <td>
                    S/
                    ${cierre.total_general}
                </td>

                <td>

                    <button
                        class="btn"
                        onclick="
                            verDetalleCierre(
                                ${cierre.id}
                            )
                        "
                    >
                        👁
                    </button>

                </td>

            </tr>
            `;

        }
    );

}

async function verDetalleCierre(id){

    const respuesta =
    await fetch(
        `http://localhost:3000/api/cierre-caja/${id}`,
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const cierre =
    await respuesta.json();

    const fecha =
    new Date(
        cierre.fecha_cierre
    );

    const fechaFormateada =
    fecha.toLocaleString(
        "es-PE",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

    document.getElementById(
        "modalDetalleCierre"
    ).style.display =
    "flex";

    document.getElementById(
        "infoDetalleCierre"
    ).innerHTML =
    `
        <p>
            <b>Tienda:</b>
            ${cierre.tienda}
        </p>

        <p>
            <b>Usuario:</b>
            ${cierre.usuario}
        </p>

        <p>
            <b>Fecha:</b>
            ${fechaFormateada}
        </p>

        <p>
            <b>Total:</b>
            S/
            ${cierre.total_general}
        </p>
    `;

    const tbody =
    document.getElementById(
        "detalleCierreBody"
    );

    tbody.innerHTML =
    "";

    (cierre.detalle.ventas || [])
    .forEach(
        item => {

            tbody.innerHTML +=
            `
            <tr>

                <td>
                    ${item.producto}
                </td>

                <td>
                    ${item.cantidad}
                </td>

                <td>
                    ${item.metodo_pago}
                </td>

                <td>
                    ${item.total}
                </td>

            </tr>
            `;

        }
    );

    const divPorcionamientos =
    document.getElementById(
        "porcionamientosCierre"
    );

    divPorcionamientos.innerHTML =
    "";

    (cierre.detalle.porcionamientos || [])
    .forEach(
        item => {

            divPorcionamientos.innerHTML +=
            `
            <p>

                <b>
                    ${item.nombre}
                </b>

                <br>

                ${item.cantidad_tortas}
                torta(s)

                →

                ${item.cantidad_porciones}
                porciones

            </p>
            `;

        }
    );

    const divDescartes =
    document.getElementById(
        "descartesCierre"
    );

    divDescartes.innerHTML =
    "";

    (cierre.detalle.descartes || [])
    .forEach(
        item => {

            divDescartes.innerHTML +=
            `
            <p>

                <b>
                    ${item.nombre}
                </b>

                <br>

                Cantidad:
                ${item.cantidad}

                <br>

                Motivo:
                ${item.motivo || "-"}

            </p>
            `;

        }
    );

}

function cerrarDetalleCierre(){

    document.getElementById(
        "modalDetalleCierre"
    ).style.display =
    "none";

}

async function verificarEstadoCaja(){

    const respuesta =
    await fetch(
        "http://localhost:3000/api/cierre-caja/estado",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const datos =
    await respuesta.json();


    if(datos.cerrada){

        document.getElementById(
            "estadoCaja"
        ).style.display =
        "block";

        document.getElementById(
            "estadoCaja"
        ).innerHTML =
        `
        🔒 CAJA CERRADA
        <br>
        <small>
        La caja de hoy ya fue cerrada
        </small>
        `;

        document.getElementById(
            "accionesCaja"
        ).style.display =
        "none";

    }

}


window.onload =
async () => {

    const rol =
    localStorage.getItem(
        "rol"
    );

    if(
        rol === "ADMIN"
    ){

        document.getElementById(
            "adminFiltros"
        ).style.display =
        "block";

        document.getElementById(
            "adminTabla"
        ).style.display =
        "block";

        document.getElementById(
            "cardResumenCaja"
        ).style.display =
        "none";

        document.getElementById(
            "cardDetalleCaja"
        ).style.display =
        "none";

        document.getElementById(
            "cardTotalesCaja"
        ).style.display =
        "none";

        document.getElementById(
            "accionesCaja"
        ).style.display =
        "none";

        const hoy =
        new Date()
        .toLocaleDateString(
            "sv-SE",
            {
                timeZone:
                "America/Lima"
            }
        );
        document.getElementById(
            "filtroFecha"
        ).value =
        hoy;

        await cargarCierres();

        return;

    }

    const fecha =
    new Date()
    .toLocaleDateString(
        "es-PE"
    );

    document.getElementById(
        "fechaCaja"
    ).innerText =
    fecha;

    await verificarEstadoCaja();

    await cargarResumenCaja();

    await cargarDetalleCaja();

};