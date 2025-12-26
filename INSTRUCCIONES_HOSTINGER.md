# Instrucciones para subir a Hostinger

## 📂 Archivos a subir

Sube estos archivos a tu carpeta `public_html/dev/` en Hostinger:

### 1. Carpeta `api/` (NUEVA)
Crea esta carpeta y sube estos 3 archivos:

- **`api/chat.php`** - Endpoint del backend
- **`api/.env`** - Tu API key (protegida)
- **`api/.htaccess`** - Protección de seguridad

### 2. Actualizar archivos existentes

- **`js/script.js`** - Versión actualizada que usa el backend

## 🔒 Configuración de seguridad

### Paso 1: Editar CORS en `api/chat.php`

Abre `api/chat.php` y cambia la línea 2:

```php
// Cambiar esta línea:
header('Access-Control-Allow-Origin: *');

// Por esta (con tu subdominio real):
header('Access-Control-Allow-Origin: https://dev.tudominio.com');
```

### Paso 2: Verificar permisos del archivo `.env`

Asegúrate de que el archivo `.env` tenga permisos **600** (solo lectura para el propietario):

1. En el administrador de archivos de Hostinger
2. Click derecho en `api/.env`
3. Permisos → 600

## ✅ Verificación

Después de subir todo:

1. **Prueba el chatbot** en tu web
2. **Verifica que el archivo `.env` NO sea accesible**:
   - Intenta acceder a: `https://dev.tudominio.com/api/.env`
   - Deberías ver "403 Forbidden" ✅

## 📁 Estructura final en Hostinger

```
public_html/dev/
├── api/
│   ├── chat.php          ✅ Endpoint
│   ├── .env              ✅ API key protegida
│   └── .htaccess         ✅ Seguridad
├── css/
│   └── styles.css
├── images/
├── js/
│   └── script.js         ✅ Actualizado
└── index.html
```

## 🚨 Importante

- **NO subas** archivos temporales (extract.js, create_index.js, etc.)
- **SOLO sube** los archivos de la carpeta `api/` y el `js/script.js` actualizado
- **Mantén** el archivo original `Web Digitalencia Prueba01.html` como respaldo local (no lo subas)
