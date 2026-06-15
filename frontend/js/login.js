const formulario =
document.getElementById("loginForm");

formulario.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const usuario =
    document.getElementById("usuario").value;

    const password =
    document.getElementById("password").value;

    try{

        const respuesta =
        await fetch(
            "https://sistema-dconsa-api.onrender.com/api/auth/login",
            {
                method:"POST",
                headers:{   
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    usuario,
                    password
                })
            }
        );

        const datos =
        await respuesta.json();

        if(datos.token){

            localStorage.setItem(
                "token",
                datos.token
            );

            localStorage.setItem(
                "rol",
                datos.rol
            );

            localStorage.setItem(
                "usuario",
                datos.usuario
            );

            localStorage.setItem(
                "tienda_id",
                datos.tienda_id
            );

            if(datos.rol === "ADMIN"){

                window.location.href =
                "dashboard-admin.html";

            }else if(datos.rol === "TIENDA"){

                window.location.href =
                "dashboard-tienda.html";

            }else{

                alert(
                    "Rol no válido"
                );

            }

        }else{

            document.getElementById(
                "mensaje"
            ).innerText =
            datos.error;

        }

    }catch(error){

        console.error(error);

    }

});

const togglePassword =
document.getElementById("togglePassword");

const password =
document.getElementById("password");

togglePassword.addEventListener("click", ()=>{

    const tipo =
    password.getAttribute("type");

    if(tipo === "password"){

        password.setAttribute(
            "type",
            "text"
        );

        togglePassword.innerText = "🙈";

    }else{

        password.setAttribute(
            "type",
            "password"
        );

        togglePassword.innerText = "👁️";

    }

});