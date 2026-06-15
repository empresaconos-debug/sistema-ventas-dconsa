const pool = require("../config/db");
const bcrypt = require("bcrypt");

const listarUsuarios = async (req,res) => {

    try{

        const result =
        await pool.query(
            `
            SELECT
                u.id,
                u.nombre,
                u.usuario,
                u.rol,
                u.tienda_id,
                t.nombre AS tienda,
                u.activo
            FROM usuarios u
            LEFT JOIN tiendas t
                ON t.id = u.tienda_id
            ORDER BY u.id
            `
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

const crearUsuario = async (req,res) => {

    try{

        const {
            nombre,
            usuario,
            password,
            rol,
            tienda_id
        } = req.body;

        const existe =
        await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE usuario = $1
            `,
            [usuario]
        );

        if(existe.rows.length > 0){

            return res.status(400).json({
                error:"Usuario ya existe"
            });

        }

        const hash =
        await bcrypt.hash(
            password,
            10
        );

        await pool.query(
            `
            INSERT INTO usuarios
            (
                nombre,
                usuario,
                password,
                rol,
                tienda_id,
                activo
            )
            VALUES
            ($1,$2,$3,$4,$5,true)
            `,
            [
                nombre,
                usuario,
                hash,
                rol,
                tienda_id || null
            ]
        );

        res.json({
            mensaje:"Usuario creado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const actualizarUsuario = async (req,res) => {

    try{

        const { id } =
        req.params;

        const {
            nombre,
            usuario,
            rol,
            tienda_id
        } = req.body;

        await pool.query(
            `
            UPDATE usuarios
            SET
                nombre = $1,
                usuario = $2,
                rol = $3,
                tienda_id = $4
            WHERE id = $5
            `,
            [
                nombre,
                usuario,
                rol,
                tienda_id || null,
                id
            ]
        );

        res.json({
            mensaje:"Usuario actualizado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const cambiarPassword = async (req,res) => {

    try{

        const { id } =
        req.params;

        const { password } =
        req.body;

        const hash =
        await bcrypt.hash(
            password,
            10
        );

        await pool.query(
            `
            UPDATE usuarios
            SET password = $1
            WHERE id = $2
            `,
            [
                hash,
                id
            ]
        );

        res.json({
            mensaje:"Contraseña actualizada"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const desactivarUsuario = async (req,res) => {

    try{

        const { id } =
        req.params;

        await pool.query(
            `
            UPDATE usuarios
            SET activo = false
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje:"Usuario desactivado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

const activarUsuario = async (req,res) => {

    try{

        const { id } =
        req.params;

        await pool.query(
            `
            UPDATE usuarios
            SET activo = true
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            mensaje:"Usuario activado"
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

module.exports = {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarPassword,
    activarUsuario,
    desactivarUsuario
};