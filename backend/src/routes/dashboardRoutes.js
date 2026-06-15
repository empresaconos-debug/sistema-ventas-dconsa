const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const {

    obtenerResumenDashboard,
    obtenerVentasDia,
    obtenerVentasMes,
    obtenerComparativoTiendas

} = require(
    "../controllers/dashboardController"
);

router.get(
    "/resumen",
    authMiddleware,
    obtenerResumenDashboard
);

router.get(
    "/ventas-dia",
    authMiddleware,
    obtenerVentasDia
);

router.get(
    "/ventas-mes",
    authMiddleware,
    obtenerVentasMes
);

router.get(
    "/comparativo-tiendas",
    authMiddleware,
    obtenerComparativoTiendas
);

module.exports =
router;