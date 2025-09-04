<?php
// n8n-proxy.php - cURL-based proxy with better error handling

// 1) Config: target webhook
$baseWebhookUrl = 'https://impactrender.app.n8n.cloud/webhook/57a76c39-7ea3-4ce2-b5f5-41c6adf02c34/chat';

// 2) Determine language
$lang = isset($_GET['lang']) ? $_GET['lang'] : 'es';
$fullUrl = $baseWebhookUrl . '?lang=' . urlencode($lang);

// 3) Read body and headers
$postData = file_get_contents('php://input') ?: '';

// 4) Prepare headers to forward
$forwardHeaders = [
    'Content-Type: application/json',
    'X-Language: ' . $lang,
    'Accept-Language: ' . $lang,
];

// 5) Execute request with cURL
$ch = curl_init($fullUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$responseBody = curl_exec($ch);
$curlErrNo = curl_errno($ch);
$curlErr = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 6) Build response
header('Content-Type: application/json');
if ($curlErrNo !== 0) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Proxy request failed',
        'detail' => $curlErr,
    ]);
    exit;
}

if ($status >= 400) {
    http_response_code($status);
    echo $responseBody ?: json_encode(['error' => 'Upstream error', 'status' => $status]);
    exit;
}

http_response_code($status ?: 200);
echo $responseBody ?: json_encode(['ok' => true]);
?>


