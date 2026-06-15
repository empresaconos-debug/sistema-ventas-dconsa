const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const {
    listarStockPorTienda,
    ingresarStock,
    obtenerStockMiTienda,
    porcionarTorta,
    descartarProducto
} = require("../controllers/stockController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/tienda/:id",
    authMiddleware,
    listarStockPorTienda
);

router.post(
    "/ingresar",
    authMiddleware,
    ingresarStock
);

router.post(
    "/porcionar",
    authMiddleware,
    porcionarTorta
);

router.post(
    "/descartar",
    authMiddleware,
    descartarProducto
);

router.get(
    "/mi-tienda",
    verificarToken,
    obtenerStockMiTienda
);

module.exports = router;