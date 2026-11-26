<?php
/**
 * REST API for customers.
 *
 *   GET    clientes.php          -> list all customers
 *   GET    clientes.php?id=N     -> get one customer
 *   POST   clientes.php          -> create a customer
 */

declare(strict_types=1);

require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

try {
    $pdo = get_pdo();

    switch ($method) {
        case 'GET':
            if ($id !== null) {
                $stmt = $pdo->prepare('SELECT * FROM clientes WHERE id = :id');
                $stmt->execute(['id' => $id]);
                $row = $stmt->fetch();
                if ($row === false) {
                    json_response(404, ['ok' => false, 'error' => 'Cliente no encontrado.']);
                }
                json_response(200, ['ok' => true, 'data' => $row]);
            }

            $rows = $pdo->query('SELECT * FROM clientes ORDER BY id ASC')->fetchAll();
            json_response(200, ['ok' => true, 'data' => $rows]);

        case 'POST':
            $body = read_json_body();

            $nombre = trim((string) ($body['nombre'] ?? ''));
            $email = trim((string) ($body['email'] ?? ''));
            $telefono = trim((string) ($body['telefono'] ?? ''));
            $ciudad = trim((string) ($body['ciudad'] ?? ''));

            if ($nombre === '' || $email === '') {
                json_response(400, ['ok' => false, 'error' => 'Los campos nombre y email son obligatorios.']);
            }

            $stmt = $pdo->prepare(
                'INSERT INTO clientes (nombre, email, telefono, ciudad)
                 VALUES (:nombre, :email, :telefono, :ciudad)'
            );
            $stmt->execute([
                'nombre' => $nombre,
                'email' => $email,
                'telefono' => $telefono !== '' ? $telefono : null,
                'ciudad' => $ciudad !== '' ? $ciudad : null,
            ]);

            json_response(201, [
                'ok' => true,
                'data' => [
                    'id' => (int) $pdo->lastInsertId(),
                    'nombre' => $nombre,
                    'email' => $email,
                    'telefono' => $telefono !== '' ? $telefono : null,
                    'ciudad' => $ciudad !== '' ? $ciudad : null,
                ],
            ]);

        default:
            json_response(405, ['ok' => false, 'error' => 'Método no permitido.']);
    }
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        json_response(409, ['ok' => false, 'error' => 'El email ya está registrado.']);
    }
    json_response(500, ['ok' => false, 'error' => 'Error en la base de datos.']);
}
