<?php
// Configuración de seguridad
header('Content-Type: application/json');

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Obtener datos del formulario
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

// Validar campos requeridos
if (empty($nombre) || empty($email) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos requeridos']);
    exit();
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit();
}

// ========================================
// GUARDAR CONTACTO EN ARCHIVO CSV
// ========================================
function guardarContacto($nombre, $email, $telefono, $mensaje)
{
    $archivo = __DIR__ . '/contactos.csv';

    // Crear archivo con encabezados si no existe
    if (!file_exists($archivo)) {
        $fp = fopen($archivo, 'w');
        fputcsv($fp, ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Mensaje']);
        fclose($fp);
    }

    // Preparar datos (limpiar saltos de línea del mensaje)
    $datos = [
        date('Y-m-d H:i:s'),
        $nombre,
        $email,
        $telefono,
        str_replace(["\r", "\n"], ' ', $mensaje)
    ];

    // Guardar en CSV
    $fp = fopen($archivo, 'a');
    fputcsv($fp, $datos);
    fclose($fp);

    // Asegurar permisos restrictivos
    chmod($archivo, 0600);
}

// ========================================
// GENERAR EMAIL HTML PROFESIONAL
// ========================================
function generarEmailHTML($nombre, $email, $telefono, $mensaje)
{
    return '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #22d3ee, #fbbf24); padding: 40px 30px; text-align: center; }
        .header h1 { color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .field { margin-bottom: 24px; border-left: 3px solid #22d3ee; padding-left: 16px; }
        .label { font-weight: 600; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .value { color: #4b5563; margin-top: 6px; font-size: 16px; line-height: 1.6; }
        .footer { background: #0f172a; color: #9ca3af; padding: 24px 30px; text-align: center; font-size: 13px; }
        .footer a { color: #22d3ee; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nuevo Contacto - Digitalencia</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">👤 Nombre</div>
                <div class="value">' . htmlspecialchars($nombre) . '</div>
            </div>
            <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #22d3ee; text-decoration: none;">' . htmlspecialchars($email) . '</a></div>
            </div>
            <div class="field">
                <div class="label">📱 Teléfono</div>
                <div class="value">' . ($telefono ? '<a href="tel:' . htmlspecialchars($telefono) . '" style="color: #22d3ee; text-decoration: none;">' . htmlspecialchars($telefono) . '</a>' : 'No proporcionado') . '</div>
            </div>
            <div class="field">
                <div class="label">💬 Mensaje</div>
                <div class="value">' . nl2br(htmlspecialchars($mensaje)) . '</div>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0 0 8px 0;">Enviado el ' . date('d/m/Y H:i:s') . '</p>
            <p style="margin: 0;"><a href="https://digitalencia.es">digitalencia.es</a></p>
        </div>
    </div>
</body>
</html>';
}

// ========================================
// GUARDAR CONTACTO
// ========================================
try {
    guardarContacto($nombre, $email, $telefono, $mensaje);
} catch (Exception $e) {
    // Log error pero continuar con el envío del email
    error_log('Error al guardar contacto: ' . $e->getMessage());
}

// ========================================
// CONFIGURACIÓN DEL EMAIL (MEJORADA PARA EVITAR SPAM)
// ========================================
$destinatario = 'info@digitalencia.es';
$asunto = 'Nuevo contacto desde digitalencia.es';

// Generar HTML del email
$cuerpoHTML = generarEmailHTML($nombre, $email, $telefono, $mensaje);

// Headers mejorados para evitar SPAM
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Digitalencia <info@digitalencia.es>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Return-Path: info@digitalencia.es\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 3\r\n";
$headers .= "Importance: Normal\r\n";

// Parámetros adicionales para mail()
$parametros = "-f info@digitalencia.es";

// Enviar email
if (mail($destinatario, $asunto, $cuerpoHTML, $headers, $parametros)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '¡Mensaje enviado con éxito! Te responderemos pronto.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al enviar el mensaje. Por favor intenta de nuevo o contáctanos por WhatsApp.'
    ]);
}
?>