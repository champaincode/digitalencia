// Efecto futurista: Digitalencia / Valencia solo en el título + subrayado animado
(function () {
  const main = document.getElementById("brandMain");
  const brandTitle = document.querySelector(".brand-title");
  if (!main || !brandTitle) return;

  const words = ["Digitalencia", "Valencia"];
  let index = 0;

  function randomize(base) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return base
      .split("")
      .map((ch) => {
        if (ch === " ") return " ";
        return Math.random() < 0.5
          ? chars[Math.floor(Math.random() * chars.length)]
          : ch;
      })
      .join("");
  }

  function switchWord() {
    const next = words[(index + 1) % words.length];
    let steps = 0;
    main.classList.add("glitching");

    const interval = setInterval(() => {
      steps++;
      if (steps < 8) {
        const scrambled = randomize(next);
        main.textContent = scrambled;
      } else {
        clearInterval(interval);
        main.classList.remove("glitching");
        main.textContent = next;
        index = (index + 1) % words.length;
      }
    }, 90);
  }

  // Inicializamos el texto
  main.textContent = words[index];

  // Activamos el subrayado animado después de un breve delay
  setTimeout(() => {
    brandTitle.classList.add("underline-active");
  }, 400);

  setInterval(switchWord, 10000);
})();

// Animación de entrada de secciones al hacer scroll
(function () {
  const sections = document.querySelectorAll("section.section");
  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) {
    sections.forEach((sec) => sec.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 },
  );

  sections.forEach((sec) => observer.observe(sec));
})();

// Glassmorphism Navbar on Scroll
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let lastScroll = 0;
  const scrollThreshold = 50; // Pixels to scroll before activating effect

  function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > scrollThreshold) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once on load
  handleScroll();
})();

// Smooth Scroll for Navigation Links
(function () {
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only handle anchor links (starting with #)
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      
      // Special handling for "inicio" - scroll to top
      if (targetId === 'inicio') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // For other sections, scroll with offset for navbar
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const offset = navHeight + 20; // navbar height + some padding
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

// Efecto 3D interactivo en el panel del hero
(function () {
  const panel = document.getElementById("heroPanel");
  const glare = document.getElementById("heroGlare");
  if (!panel || !glare) return;

  const maxRotateX = 10; // grados
  const maxRotateY = 14; // grados

  function handleMove(e) {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width - 0.5; // -0.5 a 0.5
    const percentY = y / rect.height - 0.5; // -0.5 a 0.5

    const rotateY = percentX * maxRotateY * 2;
    const rotateX = -percentY * maxRotateX * 2;

    panel.style.transform =
      "rotateX(" +
      rotateX.toFixed(2) +
      "deg) rotateY(" +
      rotateY.toFixed(2) +
      "deg)";

    const glareX = (percentX * 40).toFixed(2);
    const glareY = (percentY * 40).toFixed(2);
    glare.style.opacity = 1;
    glare.style.transform =
      "translate3d(" + glareX + "px, " + glareY + "px, 60px)";
  }

  function resetPanel() {
    panel.style.transform = "rotateX(0deg) rotateY(0deg)";
    glare.style.opacity = 0;
    glare.style.transform = "translate3d(0, 0, 60px)";
  }

  panel.addEventListener("mousemove", handleMove);
  panel.addEventListener("mouseleave", resetPanel);
  panel.addEventListener("mouseenter", (e) => {
    handleMove(e);
  });
})();

// Rotación de frases en la nube del asistente
(function () {
  const el = document.getElementById("chatCalloutText");
  if (!el) return;
  const frases = [
    "¡Es ahora!",
    "Agenda tu cita",
    "Te guiamos hoy",
    "Digitaliza tu negocio",
  ];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % frases.length;
    el.textContent = frases[idx];
  }, 6000);
})();

// Agente conversacional básico en front
(function () {
  const launcher = document.getElementById("chatLauncher");
  const windowChat = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");

  function toggleChat() {
    windowChat.classList.toggle("open");
    if (windowChat.classList.contains("open")) {
      input.focus();
    }
  }

  if (launcher) launcher.addEventListener("click", toggleChat);
  if (closeBtn) closeBtn.addEventListener("click", toggleChat);

  function appendMessage(text, from = "bot") {
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message " + from;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = text;
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  // ============================================
  // CONFIGURACIÓN DE CHATGPT API
  // ============================================

  // 🔒 SEGURIDAD: La API key ahora está protegida en el backend
  // El chatbot llama a nuestro servidor PHP que maneja la API de OpenAI de forma segura

  // Configuración del modelo y endpoint
  const OPENAI_API_URL = "/api/chat.php"; // Nuestro backend PHP
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

SANTIAGO RODRÍGUEZ - Lider del proyecto
Digitalencia es un proyecto profesional creado y liderado por Santiago Rodríguez, cuya trayectoria se caracteriza por una integración poco común entre experiencia social, operativa, cultural, técnica y digital, desarrollada a lo largo de más de dos décadas en contextos reales de trabajo.
El agente debe comprender que no habla desde una formación teórica aislada, sino desde un recorrido vital y profesional continuo, donde cada etapa aporta criterio aplicado a la toma de decisiones actuales.

BASE FORMATIVA HISTÓRICA (URUGUAY)
Santiago Rodríguez se formó en Uruguay en instituciones públicas y técnicas, con una fuerte orientación práctica, comunitaria y de intervención real, no académica abstracta.
Es Técnico en Recreación Educativa y Técnico en Animación Sociocultural, egresado de UTU (Universidad del Trabajo del Uruguay), institución históricamente orientada a la formación técnica aplicada al mundo laboral. Dentro de esta formación cursó y aprobó disciplinas como Campamentos, Vida y Naturaleza, recreación comunitaria, animación cultural y planificación de actividades educativas y sociales.
Posteriormente cursó Gestión Cultural en la Facultad de Ciencias Económicas (Universidad de la República), en convenio con la Intendencia de Canelones, desarrollando prácticas reales de gestión, planificación y mediación cultural.
En ese marco creó y coordinó la escuela sin fines de lucro “Ubuntu”, dedicada a la investigación, promoción y transmisión del candombe uruguayo, trabajando durante años con escuelas públicas, rurales, movimientos sociales y comunidades, organizando actividades educativas, recreativas y culturales. Este proyecto dejó huella real y aún genera impacto en personas que participaron de él.
El agente debe entender que esta etapa no es “pasado”, sino base estructural del enfoque humano, pedagógico y comunitario que hoy se traslada al ámbito digital.

EXPERIENCIA LABORAL Y ORGANIZATIVA REAL
Durante más de quince años, Santiago trabajó en ONGs, proyectos sociales, instituciones del Estado y emprendimientos privados, desarrollando capacidades de:
Coordinación de equipos
Organización de actividades complejas
Gestión de recursos limitados
Resolución de conflictos
Comunicación con públicos diversos
Fue militante sindical y luchador gremial, participando activamente en negociaciones colectivas y firmando convenios salariales nacionales en Uruguay, incluso junto a abogados y autoridades ministeriales. Esto aporta al agente una comprensión profunda de estructuras laborales, derechos, obligaciones y marcos normativos.
Trabajó durante ocho años en la industria alimentaria, operando calderas y procesos productivos, lo que añade una comprensión técnica del trabajo industrial, la seguridad, la responsabilidad operativa y el cumplimiento de normas.

TRANSICIÓN A HOSTELERÍA Y REALIDAD EUROPEA (ESPAÑA)
Tras emigrar a España, Santiago se inserta laboralmente en hostelería, trabajando actualmente en una pizzería franquiciada en Playa de Gandía, con contrato indefinido. Participa activamente no solo en la producción, sino en la proyección de expansión del negocio, con una futura responsabilidad en recursos humanos de la franquicia.
El agente debe entender que esta experiencia no es anecdótica: es clave para comprender el día a día de la hostelería española, sus ritmos, inspecciones, márgenes, presión horaria, normativa sanitaria y fiscal.

ESPECIALIZACIÓN DIGITAL Y FORMACIÓN ACTUAL (ESPAÑA)
En paralelo, Santiago desarrolla una especialización progresiva y continua en digitalización de PYMEs, combinando autoformación técnica con formaciones oficiales del Gobierno de España, entre ellas:
Marketing Directivo
Fidelización de Clientes
Marketing en Redes Sociales
Gestión Fiscal de Empresas
Digitalización de PYMEs 4.0
Diseño web para hostelería
Detección y gestión de alérgenos (certificado oficial con calificación máxima)
A esto se suma una experiencia práctica en:
Automatización con Google Sheets, Apps Script, AppSheet, n8n
Sistemas de facturación y cumplimiento fiscal
CRM adaptados a pequeños negocios
Cartas digitales con QR y actualización en tiempo real
Uso aplicado de inteligencia artificial como apoyo a la gestión

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
- Email: info@digitalencia.es
- WhatsApp: +34 627 638 884 (https://wa.me/34627638884)
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
- Si preguntan por el equipo, habla SOLO de Santiago Rodríguez, destacando su perfil único que mezcla experiencia social, cultural, técnica y operativa real.
- Si preguntan por la zona de servicio, menciona desde Valencia hasta Alicante
- Si preguntan por hosting, destaca el lanzamiento de enero 2026 con condiciones especiales

IMPORTANTE: Si el usuario quiere agendar cita:
- Indícale que puede hacerlo en la sección de "Agenda" de la web.
- O facilita el enlace directo si lo solicitan.`;

  // Inicializar historial con el prompt del sistema
  function initializeConversation() {
    conversationHistory = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];
  }
  // Llamar al backend PHP que maneja ChatGPT de forma segura
  async function getBotReply(userMessage) {
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
      // Llamar a nuestro backend PHP (no necesita API key aquí)
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `API Error: ${response.status} - ${errorData.error?.message || response.statusText}`,
        );
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
      console.error("Error al llamar al chatbot:", error);

      // Respuesta de respaldo en caso de error
      return `😔 Disculpa, tengo problemas técnicos en este momento.<br><br>
      Puedes contactarnos directamente:<br>
      • <a href="https://wa.me/34627638884" target="_blank"><strong>WhatsApp</strong></a><br>
      • <a href="#agenda">📅 Ir a la Agenda</a><br>
      • Email: <strong>info@digitalencia.es</strong>`;
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
      let reply = await getBotReply(text);

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
        `😔 Hubo un error. Por favor intenta de nuevo o contáctanos por <a href="https://wa.me/34627638884" target="_blank">WhatsApp</a>.`,
        "bot",
      );
    }
  }

  // Inicializar conversación al cargar
  initializeConversation();

  if (sendBtn) sendBtn.addEventListener("click", handleSend);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    });
  }
})();
// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });

  // Close menu when clicking anywhere inside it (links or empty space)
  mobileMenu.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    }
  });
}

// Contact Form Handler
(function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    // Hide previous messages
    formStatus.className = "form-status";
    formStatus.textContent = "";

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        formStatus.className = "form-status success show";
        formStatus.innerHTML = "✅ " + data.message;
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.className = "form-status";
        }, 5000);
      } else {
        // Error from server
        formStatus.className = "form-status error show";
        formStatus.innerHTML =
          "❌ " +
          (data.message ||
            'Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo o contáctanos por <a href="https://wa.me/34627638884" target="_blank" style="color: #fca5a5; text-decoration: underline;">WhatsApp</a>.');
      }
    } catch (error) {
      // Network error
      console.error("Error:", error);
      formStatus.className = "form-status error show";
      formStatus.innerHTML =
        '❌ Error de conexión. Por favor, verifica tu internet e intenta de nuevo o contáctanos por <a href="https://wa.me/34627638884" target="_blank" style="color: #fca5a5; text-decoration: underline;">WhatsApp</a>.';
    } finally {
      // Re-enable button and remove loading state
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
})();

// ========================================
// GESTI�N DE COOKIES RGPD
// ========================================

(function () {
  const COOKIE_NAME = "digitalencia_cookies_accepted";
  const COOKIE_EXPIRY_DAYS = 365;

  // Verificar si ya se aceptaron las cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Establecer cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `=${value};${expires};path=/;SameSite=Lax`;
  }

  // Mostrar banner si no se ha aceptado
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  if (!cookieBanner || !acceptBtn || !rejectBtn) return;

  if (!getCookie(COOKIE_NAME)) {
    // Mostrar banner despu�s de un peque�o delay
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1000);
  }

  // Aceptar cookies
  acceptBtn.addEventListener("click", () => {
    setCookie(COOKIE_NAME, "accepted", COOKIE_EXPIRY_DAYS);
    cookieBanner.classList.remove("show");
    console.log("Cookies aceptadas");
  });

  // Rechazar cookies
  rejectBtn.addEventListener("click", () => {
    setCookie(COOKIE_NAME, "rejected", COOKIE_EXPIRY_DAYS);
    cookieBanner.classList.remove("show");
    console.log("Cookies rechazadas");
  });
})();

// ========================================
// ACTUALIZACIÃ“N AUTOMÃTICA DEL AÃ‘O (Copyright)
// ========================================
(function() {
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();

// ========================================
// PRELOADER
// ========================================
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        // Esperar 0.3 segundos para visualización óptima
        setTimeout(() => {
            preloader.classList.add("fade-out");
            // Remover del DOM después del fade-out
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 300);
    }
});
