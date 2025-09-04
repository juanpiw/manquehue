<?php
// landing.php

// Cargar las credenciales desde config.php
require_once __DIR__ . "/../config/config.php";
// O si lo tienes en la misma carpeta y no puedes ponerlo fuera:
// require_once __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = isset($_POST['nombre']) ? strip_tags(trim($_POST['nombre'])) : '';
    $correo = isset($_POST['correo']) ? filter_var(trim($_POST['correo']), FILTER_SANITIZE_EMAIL) : '';

    if (empty($nombre) || empty($correo)) {
        echo "ERROR";
        exit;
    }
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    // Usar las variables de config.php
    $conn = new mysqli($db_server, $db_username, $db_password, $db_name);
    if ($conn->connect_error) {
        echo "ERROR: " . $conn->connect_error;
        exit;
    }
    if (!$conn) {
        die("Error de conexión: " . mysqli_connect_error());
    } else {
        echo "Conexión exitosa"; // Prueba si esto aparece en el fetch
    }

    $stmt = $conn->prepare("INSERT INTO leads (nombre, correo) VALUES (?, ?)");
    $stmt->bind_param("ss", $nombre, $correo);

    $success = $stmt->execute();
    $stmt->close();
    $conn->close();

    if ($success) {
        echo "OK";
    } else {
        echo "ERROR";
    }
} else {
    echo "Método no válido";
}
