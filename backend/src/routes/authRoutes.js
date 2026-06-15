const verificarToken = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

const {
  crearAdmin,
  login,
  cambiarPassword
} = require("../controllers/authController");

router.get("/crear-admin", crearAdmin);

router.post("/login", login);

router.put("/cambiar-password",verificarToken,cambiarPassword);

module.exports = router;