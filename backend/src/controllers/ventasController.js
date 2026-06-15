const pool = require("../config/db");
const ExcelJS = require("exceljs");



const registrarVenta = async (req,res) => {

    try{

        const {
            metodo_pago,
            dni_cliente,
            nombre_cliente,
            productos
        } = req.body;

        const tienda_id =
        req.usuario.tienda_id;

        const usuario_id =
        req.usuario.id;

        let total = 0;

        for(const item of productos){

        const stockActual = await pool.query(
                `
                SELECT cantidad
                FROM stock
                WHERE tienda_id = $1
                AND producto_id = $2
                `,
                [
                    tienda_id,
                    item.producto_id
                ]
            );

            if(
                stockActual.rows.length === 0
            ){

                return res.status(400)
                .json({
                    error:
                    "Producto sin stock"
                });

            }

            if(
                stockActual.rows[0].cantidad <
                item.cantidad
            ){

                return res.status(400)
                .json({
                    error:
                    "Stock insuficiente"
                });

            }

        }

                const venta =
        await pool.query(
            `
            INSERT INTO ventas
            (
                tienda_id,
                usuario_id,
                metodo_pago,
                dni_cliente,
                nombre_cliente,
                subtotal,
                total,
                fecha
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                timezone(
                    'America/Lima',
                    now()
                )
            )
            RETURNING *
            `,
            [
                tienda_id,
                usuario_id,
                metodo_pago,
                dni_cliente,
                nombre_cliente,
                0,
                0
            ]
        );

        const venta_id =
        venta.rows[0].id;

                for(const item of productos){

            const producto =
            await pool.query(
                `
                SELECT precio
                FROM productos
                WHERE id = $1
                `,
                [
                    item.producto_id
                ]
            );

            const precio =
            producto.rows[0].precio;

            const subtotal =
            precio *
            item.cantidad;

            total += subtotal;

            await pool.query(
                `
                INSERT INTO detalle_ventas
                (
                    venta_id,
                    producto_id,
                    cantidad,
                    precio_unitario,
                    subtotal
                )
                VALUES
                ($1,$2,$3,$4,$5)
                `,
                [
                    venta_id,
                    item.producto_id,
                    item.cantidad,
                    precio,
                    subtotal
                ]
            );

            await pool.query(
                `
                UPDATE stock
                SET cantidad =
                cantidad - $1
                WHERE tienda_id = $2
                AND producto_id = $3
                `,
                [
                    item.cantidad,
                    tienda_id,
                    item.producto_id
                ]
            );

        }

                await pool.query(
            `
            UPDATE ventas
            SET
                subtotal = $1,
                total = $1
            WHERE id = $2
            `,
            [
                total,
                venta_id
            ]
        );

        const detalleVenta =
        await pool.query(
            `
            SELECT

                p.nombre,

                dv.cantidad,

                dv.precio_unitario,

                dv.subtotal

            FROM detalle_ventas dv

            INNER JOIN productos p
                ON p.id = dv.producto_id

            WHERE dv.venta_id = $1
            `,
            [
                venta_id
            ]
        );

       res.json({

            mensaje:
            "Venta registrada",

            venta_id,

            metodo_pago,

            total,

            dni_cliente,

            nombre_cliente,

            productos:
            detalleVenta.rows

        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const listarVentas = async (req,res) => {

    try{

        const {
            fecha,
            tienda
        } = req.query;

        let result;

        if(
            req.usuario.rol ===
            "ADMIN"
        ){

            let sql = `
                SELECT
                    v.id,
                    t.nombre AS tienda,
                    u.nombre AS usuario,
                    v.metodo_pago,
                    v.total,
                    v.fecha
                FROM ventas v
                INNER JOIN tiendas t
                    ON t.id = v.tienda_id
                INNER JOIN usuarios u
                    ON u.id = v.usuario_id
                WHERE 1=1
            `;

            const params = [];

            if(fecha){

                params.push(fecha);

                sql += `
                    AND DATE(v.fecha) = $${params.length}
                `;

            }

            if(tienda){

                params.push(tienda);

                sql += `
                    AND v.tienda_id = $${params.length}
                `;

            }

            sql += `
                ORDER BY v.id DESC
            `;

            result =
            await pool.query(
                sql,
                params
            );

        }else{

            let sql = `
                SELECT
                    v.id,
                    u.nombre AS usuario,
                    v.metodo_pago,
                    v.total,
                    v.fecha
                FROM ventas v
                INNER JOIN usuarios u
                    ON u.id = v.usuario_id
                WHERE v.tienda_id = $1
            `;

            const params = [
                req.usuario.tienda_id
            ];

            if(fecha){

                params.push(fecha);

                sql += `
                    AND DATE(v.fecha) = $2
                `;

            }

            sql += `
                ORDER BY v.id DESC
            `;

            result =
            await pool.query(
                sql,
                params
            );

        }

        res.json(
            result.rows
        );

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const obtenerDetalleVenta = async (req,res) => {

    try{

        const { id } =
        req.params;

        const result =
        await pool.query(
            `
            SELECT
                p.nombre,
                d.cantidad,
                d.precio_unitario,
                d.subtotal
            FROM detalle_ventas d
            INNER JOIN productos p
                ON p.id = d.producto_id
            WHERE d.venta_id = $1
            `,
            [id]
        );

        res.json(
            result.rows
        );

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const obtenerBoletaVenta = async (req,res) => {

    try{

        const { id } =
        req.params;

        const venta =
        await pool.query(
            `
            SELECT

                id,

                fecha,

                metodo_pago,

                total,

                dni_cliente,

                nombre_cliente

            FROM ventas

            WHERE id = $1
            `,
            [id]
        );

        if(
            venta.rows.length === 0
        ){

            return res.status(404)
            .json({

                error:
                "Venta no encontrada"

            });

        }

        const detalle =
        await pool.query(
            `
            SELECT

                p.nombre,

                d.cantidad,

                d.precio_unitario,

                d.subtotal

            FROM detalle_ventas d

            INNER JOIN productos p
                ON p.id =
                d.producto_id

            WHERE d.venta_id = $1
            `,
            [id]
        );

        res.json({

            venta_id:
            venta.rows[0].id,

            fecha:
            venta.rows[0].fecha,

            metodo_pago:
            venta.rows[0].metodo_pago,

            total:
            venta.rows[0].total,

            dni_cliente:
            venta.rows[0].dni_cliente,

            nombre_cliente:
            venta.rows[0].nombre_cliente,

            productos:
            detalle.rows

        });

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

const exportarventasExcel = async (req,res) => {

    try{

        const {
            fecha,
            tienda
        } = req.query;

        let condiciones = [];
        let params = [];

        if(fecha){

            params.push(
                fecha
            );

            condiciones.push(
                `DATE(v.fecha) = $${params.length}`
            );

        }

        if(tienda){

            params.push(
                tienda
            );

            condiciones.push(
                `v.tienda_id = $${params.length}`
            );

        }

        const where =
        condiciones.length > 0
        ?
        `WHERE ${condiciones.join(" AND ")}`
        :
        "";

        const ventas =
        await pool.query(
            `
            SELECT

                v.id,

                v.fecha,

                v.nombre_cliente,

                v.metodo_pago,

                v.total,

                t.nombre AS tienda

            FROM ventas v

            LEFT JOIN tiendas t
                ON t.id = v.tienda_id

            ${where}

            ORDER BY v.fecha DESC
            `,
            params
        );

        const workbook =
        new ExcelJS.Workbook();

        workbook.creator =
        "Sistema D'Consa";

        const sheet =
        workbook.addWorksheet(
            "Ventas"
        );

        sheet.mergeCells(
            "A1:F1"
        );

        sheet.getCell(
            "A1"
        ).value =
        "REPORTE DE VENTAS - PASTELERIA D'CONSA";

        sheet.getCell(
            "A1"
        ).font = {

            bold:true,
            size:16,
            color:{
                argb:"FFFFFF"
            }

        };

        sheet.getCell(
            "A1"
        ).fill = {

            type:"pattern",

            pattern:"solid",

            fgColor:{
                argb:"1F4E78"
            }

        };

        sheet.getCell(
            "A1"
        ).alignment = {

            horizontal:"center"

        };

        sheet.mergeCells(
            "A2:F2"
        );

        sheet.getCell(
            "A2"
        ).value =
        tienda
        ?
        `TIENDA: CONO ${tienda}`
        :
        "TIENDA: TODAS LAS TIENDAS";

        sheet.getCell(
            "A2"
        ).font = {

            bold:true,
            size:12

        };

        sheet.getCell(
            "A2"
        ).alignment = {

            horizontal:"center"

        };

        sheet.columns = [

            {
                header:"ID",
                key:"id",
                width:10
            },

            {
                header:"Fecha",
                key:"fecha",
                width:25
            },

            {
                header:"Cliente",
                key:"nombre_cliente",
                width:35
            },

            {
                header:"Pago",
                key:"metodo_pago",
                width:15
            },

            {
                header:"Total",
                key:"total",
                width:15
            },

            {
                header:"Tienda",
                key:"tienda",
                width:20
            }

        ];

        const encabezado =
        sheet.getRow(3);

        encabezado.values = [

            "ID",

            "Fecha",

            "Cliente",

            "Pago",

            "Total",

            "Tienda"

        ];

        encabezado.eachCell(
            cell => {

                cell.font = {

                    bold:true,

                    color:{
                        argb:"FFFFFF"
                    }

                };

                cell.fill = {

                    type:"pattern",

                    pattern:"solid",

                    fgColor:{
                        argb:"4472C4"
                    }

                };

                cell.alignment = {

                    horizontal:"center"

                };

            }
        );

        ventas.rows.forEach(
            venta => {

                sheet.addRow({

                    id:
                    venta.id,

                    fecha:
                    new Date(
                        venta.fecha
                    ).toLocaleString(
                        "es-PE"
                    ),

                    nombre_cliente:
                    venta.nombre_cliente,

                    metodo_pago:
                    venta.metodo_pago,

                    total:
                    venta.total,

                    tienda:
                    venta.tienda

                });

            }
        );

        sheet.eachRow(
            row => {

                row.eachCell(
                    cell => {

                        cell.border = {

                            top:{
                                style:"thin"
                            },

                            left:{
                                style:"thin"
                            },

                            bottom:{
                                style:"thin"
                            },

                            right:{
                                style:"thin"
                            }

                        };

                    }
                );

            }
        );

        const totalGeneral =
        ventas.rows.reduce(

            (sum,venta) =>

            sum +
            Number(
                venta.total
            ),

            0

        );

        sheet.addRow([]);

        const filaTotal =
        sheet.addRow([

            "",

            "",

            "",

            "TOTAL GENERAL",

            totalGeneral

        ]);

        filaTotal.font = {

            bold:true

        };

        filaTotal.getCell(
            4
        ).fill = {

            type:"pattern",

            pattern:"solid",

            fgColor:{
                argb:"D9EAD3"
            }

        };

        filaTotal.getCell(
            5
        ).fill = {

            type:"pattern",

            pattern:"solid",

            fgColor:{
                argb:"D9EAD3"
            }

        };

        if(!tienda){

            sheet.addRow([]);

            const tituloResumen =
            sheet.addRow([
                "RESUMEN POR TIENDA"
            ]);

            tituloResumen.font = {

                bold:true

            };

            const resumen =
            {};

            ventas.rows.forEach(
                venta => {

                    const nombre =
                    venta.tienda ||
                    "SIN TIENDA";

                    resumen[nombre] =
                    (
                        resumen[nombre] || 0
                    )
                    +
                    Number(
                        venta.total
                    );

                }
            );

            Object.entries(
                resumen
            ).forEach(
                ([nombre,total]) => {

                    sheet.addRow([

                        nombre,

                        total

                    ]);

                }
            );

        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=ventas.xlsx"
        );

        await workbook.xlsx.write(
            res
        );

        res.end();

    }catch(error){

        console.error(
            error
        );

        res.status(500).json({

            error:
            error.message

        });

    }

};

module.exports = {

    registrarVenta,
    listarVentas,
    obtenerDetalleVenta,
    obtenerBoletaVenta,
    exportarventasExcel,
    
};