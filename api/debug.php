<?php
// api/debug.php
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Diagnóstico de Digitalencia (Hostinger)</h1>";

// 1. Verificación de permisos de carpeta
echo "<h2>1. Estructura y Permisos</h2>";
$apiDir = __DIR__;
$knowledgeDir = __DIR__ . '/../knowledge';

echo "Directorio API: " . $apiDir . "<br>";
echo "Directorio Knowledge: " . (is_dir($knowledgeDir) ? "✅ EXISTE" : "❌ NO ENCONTRADO ($knowledgeDir)") . "<br>";

// 2. Verificación del .env
echo "<h2>2. Archivo .env</h2>";
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    echo "✅ Archivo .env encontrado.<br>";
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $apiKeyFound = false;
    foreach ($lines as $line) {
        if (strpos(trim($line), 'OPENAI_API_KEY') === 0) {
            $apiKeyFound = true;
            $parts = explode('=', $line);
            $key = trim($parts[1] ?? '');
            echo "Format Key: " . (strlen($key) > 20 ? "✅ Parece válida (empieza por " . substr($key, 0, 7) . "...)" : "❌ Parece corta o vacía") . "<br>";
        }
    }
    if (!$apiKeyFound)
        echo "❌ No se encontró la línea OPENAI_API_KEY en el archivo.<br>";
} else {
    echo "❌ Archivo .env NO encontrado en $envPath<br>";
}

// 3. Verificación de cURL/OpenAI
echo "<h2>3. Conexión con OpenAI</h2>";
if (!function_exists('curl_init')) {
    echo "❌ CRÍTICO: cURL no está habilitado en este servidor PHP.<br>";
} else {
    echo "✅ cURL está habilitado.<br>";
}

// 4. Test de Lectura de Knowledge
echo "<h2>4. Base de Conocimiento</h2>";
if (is_dir($knowledgeDir)) {
    $files = scandir($knowledgeDir);
    $foundFiles = 0;
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['md', 'txt', 'json'])) {
            echo "📄 Archivo encontrado: $file - Tamaño: " . filesize($knowledgeDir . '/' . $file) . " bytes<br>";
            $foundFiles++;
        }
    }
    if ($foundFiles == 0)
        echo "⚠️ La carpeta existe pero no tiene archivos .md, .txt o .json válidos.<br>";
}

echo "<hr><p>Si todo sale en verde, intenta abrir el chat de nuevo. Si algo sale en rojo, esa es la causa.</p>";
?>