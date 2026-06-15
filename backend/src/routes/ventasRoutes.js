const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const {
    registrarVenta,
    listarVentas,
    obtenerDetalleVenta,
    obtenerBoletaVenta,
    exportarventasExcel
} = require("../controllers/ventasController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post(
    "/",
    verificarToken,
    registrarVenta
);

router.get(
    "/",
    verificarToken,
    listarVentas
);

router.get(
    "/excel",
    verificarToken,
    exportarventasExcel
);

router.get(
    "/:id/boleta",
    verificarToken,
    obtenerBoletaVenta
);


router.get(
    "/:id",
    verificarToken,
    obtenerDetalleVenta
);

module.exports = router;