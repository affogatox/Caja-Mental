const entrada = document.getElementById("entrada");
const boton = document.getElementById("guardar");
const listaNotas = document.getElementById("lista-notas");

// Cargar SOLO las notas del index
let notas = JSON.parse(localStorage.getItem("notas_index")) || [];

// Botón nueva ventana
document.getElementById("nueva-ventana").addEventListener("click", () => {
    window.location.href = "notas.html";
});

// Guardar con botón
boton.addEventListener("click", () => {
    guardarNota();
});

// Guardar con Enter
entrada.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        guardarNota();
    }
});

function guardarNota() {
    const texto = entrada.value.trim();

    if (texto !== "") {

        // 1. Guardar en notas_index (solo para index.html)
        notas.push(texto);
        localStorage.setItem("notas_index", JSON.stringify(notas));

        // 2. Guardar también en notas_historial (para notas.html)
        const historial = JSON.parse(localStorage.getItem("notas_historial")) || [];
        historial.push(texto);
        localStorage.setItem("notas_historial", JSON.stringify(historial));

        entrada.value = "";
        mostrarNotas();
    }
}

function mostrarNotas() {
    listaNotas.innerHTML = "";

    notas.forEach((nota, index) => {
        const div = document.createElement("div");
        div.className = "nota";

        const texto = document.createElement("span");
        texto.textContent = nota;
        texto.className = "texto-nota";

        // Botón editar
        const botonEditar = document.createElement("button");
        botonEditar.className = "btn-editar";
        botonEditar.textContent = "✏️";

        botonEditar.addEventListener("click", () => {
            const input = document.createElement("textarea");
            input.value = nota;
            input.className = "editor-nota";

            div.replaceChild(input, texto);
            input.focus();

            input.addEventListener("blur", () => {
                const nuevoTexto = input.value.trim();
                if (nuevoTexto !== "") {
                    notas[index] = nuevoTexto;
                    localStorage.setItem("notas_index", JSON.stringify(notas));
                }
                mostrarNotas();
            });

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    input.blur();
                }
            });
        });

        // Botón borrar
        const botonBorrar = document.createElement("button");
        botonBorrar.className = "btn-borrar";
        botonBorrar.textContent = "✖";

        botonBorrar.addEventListener("click", () => {
            notas.splice(index, 1);
            localStorage.setItem("notas_index", JSON.stringify(notas));
            mostrarNotas();
        });

        const acciones = document.createElement("div");
        acciones.className = "acciones-nota";
        acciones.appendChild(botonEditar);
        acciones.appendChild(botonBorrar);

        div.appendChild(texto);
        div.appendChild(acciones);

        listaNotas.appendChild(div);
    });
}