const express =
require("express");

const router =
express.Router();

const verificarToken =
require("../middlewares/authMiddleware");

const {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarPassword,
    activarUsuario,
    desactivarUsuario
}
=
require(
    "../controllers/usuariosController"
);

router.get(
    "/",
    verificarToken,
    listarUsuarios
);

router.post(
    "/",
    verificarToken,
    crearUsuario
);

router.put(
    "/:id",
    verificarToken,
    actualizarUsuario
);

router.put(
    "/password/:id",
    verificarToken,
    cambiarPassword
);

router.put(
    "/activar/:id",
    verificarToken,
    activarUsuario
);

router.delete(
    "/:id",
    verificarToken,
    desactivarUsuario
);

module.exports =
router;