<?php
// Simple feedback receiver
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!$data) {
        // Fallback for form-encoded
        $data = $_POST;
    }

    $attractiveness = isset($data['attractiveness']) ? trim((string)$data['attractiveness']) : '';
    $sections = isset($data['sections']) ? (array)$data['sections'] : [];
    $contact = isset($data['contact']) ? trim((string)$data['contact']) : 'no';
    $name = isset($data['name']) ? trim((string)$data['name']) : '';
    $email = isset($data['email']) ? trim((string)$data['email']) : '';
    $comments = isset($data['comments']) ? trim((string)$data['comments']) : '';
    $lang = isset($data['lang']) ? trim((string)$data['lang']) : 'es';
    $page = isset($data['page']) ? trim((string)$data['page']) : 'unknown';

    // Basic validation
    if ($contact === 'yes' && empty($email)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'email_required']);
        exit;
    }

    // Save as a simple log file for now; You can replace with DB insert later
    $entry = [
        'ts' => date('c'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'attractiveness' => $attractiveness,
        'sections' => $sections,
        'contact' => $contact,
        'name' => $name,
        'email' => $email,
        'comments' => $comments,
        'lang' => $lang,
        'page' => $page,
    ];

    $dir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
    $file = $dir . DIRECTORY_SEPARATOR . 'feedback.log';
    @file_put_contents($file, json_encode($entry, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);

    // Optional: send notification email
    if ($contact === 'yes' && !empty($email)) {
        $to = 'info@manquehue.cl';
        $subject = 'New Feedback Lead';
        $body = "Name: {$name}\nEmail: {$email}\nInterest: " . implode(', ', $sections) . "\nComments: {$comments}\nPage: {$page}";
        @mail($to, $subject, $body, 'From: no-reply@impactrender.com');
    }

    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server_error']);
}
?>


