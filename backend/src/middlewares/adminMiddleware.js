function soloAdmin(req, res, next){

    if(req.usuario.rol !== "ADMIN"){

        return res.status(403).json({
            error:"Acceso denegado"
        });

    }

    next();

}

module.exports = soloAdmin;