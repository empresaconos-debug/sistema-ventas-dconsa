require("dotenv").config();

console.log(process.env.DATABASE_URL);

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const stockRoutes = require("./routes/stockRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const sistemaRoutes = require("./routes/sistemaRoutes");
const cierreCajaRoutes = require("./routes/cierreCajaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reniecRoutes =require("./routes/reniecRoutes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/productos",productosRoutes);
app.use("/api/stock",stockRoutes);
app.use("/api/ventas",ventasRoutes);
app.use("/api/usuarios",usuariosRoutes);
app.use("/api/sistema",sistemaRoutes);
app.use("/api/cierre-caja",cierreCajaRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use( "/api/reniec",reniecRoutes);

app.get("/", (req, res) => {
    res.send("Sistema Pasteleria OK");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor iniciado");
});



