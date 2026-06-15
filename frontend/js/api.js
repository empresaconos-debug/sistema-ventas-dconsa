async function fetchConToken(url, opciones = {}){

    const token =
    localStorage.getItem("token");

    opciones.headers = {
        ...opciones.headers,
        Authorization:
        `Bearer ${token}`
    };

    const respuesta =
    await fetch(url, opciones);

    if(respuesta.status === 401){

        localStorage.removeItem(
            "token"
        );

        window.location.href =
        "login.html";

        return;
    }

    return respuesta;

}