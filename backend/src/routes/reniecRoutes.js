const express = require("express");

const router = express.Router();

const {
    consultarDni
} = require(
    "../controllers/reniecController"
);

router.get(
    "/dni/:dni",
    consultarDni
);

module.exports = router;