const pool = require("../config/db");

const listarStockPorTienda = async (req,res) => {

    try{

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
            p.id,
            p.categoria_id,
            p.nombre,
            p.precio,
            s.cantidad
            FROM stock s
            INNER JOIN productos p
                ON p.id = s.producto_id
            WHERE s.tienda_id = $1
            AND p.activo = true
            ORDER BY p.nombre
            `,
            [id]
        );

        res.json(result.rows);

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};


const ingresarStock = async (req, res) => {

    try{

        let {
                tienda_id,
                producto_id,
                cantidad,
                observacion
            } = req.body;

            const usuario_id =
            req.usuario.id;

            if(req.usuario.rol !== "ADMIN"){

                tienda_id =
                req.usuario.tienda_id;

            }

        await pool.query(
            `
            INSERT INTO movimientos_stock
            (
                tienda_id,
                producto_id,
                usuario_id,
                tipo,
                cantidad,
                observacion
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            `,
            [
                tienda_id,
                producto_id,
                usuario_id,
                "INGRESO",
                cantidad,
                observacion
            ]
        );

        const existe =
        await pool.query(
            `
            SELECT *
            FROM stock
            WHERE tienda_id = $1
            AND producto_id = $2
            `,
            [
                tienda_id,
                producto_id
            ]
        );

        if(existe.rows.length > 0){

            await pool.query(
                `
                UPDATE stock
                SET cantidad = cantidad + $1
                WHERE tienda_id = $2
                AND producto_id = $3
                `,
                [
                    cantidad,
                    tienda_id,
                    producto_id
                ]
            );

        }else{

            await pool.query(
                `
                INSERT INTO stock
                (
                    tienda_id,
                    producto_id,
                    cantidad
                )
                VALUES
                ($1,$2,$3)
                `,
                [
                    tienda_id,
                    producto_id,
                    cantidad
                ]
            );

        }

        res.json({
            mensaje:"Stock actualizado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const obtenerStockMiTienda = async (req,res) => {

    try{

        const tienda_id =
        req.usuario.tienda_id;

        console.log(
            "TIENDA:",
            tienda_id
        );

        const result =
        await pool.query(
            `
            SELECT
                p.id,
                p.nombre,
                p.precio,
                s.cantidad
            FROM stock s
            INNER JOIN productos p
                ON p.id = s.producto_id
            WHERE s.tienda_id = $1
            AND p.activo = true
            AND s.cantidad > 0
            ORDER BY p.nombre
            `,
            [tienda_id]
        );

        res.json(result.rows);

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const porcionarTorta = async (req,res) => {

    try{

        const {

            producto_id,
            cantidad_tortas,
            cantidad_porciones

        } = req.body;

        const tienda_id =
        req.usuario.tienda_id;

        const usuario_id =
        req.usuario.id;

        const stockTorta =
        await pool.query(
            `
            SELECT cantidad

            FROM stock

            WHERE tienda_id = $1

            AND producto_id = $2
            `,
            [
                tienda_id,
                producto_id
            ]
        );

        if(
            stockTorta.rows.length === 0
        ){

            return res.status(404)
            .json({

                error:
                "Producto no encontrado"

            });

        }

        if(
            Number(
                stockTorta.rows[0].cantidad
            ) <
            Number(
                cantidad_tortas
            )
        ){

            return res.status(400)
            .json({

                error:
                "Stock insuficiente"

            });

        }

        await pool.query(
            `
            UPDATE stock

            SET cantidad =
            cantidad - $1

            WHERE tienda_id = $2

            AND producto_id = $3
            `,
            [
                cantidad_tortas,
                tienda_id,
                producto_id
            ]
        );

        const productoPorcion =
        await pool.query(
            `
            SELECT id

            FROM productos

            WHERE LOWER(nombre)
            LIKE '%porcion%'
            LIMIT 1
            `
        );

        const porcion_id =
productoPorcion.rows[0].id;

const stockPorcion =
await pool.query(
    `
    SELECT id

    FROM stock

    WHERE tienda_id = $1

    AND producto_id = $2
    `,
    [
        tienda_id,
        porcion_id
    ]
);

if(
    stockPorcion.rows.length > 0
){

    await pool.query(
        `
        UPDATE stock

        SET cantidad =
        cantidad + $1

        WHERE tienda_id = $2

        AND producto_id = $3
        `,
        [
            cantidad_porciones,
            tienda_id,
            porcion_id
        ]
    );

}else{

    await pool.query(
        `
        INSERT INTO stock
        (
            tienda_id,
            producto_id,
            cantidad
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        `,
        [
            tienda_id,
            porcion_id,
            cantidad_porciones
        ]
    );

}

        await pool.query(
            `
            INSERT INTO porcionamientos
            (
                tienda_id,
                producto_id,
                cantidad_tortas,
                cantidad_porciones,
                usuario_id
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            `,
            [
                tienda_id,
                producto_id,
                cantidad_tortas,
                cantidad_porciones,
                usuario_id
            ]
        );

        res.json({

            mensaje:
            "Porcionamiento registrado"

        });

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

const descartarProducto = async (req,res) => {

    try{

        const {

            producto_id,
            cantidad,
            motivo

        } = req.body;

        const tienda_id =
        req.usuario.tienda_id;

        const usuario_id =
        req.usuario.id;

        const stockActual =
        await pool.query(
            `
            SELECT cantidad

            FROM stock

            WHERE tienda_id = $1

            AND producto_id = $2
            `,
            [
                tienda_id,
                producto_id
            ]
        );

        if(
            stockActual.rows.length === 0
        ){

            return res.status(404)
            .json({

                error:
                "Producto no encontrado"

            });

        }

        if(
            Number(
                stockActual.rows[0].cantidad
            ) <
            Number(
                cantidad
            )
        ){

            return res.status(400)
            .json({

                error:
                "Stock insuficiente"

            });

        }

        await pool.query(
            `
            UPDATE stock

            SET cantidad =
            cantidad - $1

            WHERE tienda_id = $2

            AND producto_id = $3
            `,
            [
                cantidad,
                tienda_id,
                producto_id
            ]
        );

        await pool.query(
            `
            INSERT INTO descartes
            (
                tienda_id,
                producto_id,
                cantidad,
                motivo,
                usuario_id
            )
            VALUES
            (
                $1,$2,$3,$4,$5
            )
            `,
            [
                tienda_id,
                producto_id,
                cantidad,
                motivo,
                usuario_id
            ]
        );

        res.json({

            mensaje:
            "Descarte registrado"

        });

    }catch(error){

        res.status(500).json({

            error:
            error.message

        });

    }

};

module.exports = {
    listarStockPorTienda,
    ingresarStock,
    obtenerStockMiTienda,
    porcionarTorta,
    descartarProducto
};