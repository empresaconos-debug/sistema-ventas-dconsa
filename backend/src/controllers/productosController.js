const pool = require("../config/db");

const listarProductos = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.id,
                p.nombre,
                p.precio,
                p.activo,
                c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c
                ON c.id = p.categoria_id
            ORDER BY p.id
        `);

        res.json(result.rows);

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const crearProducto = async (req, res) => {

    try {

        const {
            categoria_id,
            nombre,
            precio
        } = req.body;



        const existe = await pool.query(
                `
                SELECT id
                FROM productos
                WHERE UPPER(nombre)=UPPER($1)
                `,
                [nombre]
            );

            if(existe.rows.length > 0){

                return res.status(400).json({
                    error:"Ya existe un producto con ese nombre"
                });

            }


        const result = await pool.query(
            `
            INSERT INTO productos
            (
                categoria_id,
                nombre,
                precio
            )
            VALUES ($1,$2,$3)
            RETURNING *
            `,
            [
                categoria_id,
                nombre,
                precio
            ]
        );

        res.json(result.rows[0]);

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const editarProducto = async (req, res) => {

    try{

        const { id } = req.params;

        const { precio } = req.body;

        await pool.query(
            `
            UPDATE productos
            SET precio = $1
            WHERE id = $2
            `,
            [
                precio,
                id
            ]
        );

        res.json({
            mensaje:"Precio actualizado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const desactivarProducto = async (req,res)=>{

    try{

        const { id } = req.params;

        await pool.query(
            `
            UPDATE productos
            SET activo = false
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje:"Producto desactivado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const activarProducto = async (req,res) => {

    try{

        const { id } = req.params;

        const producto = await pool.query(
            `
            SELECT *
            FROM productos
            WHERE id = $1
            `,
            [id]
        );

        if(producto.rows.length === 0){

            return res.status(404).json({
                error:"Producto no encontrado"
            });

        }

        const nombre =
        producto.rows[0].nombre;

        const existeActivo =
        await pool.query(
            `
            SELECT id
            FROM productos
            WHERE UPPER(nombre)=UPPER($1)
            AND activo = true
            AND id <> $2
            `,
            [nombre,id]
        );

        if(existeActivo.rows.length > 0){

            return res.status(400).json({
                error:
                "Ya existe un producto activo con ese nombre"
            });

        }

        await pool.query(
            `
            UPDATE productos
            SET activo = true
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje:"Producto activado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};


module.exports = {
    listarProductos,
    crearProducto,
    editarProducto,
    desactivarProducto,
    activarProducto
};