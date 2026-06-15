async function cargarDashboard(){

    const token =
    localStorage.getItem(
        "token"
    );

    const fechaInicio =
    document.getElementById(
        "fechaInicio"
    )?.value;

    const fechaFin =
    document.getElementById(
        "fechaFin"
    )?.value;

    let url =
    "https://sistema-dconsa-api.onrender.com/api/dashboard/resumen";

    if(
        fechaInicio &&
        fechaFin
    ){

        url +=
        `?inicio=${fechaInicio}&fin=${fechaFin}`;

    }

    const respuesta =
    await fetch(
        url,
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const datos =
    await respuesta.json();

    document.getElementById(
        "totalVentas"
    ).innerText =
    datos.ventas;

    document.getElementById(
        "totalVendido"
    ).innerText =
    `S/ ${datos.vendido}`;

    document.getElementById(
        "productoEstrella"
    ).innerHTML =
    datos.producto_estrella
    ?
    `
    ${datos.producto_estrella.nombre}
    <br>
    <small>
        ${datos.producto_estrella.cantidad}
        vendidas
    </small>
    `
    :
    "-";

}

async function cargarGraficoDia(){

    const token =
    localStorage.getItem(
        "token"
    );

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/dashboard/ventas-dia",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const datos =
    await respuesta.json();

    new Chart(

        document.getElementById(
            "graficoVentasDia"
        ),

        {

            type:"bar",

            data:{

                labels:
                datos.map(
                    d => d.hora
                ),

                datasets:[{

                    label:
                    "Ventas",

                    data:
                    datos.map(
                        d => d.ventas
                    ),

                    maxBarThickness:25

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

async function cargarGraficoMes(){

    const token =
    localStorage.getItem(
        "token"
    );

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/dashboard/ventas-mes",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const datos =
    await respuesta.json();

    new Chart(

        document.getElementById(
            "graficoVentasMes"
        ),

        {

            type:"bar",

            data:{

                labels:
                datos.map(
                    d => d.dia
                ),

                datasets:[{

                    label:
                    "Ventas",

                    data:
                    datos.map(
                        d => d.ventas
                    ),

                    maxBarThickness:25

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

async function cargarGraficoTiendas(){

    const token =
    localStorage.getItem(
        "token"
    );

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/dashboard/comparativo-tiendas",
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
    );

    const datos =
    await respuesta.json();

    new Chart(

        document.getElementById(
            "graficoTiendas"
        ),

        {

            type:"bar",

            data:{

                labels:
                datos.map(
                    d => d.nombre
                ),

                datasets:[{

                    label:
                    "Ventas",

                    data:
                    datos.map(
                        d => d.total
                    ),

                    maxBarThickness:40

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

window.onload = () => {

    cargarDashboard();

    cargarGraficoDia();

    cargarGraficoMes();

    cargarGraficoTiendas();

};