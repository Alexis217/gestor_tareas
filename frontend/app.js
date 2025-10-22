document.addEventListener("DOMContentLoaded", () => {
  // URL de la API. Nginx redirigirá /api/tasks al backend
  const API_URL = "/api/tasks";

  // --- Selectores del DOM ---
  const taskForm = document.getElementById("task-form");
  const taskContainer = document.getElementById("tasks-container");
  const statusMessage = document.getElementById("status-message");
  const tituloInput = document.getElementById("titulo");
  const descripcionInput = document.getElementById("descripcion");
  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-task-form");
  const btnCancelEdit = document.getElementById("btn-cancel-edit");
  const editTaskId = document.getElementById("edit-task-id");
  const editTitulo = document.getElementById("edit-titulo");
  const editDescripcion = document.getElementById("edit-descripcion");

  // --- Funciones de Estado ---
  const showStatus = (message, type = "loading") => {
    statusMessage.textContent = message;
    statusMessage.className = type; // 'loading' o 'error'
    statusMessage.style.display = "block";
  };

  const hideStatus = () => {
    statusMessage.style.display = "none";
  };

  // --- Renderizado de Tareas ---
  const renderTasks = (tasks) => {
    taskContainer.innerHTML = ""; // Limpiar la lista

    if (tasks.length === 0) {
      taskContainer.innerHTML = "<li>No hay tareas pendientes.</li>";
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.estado}`;
      li.dataset.id = task.id;

      const newStatus =
        task.estado === "pendiente" ? "completada" : "pendiente";
      const toggleButtonText =
        task.estado === "pendiente" ? "Completar" : "Reabrir";

      li.innerHTML = `
        <div class="task-info">
          <h3>${task.titulo}</h3>
          <p>${task.descripcion}</p>
        </div>
      <button class="btn-edit">Editar</button> 

      <button class="btn-toggle ${task.estado}" data-new-status="${newStatus}">
        ${toggleButtonText}
      </button>
      <button class="btn-delete">Eliminar</button>
    </div>
      `;
      taskContainer.appendChild(li);
    });
  };

  // --- Lógica de API (CRUD) ---

  // R (Read) - Obtener todas las tareas
  const fetchTasks = async () => {
    showStatus("Cargando tareas...");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const tasks = await response.json();
      renderTasks(tasks);
      hideStatus();
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      showStatus(`Error al cargar tareas: ${error.message}`, "error");
    }
  };

  // C (Create) - Crear una tarea
  const createTask = async (titulo, descripcion) => {
    showStatus("Creando tarea...");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      hideStatus();
      taskForm.reset(); // Limpiar el formulario
      await fetchTasks(); // Recargar la lista
    } catch (error) {
      console.error("Error al crear tarea:", error);
      showStatus(`Error al crear tarea: ${error.message}`, "error");
    }
  };

  // U (Update) - Actualizar estado de tarea
  const updateTaskStatus = async (id, newStatus) => {
    showStatus("Actualizando tarea...");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      hideStatus();
      await fetchTasks(); // Recargar la lista
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      showStatus(`Error al actualizar tarea: ${error.message}`, "error");
    }
  };

  // D (Delete) - Eliminar tarea
  const deleteTask = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }

    showStatus("Eliminando tarea...");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // El 204 No Content también es ok, pero fetch lo maneja bien
        throw new Error(`Error HTTP: ${response.status}`);
      }

      hideStatus();
      await fetchTasks(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      showStatus(`Error al eliminar tarea: ${error.message}`, "error");
    }
  };

  // --- Event Listeners ---

  // Listener para el formulario (C)
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (titulo && descripcion) {
      createTask(titulo, descripcion);
    } else {
      showStatus("Por favor, completa todos los campos.", "error");
    }
  });

  // Listeners para botones de la lista (U y D)
  // Usamos delegación de eventos
  taskContainer.addEventListener("click", (e) => {
    const target = e.target;
    const taskItem = target.closest(".task-item");

    if (!taskItem) return;

    const id = taskItem.dataset.id;

    // Click en botón "Completar/Reabrir" (U)
    if (target.classList.contains("btn-toggle")) {
      const newStatus = target.dataset.newStatus;
      updateTaskStatus(id, newStatus);
    }

    // Click en botón "Eliminar" (D)
    if (target.classList.contains("btn-delete")) {
      deleteTask(id);
    }
    if (target.classList.contains("btn-edit")) {
      // Obtenemos los textos actuales de la tarjeta
      const currentTitulo = taskItem.querySelector("h3").textContent;
      const currentDescripcion = taskItem.querySelector("p").textContent;
      // Abrimos el modal con esos datos
      openEditModal(id, currentTitulo, currentDescripcion);
    }
  });
  // --- Funciones del Modal de Edición (¡NUEVO!) ---

  /**
   * Abre el modal y rellena el formulario con los datos de la tarea.
   */
  function openEditModal(id, titulo, descripcion) {
    // Rellenamos el formulario
    editTaskId.value = id;
    editTitulo.value = titulo;
    editDescripcion.value = descripcion;

    // Mostramos el modal
    editModal.classList.add("visible");
  }

  /**
   * Cierra el modal y limpia el formulario.
   */
  function closeEditModal() {
    editModal.classList.remove("visible");
    editForm.reset(); // Limpia el formulario
  }

  /**
   * Manejador para el envío del formulario de edición.
   */
  async function handleEditSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue

    showStatus("Guardando cambios...");

    const id = editTaskId.value;
    const data = {
      titulo: editTitulo.value.trim(),
      descripcion: editDescripcion.value.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      closeEditModal();
      hideStatus();
      await fetchTasks(); // Recarga la lista de tareas
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      showStatus(`Error al guardar cambios: ${error.message}`, "error");
    }
  }

  // --- Event Listeners del Modal (¡NUEVO!) ---
  // (Añádelos dentro del 'DOMContentLoaded')

  editForm.addEventListener("submit", handleEditSubmit);
  btnCancelEdit.addEventListener("click", closeEditModal);

  // (Opcional) Cerrar el modal si se hace clic en el fondo
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      // Si el clic es en el fondo (backdrop)
      closeEditModal();
    }
  });

  // --- Carga Inicial ---
  fetchTasks();
});
