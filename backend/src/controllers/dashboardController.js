const pool =
require("../config/db");


const obtenerResumenDashboard = async (req,res) => {

    try{

        const {
            inicio,
            fin
        } = req.query;

        const esAdmin =
        req.usuario.rol ===
        "ADMIN";

        let filtros = [];
        let params = [];

        if(inicio && fin){

            params.push(
                inicio
            );

            params.push(
                fin
            );

            filtros.push(
                `DATE(v.fecha)
                BETWEEN $1 AND $2`
            );

        }else{

            filtros.push(
                `DATE(v.fecha)
                = CURRENT_DATE`
            );

        }

        if(!esAdmin){

            params.push(
                req.usuario.tienda_id
            );

            filtros.push(
                `v.tienda_id =
                $${params.length}`
            );

        }

        const ventas =
        await pool.query(
            `
            SELECT

                COUNT(*) AS ventas,

                COALESCE(
                    SUM(total),
                    0
                ) AS vendido

            FROM ventas v

            WHERE
            ${filtros.join(
                " AND "
            )}
            `,
            params
        );

        const productoEstrella =
        await pool.query(
            `
            SELECT

                p.nombre,

                SUM(
                    dv.cantidad
                ) cantidad

            FROM detalle_ventas dv

            INNER JOIN ventas v
                ON v.id = dv.venta_id

            INNER JOIN productos p
                ON p.id = dv.producto_id

            WHERE
            ${filtros.join(
                " AND "
            )}

            GROUP BY p.nombre

            ORDER BY cantidad DESC

            LIMIT 1
            `,
            params
        );

        res.json({

            ventas:
            ventas.rows[0].ventas,

            vendido:
            ventas.rows[0].vendido,

            producto_estrella:
            productoEstrella.rows[0]
            || null

        });

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

const obtenerVentasDia = async (req,res) => {

    try{

        const esAdmin =
        req.usuario.rol ===
        "ADMIN";

        let filtroTienda = "";
        let params = [];

        if(!esAdmin){

            filtroTienda =
            `
            AND tienda_id = $1
            `;

            params.push(
                req.usuario.tienda_id
            );

        }

        const result =
        await pool.query(
            `
            SELECT

                TO_CHAR(
                    fecha,
                    'HH24:00'
                ) hora,

                COUNT(*) ventas

            FROM ventas

            WHERE DATE(fecha) =
            CURRENT_DATE

            ${filtroTienda}

            GROUP BY hora

            ORDER BY hora
            `,
            params
        );

        res.json(
            result.rows
        );

    }catch(error){

        res.status(500)
        .json({

            error:
            error.message

        });

    }

};

const obtenerVentasMes = async (req,res) => {

    try{

        const esAdmin =
        req.usuario.rol ===
        "ADMIN";

        let filtroTienda = "";
        let params = [];

        if(!esAdmin){

            filtroTienda =
            `
            AND tienda_id = $1
            `;

            params.push(
                req.usuario.tienda_id
            );

        }

        const result =
        await pool.query(
            `
            SELECT

                TO_CHAR(
                    fecha,
                    'DD'
                ) dia,

                COUNT(*) ventas

            FROM ventas

            WHERE DATE_TRUNC(
                'month',
                fecha
            ) =
            DATE_TRUNC(
                'month',
                CURRENT_DATE
            )

            ${filtroTienda}

            GROUP BY dia

            ORDER BY dia
            `,
            params
        );

        res.json(
            result.rows
        );

    }catch(error){

        res.status(500)
        .json({

            error:
            error.message

        });

    }

};

const obtenerComparativoTiendas = async (req,res) => {

    try{

        const result =
        await pool.query(
            `
            SELECT

                t.nombre,

                COALESCE(
                    SUM(v.total),
                    0
                ) total

            FROM tiendas t

            LEFT JOIN ventas v
                ON v.tienda_id = t.id

            GROUP BY
                t.id,
                t.nombre

            ORDER BY
                t.nombre
            `
        );

        res.json(
            result.rows
        );

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

module.exports = {

    obtenerResumenDashboard,
    obtenerVentasDia,
    obtenerVentasMes,
    obtenerComparativoTiendas

};