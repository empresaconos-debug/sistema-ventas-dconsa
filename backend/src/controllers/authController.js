const pool = require("../config/db");
const bcrypt = require("bcrypt");

const crearAdmin = async (req, res) => {
  try {

    const passwordHash = await bcrypt.hash("123456", 10);

    const result = await pool.query(
      `INSERT INTO usuarios
      (nombre, usuario, password, rol)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [
        "Administrador",
        "admin",
        passwordHash,
        "ADMIN"
      ]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        const result = await pool.query(
            `SELECT * FROM usuarios
             WHERE usuario = $1
             AND activo = true`,
            [usuario]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Usuario no encontrado"
            });
        }

        const user = result.rows[0];

        const passwordValida =
            await bcrypt.compare(password, user.password);

        if (!passwordValida) {
            return res.status(401).json({
                error: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                usuario: user.usuario,
                rol: user.rol,
                tienda_id: user.tienda_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            token,
            usuario: user.usuario,
            rol: user.rol,
            tienda_id: user.tienda_id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

};

const cambiarPassword = async (req, res) => {

    try {

        const { password } = req.body;

        const usuario = req.usuario.usuario;

        const hash =
        await bcrypt.hash(password, 10);

        await pool.query(
            `
            UPDATE usuarios
            SET password = $1
            WHERE usuario = $2
            `,
            [hash, usuario]
        );

        res.json({
            mensaje:"Contraseña actualizada"
        });

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

module.exports = {
  crearAdmin,
  login,
  cambiarPassword
};