// ============================================
// CONFIGURACIÓN DE CHATGPT API
// ============================================

// 🔑 IMPORTANTE: Pega tu clave API de OpenAI aquí
// Obtén tu clave en: https://platform.openai.com/api-keys
const OPENAI_API_KEY = "TU_CLAVE_API_AQUI"; // ⚠️ IMPORTANTE: Reemplaza esto con tu API key de OpenAI

// Configuración del modelo y endpoint
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";

// Historial de conversación (mantiene contexto)
let conversationHistory = [];

// Prompt del sistema - Define el comportamiento del bot
const SYSTEM_PROMPT = `Eres el asistente virtual de Digitalencia, una empresa de servicios digitales dedicada a la digitalización y automatización de pequeñas y medianas empresas, con enfoque en hostelería y comercio.

SOBRE DIGITALENCIA:
Digitalencia acompaña a negocios en su transformación digital con un servicio cercano y en lenguaje claro. Permitimos a los negocios delegar la parte técnica de su presencia online y ganar eficiencia mediante automatizaciones simples y herramientas de inteligencia artificial.

UBICACIÓN Y ALCANCE:
- Base de operaciones: Playa de Gandía (Valencia)
- Zona de servicio: Desde Valencia hasta Alicante
- Especialización territorial: Comarca de la Safor y zonas turísticas con fuerte presencia de hostelería

PÚBLICO OBJETIVO:
Restaurantes, pizzerías, bares, cafeterías, hoteles, casas rurales y pequeños comercios. Principalmente negocios familiares o con equipos reducidos que necesitan soluciones comprensibles y prácticas.

SERVICIOS PRINCIPALES:
1. Diseño y rediseño de páginas web adaptadas a hostelería y comercio
2. Hosting y mantenimiento web gestionado (servicio prioritario)
3. Automatización de procesos (reservas, recordatorios, formularios, respuestas a clientes)
4. Diseño de listas de alérgenos, cartas de menú y cartas digitales con códigos QR
5. Diseño gráfico básico (cartas físicas, carteles, piezas para redes sociales)
6. Soluciones de IA (asistentes conversacionales, respuestas frecuentes)
7. Analítica y paneles de control

PAQUETES DE SERVICIOS:
- Inicio digital: Desde 50€/servicio
  • Landing page o web sencilla con contacto
  • Botón WhatsApp y formulario
  • Configuración básica de analítica
  • Diseño de cartas, alérgenos y códigos QR
  • 1 sesión online de revisión

- Pro automatización: Desde 100€/servicio
  • Todo el plan Inicio digital mejorado
  • Automatización de emails (confirmaciones, recordatorios)
  • Asistente para preguntas frecuentes
  • Panel básico de métricas

- Full IA & datos: A medida
  • Asistentes conversacionales avanzados
  • Integración con CRM, ERP o gestores
  • Paneles de control avanzados
  • Acompañamiento y formación al equipo

SERVICIO PRIORITARIO - HOSTING Y MANTENIMIENTO WEB:
Servicio pensado para negocios que necesitan tranquilidad sobre su web:
- Configuración de dominio y certificado SSL
- Copias de seguridad periódicas
- Actualizaciones esenciales del sistema
- Soporte cercano por WhatsApp o correo

LANZAMIENTO ENERO 2026:
Durante enero, los primeros negocios que contraten hosting disfrutarán de:
- Ventaja de lanzamiento en la cuota de mantenimiento
- Revisión inicial gratuita de la web actual
- Prioridad en la agenda para mejoras futuras

EQUIPO:
Digitalencia está formado por dos profesionales con perfiles complementarios:

SANTIAGO JOSÉ RODRÍGUEZ RODRÍGUEZ - Diseñador PTD (Producto Turístico Digital):
- Fecha de nacimiento: 29 diciembre 1982
- Ubicación: Calle Mallorca 10, piso 4, puerta 17, Gandía Playa, Valencia
- Email: surusuruguay@gmail.com
- Teléfono: 642 250 502

Formación académica:
• Primaria completa - Escuela Dr. Mateo Legnani Nº 140, Santa Lucía
• Secundaria completa - Liceo Santos Rabaquino Pacini
• Bachillerato completo, opción Derecho - Liceo Tomás Berreta
• Tecnicatura Terciaria: Técnico en Recreación (UTU, Uruguay)
• Equivalente a Grado Superior en Animación Sociocultural y Turismo
• Homologación en trámite en el Ministerio de Educación, Formación Profesional y Deporte de España

Cursos y especializaciones:
• Introducción a la Informática y Ofimática Avanzada - Valencia, Fondo Social Europeo (2008-2009)
• Unidad de Animación Sociocultural - Comuna Canaria, primer nivel (2009)
• Unidad de Animación Sociocultural - Comuna Canaria, segundo nivel (2011)
• Seminario "Aprendizaje basado en Juego" (2020)
• Formación: Creación, Diseño y Experimentación en Juego - Laboratorio de Juegos E-Learning (2021)
• Especialización en Gestión Cultural - Universidad de Ciencias Económicas de Uruguay (2023)
• Habilitar Digitalización de Empresas 4.0 - EOI, Certificaciones Google (2024)
• Organización y Creación de Eventos (2025)
• Generación Digital PYMEs: PTD, Automatizaciones, IA y Análisis de Datos (2025)
• Marketing Digital y Redes Sociales (2025)

Habilidades:
• Animación cultural y turística
• Gestión de proyectos
• Creatividad y liderazgo
• Atención al cliente
• Herramientas digitales

Experiencia profesional y voluntariado:
• Animador Sociocultural voluntario - Dirección de Cultura, Comuna Canaria (2009-2011)
• Integrante del colectivo Ludomática - Santa Lucía (2010-2015)
• Voluntario colaborador - Centro La Mancha, festivales del Bicentenario en Canelones (2013)
• Práctica Profesional de la tecnicatura en Recreación de UTU (2020-2022)

EDGAR - Programador Web:
- Perfil técnico-creativo en maquetación, programación web y configuración de soluciones digitales
- Especializado en desarrollo web, automatizaciones y soluciones técnicas

Ambos aportan años de experiencia en los sectores de hostelería y comercio, lo que permite entender de primera mano el día a día de los negocios y traducirlo en soluciones digitales reales.

METODOLOGÍA DE TRABAJO (5 FASES):
1. Diagnóstico: Entrevistas y análisis de procesos
2. Diseño de solución: Acuerdo de prioridades y plan realista
3. Implementación: Trabajo técnico con comunicación frecuente
4. Formación: Explicación del funcionamiento de herramientas
5. Seguimiento: Evaluación periódica y ajustes

PROBLEMAS QUE RESOLVEMOS:
- Negocios sin web o con webs desactualizadas
- Falta de tiempo y conocimientos técnicos
- Procesos manuales que consumen tiempo (reservas, recordatorios)
- Incumplimiento de normativa sobre alérgenos
- Uso de redes sociales sin estrategia

CONTACTO:
- Email: info@digitalencia.com
- WhatsApp: +34 611 53 78 01 (https://wa.me/34611537801)
- Ubicación: Valencia, España

TU COMPORTAMIENTO:
- Sé amigable, profesional y conciso
- Responde SIEMPRE en español
- Usa la información detallada del proyecto para responder con precisión
- Cuando sea apropiado, sugiere agendar una cita vía Calendly
- Menciona que pueden contactar por WhatsApp
- Ofrece el diagnóstico inicial GRATIS sin compromiso
- Si preguntan por precios, menciona los rangos pero sugiere una llamada para presupuesto exacto
- Mantén las respuestas cortas (máximo 3-4 líneas cuando sea posible)
- Si preguntan por el equipo, menciona a Santiago José Rodríguez Rodríguez (Diseñador PTD) y Edgar (Programador Web)
- Si preguntan específicamente por Santiago, destaca:
  • Su formación como Técnico en Recreación y Animación Sociocultural y Turismo
  • Sus especializaciones en Digitalización de Empresas 4.0, Marketing Digital, IA y Automatizaciones
  • Su experiencia en gestión cultural, eventos y atención al cliente
  • Su ubicación en Gandía Playa, Valencia
  • Su perfil orientado al diseño de producto turístico digital (PTD)
- Si preguntan por Edgar, menciona su perfil técnico en programación web y soluciones digitales
- Si preguntan por la zona de servicio, menciona desde Valencia hasta Alicante
- Si preguntan por hosting, destaca el lanzamiento de enero 2026 con condiciones especiales

IMPORTANTE: Cuando menciones agendar cita, usa este formato HTML:
<button onclick='openCalendly()' style='background: linear-gradient(135deg, #22d3ee, #0f766e); color: #020617; border: none; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);'>📅 Agendar cita</button>`;

// Inicializar historial con el prompt del sistema
function initializeConversation() {
  conversationHistory = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];
}

// Llamar a la API de ChatGPT
async function getBotReply(userMessage) {
  // Verificar si la API key está configurada
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "TU_CLAVE_API_AQUI") {
    return `⚠️ El chatbot necesita configuración. Por favor:<br><br>
      • Contacta por <a href="https://wa.me/34611537801" target="_blank"><strong>WhatsApp</strong></a><br>
      • O <button onclick='openCalendly()' style='background: linear-gradient(135deg, #22d3ee, #0f766e); color: #020617; border: none; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);'>📅 Agenda una cita</button>`;
  }

  // Añadir mensaje del usuario al historial
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  // Limitar historial a últimos 20 mensajes (10 intercambios) + sistema
  if (conversationHistory.length > 21) {
    conversationHistory = [
      conversationHistory[0], // Mantener prompt del sistema
      ...conversationHistory.slice(-20), // Últimos 20 mensajes
    ];
  }

  try {
    // Llamar a la API de OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Añadir respuesta del bot al historial
    conversationHistory.push({
      role: "assistant",
      content: botMessage,
    });

    return botMessage;
  } catch (error) {
    console.error("Error al llamar a ChatGPT:", error);

    // Respuesta de respaldo en caso de error
    return `😔 Disculpa, tengo problemas técnicos en este momento.<br><br>
      Puedes contactarnos directamente:<br>
      • <a href="https://wa.me/34611537801" target="_blank"><strong>WhatsApp</strong></a><br>
      • <button onclick='openCalendly()' style='background: linear-gradient(135deg, #22d3ee, #0f766e); color: #020617; border: none; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);'>📅 Agendar cita</button><br>
      • Email: <strong>info@digitalencia.com</strong>`;
  }
}

async function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  // Crear indicador de escritura del bot
  const typingWrapper = document.createElement("div");
  typingWrapper.className = "chat-message bot typing";
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble";
  const typingInner = document.createElement("div");
  typingInner.className = "typing-indicator";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    typingInner.appendChild(dot);
  }
  typingBubble.appendChild(typingInner);
  typingWrapper.appendChild(typingBubble);
  messages.appendChild(typingWrapper);
  messages.scrollTop = messages.scrollHeight;

  try {
    // Llamar a la API (ahora es asíncrono)
    const reply = await getBotReply(text);

    // Eliminar indicador de escritura
    typingWrapper.remove();

    // Mostrar respuesta
    appendMessage(reply, "bot");
  } catch (error) {
    console.error("Error en handleSend:", error);

    // Eliminar indicador de escritura
    typingWrapper.remove();

    // Mostrar mensaje de error
    appendMessage(
      `😔 Hubo un error. Por favor intenta de nuevo o contáctanos por <a href="https://wa.me/34611537801" target="_blank">WhatsApp</a>.`,
      "bot"
    );
  }
}

// Inicializar conversación al cargar
initializeConversation();

///esto no
