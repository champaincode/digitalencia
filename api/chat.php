<?php
// Permitir CORS desde tu subdominio
// Permitir CORS (Temporizado a * para evitar errores de dominio, luego puedes restringirlo)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Función para cargar variables de entorno desde .env
function loadEnv($path)
{
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Ignorar comentarios
        if (strpos(trim($line), '#') === 0)
            continue;

        // Separar nombre y valor
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Establecer variable de entorno
            if (!array_key_exists($name, $_ENV)) {
                putenv("$name=$value");
                $_ENV[$name] = $value;
            }
        }
    }
    return true;
}

// Cargar el archivo .env
loadEnv(__DIR__ . '/.env');

// Obtener la API key
$apiKey = getenv('OPENAI_API_KEY');

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'API key no configurada']);
    exit();
}

// Obtener datos del request
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['messages'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Mensajes no proporcionados']);
    exit();
}

// Preparar la llamada a OpenAI
$data = [
    'model' => $input['model'] ?? 'gpt-4o-mini',
    'messages' => $input['messages'],
    'temperature' => $input['temperature'] ?? 0.7,
    'max_tokens' => $input['max_tokens'] ?? 300
];

// --- INICIO LÓGICA DE BASE DE CONOCIMIENTO (KNOWLEDGE BASE) ---
$knowledgeDir = __DIR__ . '/../knowledge';
$knowledgeContent = "";

if (is_dir($knowledgeDir)) {
    $files = scandir($knowledgeDir);
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['md', 'txt', 'json'])) {
            $content = @file_get_contents($knowledgeDir . '/' . $file);
            if ($content !== false) {
                $knowledgeContent .= "\n\n--- INFORMACIÓN DE ARCHIVO: $file ---\n" . $content;
            }
        }
    }
}

if (!empty($knowledgeContent)) {
    $knowledgeInjected = false;
    // Buscar si ya existe un mensaje de sistema para adjuntar la info
    foreach ($data['messages'] as &$msg) {
        if ($msg['role'] === 'system') {
            $msg['content'] .= "\n\n BASE DE CONOCIMIENTO ADICIONAL:" . $knowledgeContent;
            $knowledgeInjected = true;
            break;
        }
    }
    // Si no hay mensaje de sistema, crear uno nuevo al principio
    if (!$knowledgeInjected) {
        array_unshift($data['messages'], [
            'role' => 'system',
            'content' => "BASE DE CONOCIMIENTO ADICIONAL:" . $knowledgeContent
        ]);
    }
}
// --- FIN LÓGICA DE BASE DE CONOCIMIENTO ---

// Hacer la llamada a OpenAI usando cURL
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Manejar errores de cURL
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión: ' . $curlError]);
    exit();
}

// Devolver la respuesta de OpenAI
http_response_code($httpCode);
echo $response;
?>