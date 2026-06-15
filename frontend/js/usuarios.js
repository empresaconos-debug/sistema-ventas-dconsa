let usuarioEditando = null;

const authToken = localStorage.getItem("token");

async function cargarUsuarios(){

    const respuesta =
    await fetch(
        "http://localhost:3000/api/usuarios",
        {
            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    const usuarios =
    await respuesta.json();

    console.log(usuarios);

    let html = "";

    usuarios.forEach(usuario => {

        html += `

        <tr>

            <td>${usuario.id}</td>

            <td>${usuario.nombre}</td>

            <td>${usuario.usuario}</td>

            <td>${usuario.rol}</td>

            <td>
                ${usuario.tienda || "-"}
            </td>

            <td>
                ${
                    usuario.activo
                    ? "🟢 Activo"
                    : "🔴 Inactivo"
                }
            </td>

            <td>

                <button
                    class="btn"
                    onclick="editarUsuario(
                        ${usuario.id},
                        '${usuario.nombre}',
                        '${usuario.rol}',
                        '${usuario.tienda_id || ""}',
                        '${usuario.usuario}'
                    )"
                >
                    ✏️
                </button>

                <button
                    class="btn"
                    onclick="cambiarPasswordUsuario(
                        ${usuario.id}
                    )"
                >
                    🔑
                </button>

                ${
                    usuario.activo

                    ?

                    `<button
                        class="btn"
                        onclick="desactivarUsuario(
                            ${usuario.id}
                        )"
                    >
                        🔴
                    </button>`

                    :

                    `<button
                        class="btn"
                        onclick="activarUsuario(
                            ${usuario.id}
                        )"
                    >
                        🟢
                    </button>`
                }

            </td>

        </tr>

        `;

    });

    document.getElementById(
        "tablaUsuarios"
    ).innerHTML = html;

}

async function guardarUsuario(){

    const nombre =
    document.getElementById(
        "nombre"
    ).value;

    const usuario =
    document.getElementById(
        "usuario"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    const rol =
    document.getElementById(
        "rol"
    ).value;

    const tienda_id =
    document.getElementById(
        "tienda"
    ).value;

    let respuesta;

    if(usuarioEditando){

        respuesta =
        await fetch(
            `http://localhost:3000/api/usuarios/${usuarioEditando}`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${authToken}`
                },

                body:JSON.stringify({

                    nombre,
                    usuario,
                    rol,
                    tienda_id

                })
            }
        );

        const datos =
        await respuesta.json();

        if(!respuesta.ok){

            alert(
                datos.error
            );

            return;

        }

        alert(
            "Usuario actualizado"
        );

        usuarioEditando = null;

    }else{

        respuesta =
        await fetch(
            "http://localhost:3000/api/usuarios",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${authToken}`
                },

                body:JSON.stringify({

                    nombre,
                    usuario,
                    password,
                    rol,
                    tienda_id

                })
            }
        );

        const datos =
        await respuesta.json();

        if(!respuesta.ok){

            alert(
                datos.error
            );

            return;

        }

        alert(
            "Usuario creado"
        );

    }

    document.getElementById(
        "nombre"
    ).value = "";

    document.getElementById(
        "usuario"
    ).value = "";

    document.getElementById(
        "password"
    ).value = "";

    document.getElementById(
        "rol"
    ).value = "TIENDA";

    document.getElementById(
        "tienda"
    ).value = "";

    cargarUsuarios();

}

function editarUsuario(
    id,
    nombre,
    rol,
    tienda_id,
    usuario
){

    usuarioEditando = id;

    document.getElementById(
        "nombre"
    ).value = nombre;

    document.getElementById(
        "usuario"
    ).value = usuario;

    document.getElementById(
        "usuario"
    ).readOnly = false;

    document.getElementById(
        "password"
    ).value = "********";

    document.getElementById(
        "password"
    ).readOnly = true;

    document.getElementById(
        "rol"
    ).value = rol;

    document.getElementById(
        "tienda"
    ).value = tienda_id;

}

async function cambiarPasswordUsuario(id){

    const password =
    prompt(
        "Nueva contraseña"
    );

    if(!password){

        return;

    }

    await fetch(
        `http://localhost:3000/api/usuarios/password/${id}`,
        {
            method:"PUT",

            headers:{
                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${authToken}`
            },

            body:JSON.stringify({
                password
            })
        }
    );

    alert(
        "Contraseña actualizada"
    );

}


async function desactivarUsuario(id){

    if(
        !confirm(
            "¿Desactivar usuario?"
        )
    ){
        return;
    }

    await fetch(
        `http://localhost:3000/api/usuarios/${id}`,
        {
            method:"DELETE",

            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    cargarUsuarios();

}

async function activarUsuario(id){

    await fetch(
        `http://localhost:3000/api/usuarios/activar/${id}`,
        {
            method:"PUT",

            headers:{
                Authorization:
                `Bearer ${authToken}`
            }
        }
    );

    cargarUsuarios();

}

cargarUsuarios();