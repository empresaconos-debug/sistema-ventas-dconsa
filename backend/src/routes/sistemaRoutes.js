const express = require("express");

const router = express.Router();

router.get(
    "/fecha",
    (req,res)=>{

        console.log(
            "RUTA FECHA EJECUTADA"
        );

        const fecha =
        new Date();

        const fechaPeru =
        fecha.toLocaleDateString(
            "sv-SE",
            {
                timeZone:
                "America/Lima"
            }
        );

        res.json({
            fecha:fechaPeru
        });

    }
);

module.exports = router;