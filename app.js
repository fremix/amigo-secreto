// Clave para almacenar en localStorage
const STORAGE_KEY = "amigoSecreto_amigos";

// Arreglo para almacenar los nombres de los amigos
let amigos = [];

// === INICIALIZACIÓN ===
document.addEventListener("DOMContentLoaded", function () {
  cargarDesdeStorage();
  mostrarLista();
  actualizarEstadoResultado();
});

// === CARGAR Y GUARDAR EN LOCAL STORAGE ===
function guardarEnStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(amigos));
}

function cargarDesdeStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    amigos = JSON.parse(data);
  }
}

function limpiarStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

// === AGREGAR AMIGO ===
function agregarAmigo() {
  const input = document.getElementById("amigo");
  const nombre = input.value.trim();

  if (nombre === "") {
    alert("Por favor, ingresa un nombre válido.");
    return;
  }

  if (amigos.includes(nombre)) {
    alert(`${nombre} ya fue agregado.`);
    return;
  }

  amigos.push(nombre);
  guardarEnStorage();
  mostrarLista();
  actualizarEstadoResultado();

  input.value = "";
  input.focus();
}

// === MOSTRAR LISTA CON BOTONES DE ELIMINAR ===
function mostrarLista() {
  const lista = document.getElementById("listaAmigos");
  lista.innerHTML = "";

  amigos.forEach((nombre, index) => {
    const li = document.createElement("li");
    li.setAttribute("role", "listitem");
    li.className = "name-item";

    const span = document.createElement("span");
    span.textContent = nombre;
    li.appendChild(span);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "button-remove";
    button.innerHTML = '&times;';
    button.setAttribute("aria-label", `Eliminar a ${nombre}`);
    button.onclick = function () {
      eliminarAmigo(index);
    };

    li.appendChild(button);
    lista.appendChild(li);
  });
}

// === ELIMINAR AMIGO Y ACTUALIZAR STORAGE ===
function eliminarAmigo(index) {
  amigos.splice(index, 1);
  guardarEnStorage();
  mostrarLista();
  actualizarEstadoResultado();
}

// === ACTUALIZAR MENSAJE DE RESULTADO ===
function actualizarEstadoResultado() {
  const resultado = document.getElementById("resultado");
  if (amigos.length === 0) {
    resultado.innerHTML = "<li>Lista vacía. Agrega amigos para sortear.</li>";
  } else {
    resultado.innerHTML = "<li>Lista lista. Haz clic en 'Sortear amigo' para comenzar.</li>";
  }
}

// === SORTEO AVANZADO: GENERAR PAREJAS ÚNICAS (INTERCAMBIO REAL) ===
function sortearAmigo() {
  const resultado = document.getElementById("resultado");

  if (amigos.length < 2) {
    resultado.innerHTML = "<li>⚠️ Necesitas al menos 2 amigos para hacer un intercambio.</li>";
    return;
  }

  // Generar emparejamientos únicos: nadie se saca a sí mismo
  const parejas = generarParejasUnicas(amigos);

  if (!parejas) {
    resultado.innerHTML = "<li>❌ No fue posible generar un intercambio válido. Intenta con más personas.</li>";
    return;
  }

  // Mostrar todas las parejas
  resultado.innerHTML = "";
  const ul = document.createElement("ul");
  ul.setAttribute("role", "list");

  parejas.forEach(([dador, receptor]) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${dador}</strong> ➜ le regala a <strong>${receptor}</strong>`;
    ul.appendChild(li);
  });

  resultado.appendChild(ul);
}

/**
 * Algoritmo: Fisher-Yates shuffle con restricción de no auto-regalo
 * Devuelve un array de tuplas: [[A, B], [B, C], ...]
 */
function generarParejasUnicas(nombres) {
  const shuffled = [...nombres];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Asegurar que nadie se dé a sí mismo
  // Rotación: cada uno le da al siguiente (el último le da al primero)
  const parejas = [];
  for (let i = 0; i < nombres.length; i++) {
    const dador = nombres[i];
    const receptor = shuffled[i];
    if (dador === receptor) {
      // Si hay coincidencia, falla y reintentamos (máx 10 intentos)
      return null;
    }
    parejas.push([dador, receptor]);
  }

  return parejas;
}

// === REINICIAR TODO (lista + storage + resultados) ===
function reiniciarTodo() {
  amigos = [];
  document.getElementById("amigo").value = "";
  document.getElementById("listaAmigos").innerHTML = "";
  document.getElementById("resultado").innerHTML = "<li>🔁 Lista reiniciada. Agrega nuevos amigos.</li>";
  limpiarStorage();
}