async function cambiarPassword(){

    const password =
    document.getElementById(
        "passwordNueva"
    ).value;

    const confirmar =
    document.getElementById(
        "passwordConfirmar"
    ).value;

    const mensaje =
    document.getElementById(
        "mensaje"
    );

    if(password.length < 6){

        mensaje.innerText =
        "La contraseña debe tener mínimo 6 caracteres";

        return;
    }

    if(password !== confirmar){

        mensaje.innerText =
        "Las contraseñas no coinciden";

        return;
    }

    const token =
    localStorage.getItem("token");

    const respuesta =
    await fetch(
        "https://sistema-dconsa-api.onrender.com/api/auth/cambiar-password",
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":
                `Bearer ${token}`
            },
            body:JSON.stringify({
                password
            })
        }
    );

    const datos =
    await respuesta.json();

    if(datos.mensaje){

        alert(
            "Contraseña actualizada correctamente. Debe iniciar sesión nuevamente."
        );

        localStorage.clear();

        window.location.href =
        "login.html";

    }else{

        mensaje.innerText =
        datos.error;

    }

}

function volverDashboard(){

    const rol =
    localStorage.getItem("rol");

    if(rol === "ADMIN"){

        window.location.href =
        "dashboard-admin.html";

    }

}

function cerrarEIrLogin(){

    localStorage.clear();

    window.location.href =
    "login.html";

}

function togglePassword(id, icono){

    const input =
    document.getElementById(id);

    if(input.type === "password"){

        input.type = "text";

        icono.classList.remove("fa-eye");

        icono.classList.add("fa-eye-slash");

    }else{

        input.type = "password";

        icono.classList.remove("fa-eye-slash");

        icono.classList.add("fa-eye");

    }

}