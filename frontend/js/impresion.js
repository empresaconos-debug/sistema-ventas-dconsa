async function abrirCajon(){

    if(!qz.websocket.isActive()){

        await qz.websocket.connect();

    }

    const config =
    qz.configs.create(
        "POS-80-Series"
    );

    const data = [
        '\x1B\x70\x00\x19\xFA'
    ];

    await qz.print(
        config,
        data
    );

}

async function imprimirBoletaVenta(datos){

    const fecha =
    new Date()
    .toLocaleString(
        "es-PE"
    );

    let detalle = "";

    datos.productos.forEach(
        item => {

            detalle += `

            <tr>

                <td>
                    ${item.nombre}
                </td>

                <td
                    style="
                        text-align:center;
                    "
                >
                    ${item.cantidad}
                </td>

                <td
                    style="
                        text-align:right;
                    "
                >
                    ${item.precio_unitario}
                </td>

                <td
                    style="
                        text-align:right;
                    "
                >
                    ${item.subtotal}
                </td>

            </tr>

            `;

        }
    );

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

th{

    border-bottom:
    1px solid black;

}

td{

    padding:2px;

}

.center{

    text-align:center;

}

hr{

    border:none;

    border-top:
    1px dashed black;

}

</style>

</head>

<body>

<h3>

PASTELERIA D'CONSA

</h3>

<hr>

<div class="center">

BOLETA DE VENTA

</div>

<hr>

<b>

Cliente:

</b>

<br>

${datos.nombre_cliente}

<br><br>

<b>

DNI:

</b>

<br>

${datos.dni_cliente}

<br><br>

<b>

Fecha Emisión:

</b>

<br>

${fecha}

<br><br>

<b>

Forma de Pago:

</b>

<br>

${datos.metodo_pago}

<hr>

<table>

<thead>

<tr>

<th>
Descripción
</th>

<th>
Cant
</th>

<th>
P.U
</th>

<th>
Total
</th>

</tr>

</thead>

<tbody>

${detalle}

</tbody>

</table>

<hr>

<b>

TOTAL:
S/ ${datos.total}

</b>

<hr>

<div
    style="
        font-size:10px;
        text-align:center;
    "
>

Guarde su voucher,
es el sustento para validar su compra.

</div>

<hr>

<div
    class="center"
>

GRACIAS POR SU PREFERENCIA

<br>

QUE TENGA UN LINDO DÍA

</div>

</body>

</html>

    `);

    ventana.document.close();

    ventana.focus();

    ventana.print();

}