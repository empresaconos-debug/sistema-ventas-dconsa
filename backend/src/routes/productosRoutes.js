const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const soloAdmin = require("../middlewares/adminMiddleware");

const {
    listarProductos,
    crearProducto,
    editarProducto,
    desactivarProducto,
    activarProducto
} = require("../controllers/productosController");

router.get("/",verificarToken, listarProductos);

router.post("/",verificarToken, soloAdmin, crearProducto);

router.put("/:id",verificarToken, soloAdmin, editarProducto
);

router.delete("/:id",verificarToken, soloAdmin, desactivarProducto);

router.put("/activar/:id", verificarToken, soloAdmin, activarProducto);

module.exports = router;