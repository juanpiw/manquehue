<?php
// Database configuration
$host = 'localhost';
$dbname = 'landing_db';
$username = 'root';
$password = '';

// Email configuration
$admin_email = 'info@manquehue.cl';
$subject = 'Nueva solicitud de landing para proyecto';

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if form was submitted
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nombre = $_POST['nombre'] ?? '';
        $correo = $_POST['correo'] ?? '';
        $tipo = $_POST['tipo'] ?? 'general';
        
        // Validate inputs
        if (empty($nombre) || empty($correo) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            echo "ERROR: Datos inválidos";
            exit;
        }
        
        // Insert into database
        $stmt = $pdo->prepare("INSERT INTO landing_requests (nombre, correo, tipo, fecha_creacion) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$nombre, $correo, $tipo]);
        
        // Send email notification
        $message = "Nueva solicitud recibida:\n\n";
        $message .= "Nombre: " . $nombre . "\n";
        $message .= "Email: " . $correo . "\n";
        $message .= "Tipo: " . $tipo . "\n";
        $message .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
        
        $headers = "From: noreply@manquehue.cl\r\n";
        $headers .= "Reply-To: " . $correo . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        mail($admin_email, $subject, $message, $headers);
        
        // Send confirmation email to user
        $user_subject = "Gracias por tu interés - Manquehue";
        $user_message = "Hola " . $nombre . ",\n\n";
        $user_message .= "Gracias por tu interés en nuestros servicios de landing interactiva.\n";
        $user_message .= "Nos pondremos en contacto contigo en las próximas 24 horas.\n\n";
        $user_message .= "Saludos,\n";
        $user_message .= "Equipo Manquehue";
        
        $user_headers = "From: " . $admin_email . "\r\n";
        $user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        mail($correo, $user_subject, $user_message, $user_headers);
        
        echo "OK";
    } else {
        echo "ERROR: Método no permitido";
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo "ERROR: Error de base de datos";
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo "ERROR: Error general";
}
?>
