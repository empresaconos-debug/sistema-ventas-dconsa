async function cargarDashboard(){

    const token =
    localStorage.getItem(
        "token"
    );

    const respuesta =
    await fetch(
        "http://localhost:3000/api/dashboard/resumen",
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
    ).innerText =
    datos.producto_estrella
    ?
    `${datos.producto_estrella.nombre}`
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
        "http://localhost:3000/api/dashboard/ventas-dia",
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
        "http://localhost:3000/api/dashboard/ventas-mes",
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

window.onload = () => {

    cargarDashboard();

    cargarGraficoDia();

    cargarGraficoMes();

};