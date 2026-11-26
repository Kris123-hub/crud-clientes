const API_URL = '/api/clientes.php';

const tabla = document.querySelector('#tabla-clientes tbody');
const form = document.getElementById('form-cliente');
const mensaje = document.getElementById('form-mensaje');

async function listarClientes() {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (!json.ok) return;

    tabla.innerHTML = '';
    for (const c of json.data) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>`;
        const [nombre, email, telefono, ciudad, creado] = [
            c.nombre, c.email, c.telefono ?? '', c.ciudad ?? '', c.creado_en
        ];
        tr.children[1].textContent = nombre;
        tr.children[2].textContent = email;
        tr.children[3].textContent = telefono;
        tr.children[4].textContent = ciudad;
        tr.children[5].textContent = creado;
        tabla.appendChild(tr);
    }
}

async function crearCliente(evento) {
    evento.preventDefault();
    mensaje.textContent = '';

    const payload = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        ciudad: document.getElementById('ciudad').value,
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.ok) {
        form.reset();
        mensaje.textContent = 'Cliente creado correctamente.';
        mensaje.className = 'mensaje ok';
        await listarClientes();
    } else {
        mensaje.textContent = json.error;
        mensaje.className = 'mensaje error';
    }
}

form.addEventListener('submit', crearCliente);
listarClientes();
