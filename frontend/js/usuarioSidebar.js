setTimeout(() => {

    const rol =
    localStorage.getItem("rol");

    const usuario =
    localStorage.getItem("usuario");

    let textoRol = "";

    if(rol === "ADMIN"){

        textoRol = "Administrador";

    }else if(rol === "CONO1"){

        textoRol = "Cono 1";

    }else if(rol === "CONO2"){

        textoRol = "Cono 2";

    }else if(rol === "CONO3"){

        textoRol = "Cono 3";

    }else{

        textoRol = rol;

    }

    const rolElement =
    document.getElementById(
        "nombreRol"
    );

    const usuarioElement =
    document.getElementById(
        "nombreUsuario"
    );

    if(rolElement){

        rolElement.innerText =
        textoRol;

    }

    if(usuarioElement){

        usuarioElement.innerText =
        usuario;

    }

},100);