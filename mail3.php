<?php
// ─── mail3.php ──────────────────────────────────────────────────────────────
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1) Sólo POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit;
}

// 2) Log de depuración
file_put_contents(__DIR__ . '/debug_chat.log', print_r($_POST, true), FILE_APPEND);

// 3) Datos comunes
$type  = $_POST["form_type"] ?? "";
$name  = strip_tags(trim($_POST["name"]  ?? ""));
$email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);

// 4) Monta asunto y cuerpo según tipo
$to      = "juanpablojpw@gmail.com";
$subject = "";
$body    = "";

if ($type === "chat_widget") {
    $subject = "Nuevo mensaje desde el chat";
    $msg     = strip_tags(trim($_POST["message"] ?? ""));
    $body    = "Name: $name\nEmail: $email\nMessage: $msg\n";

} elseif ($type === "personal_offer") {
    $subject = "New Personal Offer Request";
    $company = strip_tags(trim($_POST["company"] ?? ""));
    $body    = "Name: $name\nEmail: $email\nCompany: $company\n";

} else {
    // cualquier otro formulario
    $subject = "Otro formulario recibido";
    $msg     = strip_tags(trim($_POST["message"] ?? ""));
    $body    = "Name: $name\nEmail: $email\nMessage: $msg\n";
}

// 5) Envío
$headers  = "From: infor@impactrenderstudio.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$success = mail($to, $subject, $body, $headers);

// 6) Respuesta JSON limpia
header('Content-Type: application/json');
echo json_encode(['success' => $success]);
exit;
