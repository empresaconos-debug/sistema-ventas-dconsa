const express =
require("express");

const router =
express.Router();

const verificarToken =
require(
    "../middlewares/authMiddleware"
);

const {

    obtenerResumenCaja,
    obtenerDetalleCaja,
    listarCierres,
    obtenerDetalleCierre,
    cerrarCaja,
    verificarEstadoCaja

}
=
require(
    "../controllers/cierreCajaController"
);



router.get(
    "/resumen",
    verificarToken,
    obtenerResumenCaja
);

router.get(
    "/detalle",
    verificarToken,
    obtenerDetalleCaja
);

router.get(
    "/",
    verificarToken,
    listarCierres
);

router.get(
    "/estado",
    verificarToken,
    verificarEstadoCaja
);

router.get(
    "/:id",
    verificarToken,
    obtenerDetalleCierre
);

router.post(
    "/cerrar",
    verificarToken,
    cerrarCaja
);



module.exports =
router;