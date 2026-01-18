const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

// Cargar variables de entorno desde .env
function loadEnv() {
  const envPath = path.join(__dirname, "api", ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
  }
}

loadEnv();

const PORT = 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
};

// Función para hacer request a OpenAI
function callOpenAI(data, callback) {
  const postData = JSON.stringify(data);

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      callback(null, {
        statusCode: res.statusCode,
        data: responseData,
      });
    });
  });

  req.on("error", (error) => {
    callback(error);
  });

  req.write(postData);
  req.end();
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle ChatGPT API proxy
  if (req.url === "/api/chat.php" && req.method === "POST") {
    if (!OPENAI_API_KEY) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "API key no configurada" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const requestData = JSON.parse(body);

        if (!requestData.messages) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Mensajes no proporcionados" }));
          return;
        }

        const openAIData = {
          model: requestData.model || "gpt-3.5-turbo",
          messages: requestData.messages,
          temperature: requestData.temperature || 0.7,
          max_tokens: requestData.max_tokens || 300,
        };

        callOpenAI(openAIData, (error, response) => {
          if (error) {
            console.error("Error calling OpenAI:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: "Error de conexión: " + error.message })
            );
            return;
          }

          res.writeHead(response.statusCode, {
            "Content-Type": "application/json",
          });
          res.end(response.data);
        });
      } catch (error) {
        console.error("Error parsing request:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = "." + req.url.split("?")[0];
  if (filePath === "./") {
    filePath = "./index.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Archivo no encontrado</h1>", "utf-8");
      } else {
        res.writeHead(500);
        res.end("Error del servidor: " + error.code);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
  console.log(
    `🤖 API ChatGPT: ${OPENAI_API_KEY ? "✅ Configurada" : "❌ No configurada"}`
  );
  console.log(`\nPresiona Ctrl+C para detener el servidor\n`);
});
