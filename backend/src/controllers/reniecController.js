const axios =
require("axios");

const consultarDni =
async (req,res) => {

    try{

        const { dni } =
        req.params;

        if(
            dni === "00000000"
        ){

            return res.json({

                dni:
                "00000000",

                nombre:
                "PUBLICO GENERAL"

            });

        }

        const respuesta =
        await axios.get(
            `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${process.env.APISPERU_TOKEN}`
        );



        const persona =
        respuesta.data;

        if(
            !persona.success
        ){

            return res.status(404).json({

                error:
                "DNI no encontrado"

            });

        }

        const nombreCompleto =
        `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;

        res.json({

            dni,

            nombre:
            nombreCompleto

        });

    }catch(error){

        console.error(
            error.response?.data
            || error.message
        );

        res.status(500).json({

            error:
            "Error consultando DNI"

        });

    }

};

module.exports = {

    consultarDni

};