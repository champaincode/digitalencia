# Digitalencia — Landing Page

Landing page oficial de **Digitalencia**: presencia web rápida, ligera y orientada a conversión (CTA), con soporte para recursos SEO (robots/sitemap), páginas legales y utilidades internas.

> Sitio: https://www.digitalencia.es

---

## 🎯 Objetivo

Ofrecer una **landing page profesional** para presentar Digitalencia (servicios, propuesta de valor, contacto/CTA) con un stack estático y mantenimiento simple.

---

## ✨ Características

- **Frontend estático** (HTML + CSS + JavaScript) sin build step.
- Estructura clara por carpetas (`css/`, `js/`, `images/`, `favicon/`).
- **SEO básico listo**: `robots.txt` y `sitemap.xml`.
- Página de **Política de Privacidad** (`privacidad.html`).
- Script de **integración** (`chatgpt-integration.js`) para funciones/UX relacionadas con IA (según configuración).
- Utilidad para generar recursos de vista previa social: `og-image-generator.html`.

---

## 🗂️ Estructura del proyecto

```text
/
├─ api/                    # Endpoints o funciones (si aplica: contacto, proxy IA, etc.)
├─ css/                    # Estilos
├─ js/                     # Scripts del sitio
├─ images/                 # Imágenes y recursos gráficos
├─ favicon/                # Favicon(s) y assets relacionados
├─ index.html              # Landing principal
├─ chatgpt-integration.js  # Integración/UX para IA (cliente)
├─ og-image-generator.html # Generador de imagen OG (utilidad)
├─ privacidad.html         # Política de Privacidad
├─ robots.txt              # Robots
└─ sitemap.xml             # Sitemap
