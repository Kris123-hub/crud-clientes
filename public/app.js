const API_URL = '/api/clientes.php';

const tabla = document.querySelector('#tabla-clientes tbody');
const form = document.getElementById('form-cliente');
const mensaje = document.getElementById('form-mensaje');
const tituloForm = document.getElementById('titulo-form');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

let idEnEdicion = null;

function campos() {
    return {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        ciudad: document.getElementById('ciudad').value,
    };
}

function setCampoError(campo, text) {
    const err = document.getElementById('err-' + campo);
    const input = document.getElementById(campo);
    err.textContent = text || '';
    input.classList.toggle('invalido', Boolean(text));
}

function limpiarErrores() {
    ['nombre', 'email', 'telefono', 'ciudad'].forEach(c => setCampoError(c, ''));
}

function validacionLocal(data) {
    limpiarErrores();
    let ok = true;

    if (!data.nombre.trim()) {
        setCampoError('nombre', 'El nombre es obligatorio.');
        ok = false;
    } else if (data.nombre.trim().length > 100) {
        setCampoError('nombre', 'El nombre no puede superar los 100 caracteres.');
        ok = false;
    }

    const email = data.email.trim();
    if (!email) {
        setCampoError('email', 'El email es obligatorio.');
        ok = false;
    } else if (email.length > 150) {
        setCampoError('email', 'El email no puede superar los 150 caracteres.');
        ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setCampoError('email', 'El email no es válido.');
        ok = false;
    }

    if (data.telefono.trim().length > 20) {
        setCampoError('telefono', 'El teléfono no puede superar los 20 caracteres.');
        ok = false;
    }

    if (data.ciudad.trim().length > 100) {
        setCampoError('ciudad', 'La ciudad no puede superar los 100 caracteres.');
        ok = false;
    }

    return ok;
}

function mostrarErroresServidor(error) {
    if (typeof error === 'string') {
        mensaje.textContent = error;
        mensaje.className = 'mensaje error';
        return;
    }

    limpiarErrores();
    for (const campo of Object.keys(error)) {
        setCampoError(campo, error[campo]);
    }
    mensaje.textContent = 'Revisa los campos marcados.';
    mensaje.className = 'mensaje error';
}

function formatFecha(value) {
    if (!value) return '';
    // MySQL returns dates as "YYYY-MM-DD HH:MM:SS". The space separator is
    // not ISO 8601 and browsers like Safari fail to parse it (Invalid Date).
    const d = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) {
        return value;
    }
    return d.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

async function listarClientes() {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (!json.ok) return;

    tabla.innerHTML = '';
    for (const c of json.data) {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = c.id;

        const tdNombre = document.createElement('td');
        tdNombre.textContent = c.nombre;

        const tdEmail = document.createElement('td');
        tdEmail.textContent = c.email;

        const tdTel = document.createElement('td');
        tdTel.textContent = c.telefono ?? '';

        const tdCiudad = document.createElement('td');
        tdCiudad.textContent = c.ciudad ?? '';

        const tdFecha = document.createElement('td');
        tdFecha.textContent = formatFecha(c.creado_en);

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'acciones';

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn-sm btn-outline';
        btnEditar.addEventListener('click', () => editarCliente(c));

        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = 'Eliminar';
        btnBorrar.className = 'btn btn-sm btn-danger';
        btnBorrar.addEventListener('click', () => eliminarCliente(c.id));

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnBorrar);

        [tdId, tdNombre, tdEmail, tdTel, tdCiudad, tdFecha, tdAcciones].forEach(td => tr.appendChild(td));
        tabla.appendChild(tr);
    }
}

function resetForm() {
    idEnEdicion = null;
    form.reset();
    limpiarErrores();
    tituloForm.textContent = 'Nuevo cliente';
    btnGuardar.textContent = 'Crear cliente';
    btnCancelar.classList.add('hidden');
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
}

function editarCliente(c) {
    idEnEdicion = c.id;
    document.getElementById('nombre').value = c.nombre ?? '';
    document.getElementById('email').value = c.email ?? '';
    document.getElementById('telefono').value = c.telefono ?? '';
    document.getElementById('ciudad').value = c.ciudad ?? '';
    tituloForm.textContent = 'Editando cliente #' + c.id;
    btnGuardar.textContent = 'Guardar cambios';
    btnCancelar.classList.remove('hidden');
    limpiarErrores();
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
}

async function guardarCliente(evento) {
    evento.preventDefault();
    mensaje.textContent = '';

    const payload = campos();
    if (!validacionLocal(payload)) {
        return;
    }

    let res;

    if (idEnEdicion === null) {
        res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } else {
        res = await fetch(API_URL + '?id=' + idEnEdicion, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    }

    const json = await res.json();

    if (json.ok) {
        resetForm();
        mensaje.textContent = idEnEdicion === null ? 'Cliente creado correctamente.' : 'Cliente actualizado.';
        mensaje.className = 'mensaje ok';
        await listarClientes();
    } else {
        mostrarErroresServidor(json.error);
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Eliminar el cliente #' + id + '? Esta acción no se puede deshacer.')) {
        return;
    }

    const res = await fetch(API_URL + '?id=' + id, { method: 'DELETE' });
    const json = await res.json();

    if (json.ok) {
        mensaje.textContent = 'Cliente #' + id + ' eliminado.';
        mensaje.className = 'mensaje ok';
        if (idEnEdicion === id) resetForm();
        await listarClientes();
    } else {
        mensaje.textContent = json.error;
        mensaje.className = 'mensaje error';
    }
}

form.addEventListener('submit', guardarCliente);
btnCancelar.addEventListener('click', resetForm);
listarClientes();
