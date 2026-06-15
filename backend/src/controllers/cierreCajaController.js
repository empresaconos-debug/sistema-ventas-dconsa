const pool =
require("../config/db");


const obtenerResumenCaja = async (req,res) => {

    try{

        const tienda_id =
        req.usuario.tienda_id;

        const result =
        await pool.query(
            `
            SELECT

                COUNT(*) AS ventas,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago =
                        'EFECTIVO'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) AS total_efectivo,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago =
                        'YAPE'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) AS total_yape,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago =
                        'TARJETA'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) AS total_tarjeta,

                COALESCE(
                    SUM(total),
                    0
                ) AS total_general

            FROM ventas

            WHERE tienda_id = $1

            AND DATE(fecha) =
            CURRENT_DATE
            `,
            [
                tienda_id
            ]
        );

        res.json(
            result.rows[0]
        );

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const cerrarCaja = async (req,res) => {

    try{

        const tienda_id =
        req.usuario.tienda_id;

        const usuario_id =
        req.usuario.id;

        const cierreExistente =
        await pool.query(
            `
            SELECT id
            FROM cierres_caja
            WHERE fecha = CURRENT_DATE
            AND tienda_id = $1
            `,
            [
                tienda_id
            ]
        );

        if(
            cierreExistente.rows.length > 0
        ){

            return res.status(400).json({

                error:
                "La caja ya fue cerrada hoy"

            });

        }

        const ventas =
        await pool.query(
            `
            SELECT

                p.nombre AS producto,

                dv.cantidad,

                v.metodo_pago,

                dv.subtotal AS total

            FROM ventas v

            INNER JOIN detalle_ventas dv
                ON dv.venta_id = v.id

            INNER JOIN productos p
                ON p.id = dv.producto_id

            WHERE
                v.tienda_id = $1

            AND DATE(v.fecha) =
            CURRENT_DATE
            `,
            [
                tienda_id
            ]
        );

        const resumen =
        await pool.query(
            `
            SELECT

                COUNT(*) AS ventas,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago='EFECTIVO'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) total_efectivo,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago='YAPE'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) total_yape,

                COALESCE(
                    SUM(
                        CASE
                        WHEN metodo_pago='TARJETA'
                        THEN total
                        ELSE 0
                        END
                    ),
                    0
                ) total_tarjeta,

                COALESCE(
                    SUM(total),
                    0
                ) total_general

            FROM ventas

            WHERE tienda_id = $1

            AND DATE(fecha) =
            CURRENT_DATE
            `,
            [
                tienda_id
            ]
        );

        const datos =
        resumen.rows[0];

        const porcionamientos =
        await pool.query(
            `
            SELECT

                p.nombre,

                po.cantidad_tortas,

                po.cantidad_porciones

            FROM porcionamientos po

            INNER JOIN productos p
                ON p.id = po.producto_id

            WHERE po.tienda_id = $1

            AND DATE(po.fecha) =
            CURRENT_DATE

            ORDER BY po.id
            `,
            [
                tienda_id
            ]
        );

        const descartes =
        await pool.query(
            `
            SELECT

                p.nombre,

                d.cantidad,

                d.motivo

            FROM descartes d

            INNER JOIN productos p
                ON p.id = d.producto_id

            WHERE d.tienda_id = $1

            AND DATE(d.fecha) =
            CURRENT_DATE

            ORDER BY d.id
            `,
            [
                tienda_id
            ]
        );

        await pool.query(
            `
            INSERT INTO cierres_caja
            (
                tienda_id,
                usuario_id,
                fecha,
                cantidad_ventas,
                total_efectivo,
                total_yape,
                total_tarjeta,
                total_general,
                detalle,
                fecha_cierre
            )
            VALUES
            (
                $1,$2,
                CURRENT_DATE,
                $3,$4,$5,$6,$7,
                $8,
                NOW()
            )
            `,
            [
                tienda_id,
                usuario_id,
                datos.ventas,
                datos.total_efectivo,
                datos.total_yape,
                datos.total_tarjeta,
                datos.total_general,
                JSON.stringify({

                ventas:
                ventas.rows,

                porcionamientos:
                porcionamientos.rows,

                descartes:
                descartes.rows

            })
            ]
        );

        res.json({

            mensaje:
            "Caja cerrada correctamente"

        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};


const obtenerDetalleCaja = async (req,res) => {

    try{

        const tienda_id =
        req.usuario.tienda_id;

        const result =
        await pool.query(
            `
            SELECT

                p.nombre AS producto,

                dv.cantidad,

                v.metodo_pago,

                dv.subtotal AS total

            FROM ventas v

            INNER JOIN detalle_ventas dv
                ON dv.venta_id = v.id

            INNER JOIN productos p
                ON p.id = dv.producto_id

            WHERE
                v.tienda_id = $1

            AND DATE(v.fecha) =
            CURRENT_DATE

            ORDER BY v.id DESC
            `,
            [
                tienda_id
            ]
        );


        const porcionamientos =
        await pool.query(
            `
            SELECT

                p.nombre,

                po.cantidad_tortas,

                po.cantidad_porciones

            FROM porcionamientos po

            INNER JOIN productos p
                ON p.id = po.producto_id

            WHERE po.tienda_id = $1

            AND DATE(po.fecha) =
            CURRENT_DATE

            ORDER BY po.id
            `,
            [
                tienda_id
            ]
        );

        const descartes =
        await pool.query(
            `
            SELECT

                p.nombre,

                d.cantidad,

                d.motivo

            FROM descartes d

            INNER JOIN productos p
                ON p.id = d.producto_id

            WHERE d.tienda_id = $1

            AND DATE(d.fecha) =
            CURRENT_DATE

            ORDER BY d.id
            `,
            [
                tienda_id
            ]
        );

        res.json({

            ventas:
            result.rows,

            porcionamientos:
            porcionamientos.rows,

            descartes:
            descartes.rows

        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const listarCierres = async (req,res) => {

    try{

        const {
            fecha,
            tienda
        } = req.query;

        let sql = `
            SELECT

                cc.id,

                cc.fecha,

                t.nombre AS tienda,

                cc.cantidad_ventas,

                cc.total_general

            FROM cierres_caja cc

            INNER JOIN tiendas t
                ON t.id = cc.tienda_id

            WHERE 1=1
        `;

        const params = [];

        if(fecha){

            params.push(fecha);

            sql += `
                AND cc.fecha = $${params.length}
            `;

        }

        if(tienda){

            params.push(tienda);

            sql += `
                AND cc.tienda_id = $${params.length}
            `;

        }

        sql += `
            ORDER BY cc.id DESC
        `;

        const result =
        await pool.query(
            sql,
            params
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

const obtenerDetalleCierre = async (req,res) => {

    try{

        const { id } =
        req.params;

        const result =
        await pool.query(
            `
            SELECT

                cc.*,

                t.nombre AS tienda,

                u.nombre AS usuario

            FROM cierres_caja cc

            INNER JOIN tiendas t
                ON t.id = cc.tienda_id

            INNER JOIN usuarios u
                ON u.id = cc.usuario_id

            WHERE cc.id = $1
            `,
            [
                id
            ]
        );

        if(
            result.rows.length === 0
        ){

            return res.status(404)
            .json({

                error:
                "Cierre no encontrado"

            });

        }

        res.json(
            result.rows[0]
        );

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const verificarEstadoCaja = async (req,res) => {

    try{

        const resultado =
        await pool.query(
            `
            SELECT id
            FROM cierres_caja
            WHERE fecha = CURRENT_DATE
            AND tienda_id = $1
            `,
            [
                req.usuario.tienda_id
            ]
        );

        res.json({

            cerrada:
            resultado.rows.length > 0

        });

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

module.exports = {

    obtenerResumenCaja,
    obtenerDetalleCaja,
    listarCierres,
    obtenerDetalleCierre,
    cerrarCaja,
     verificarEstadoCaja
};