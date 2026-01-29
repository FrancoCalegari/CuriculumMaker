# CV Maker PWA

Progressive Web App para crear currículums profesionales con exportación a PDF.

## 🚀 Características

- ✅ Creación de CV interactivo
- ✅ Vista previa en tiempo real con diseño split-view
- ✅ Exportación a PDF profesional
- ✅ Foto de perfil con estilos personalizables
- ✅ Color de acento personalizable
- ✅ Importar/Exportar datos en JSON
- ✅ Guardado automático (localStorage)
- ✅ Funciona offline (PWA)
- ✅ Diseño responsive

## 📦 Requisitos

- Node.js 16+
- npm o yarn

## 🛠️ Instalación Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Vercel

### Opción 1: Desde la Terminal

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Desplegar
vercel
```

### Opción 2: Desde GitHub

1. Sube tu código a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en "Import Project"
4. Selecciona tu repositorio
5. Vercel detectará automáticamente la configuración
6. Haz clic en "Deploy"

### Configuración de Vercel

El archivo `vercel.json` ya está configurado con:

- Soporte para funciones serverless (API de generación de PDF)
- Servir archivos estáticos desde `/public`
- Puppeteer compatible con Vercel usando `@sparticuz/chromium`

### Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias

## 📁 Estructura del Proyecto

```
CuriculumMaker/
├── public/
│   ├── index.html           # Landing page
│   ├── tool.html            # Herramienta de creación de CV
│   ├── css/
│   │   ├── styles.css       # Estilos globales
│   │   └── tool.css         # Estilos del tool
│   ├── js/
│   │   └── app.js           # Lógica principal
│   ├── icons/               # Iconos PWA
│   ├── manifest.json        # PWA Manifest
│   └── sw.js               # Service Worker
├── server.js               # Servidor Express + API PDF
├── vercel.json             # Configuración de Vercel
└── package.json            # Dependencias

## 🔧 Tecnologías Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- PWA (Progressive Web App)
- Service Workers para funcionalidad offline

### Backend
- Node.js
- Express.js
- Puppeteer / Puppeteer-core (generación de PDF)
- @sparticuz/chromium (para Vercel)

## 📝 Uso

1. **Landing Page**: Información sobre la aplicación
2. **Crear CV**: Click en "Crear mi CV ahora"
3. **Completar Formulario**: Llena tus datos personales, experiencia, educación, etc.
4. **Personalizar**:
   - Sube una foto de perfil
   - Ajusta el border-radius de la foto
   - Selecciona el color de acento
5. **Vista Previa**: Observa los cambios en tiempo real
6. **Exportar**:
   - Genera PDF
   - Exporta datos a JSON
7. **Importar**: Carga datos previamente exportados

## 🐛 Solución de Problemas

### Error en Vercel: "Cannot GET /"

Si ves este error después de desplegar:
1. Verifica que `vercel.json` existe en la raíz
2. Asegúrate de que todos los archivos estén en el repositorio
3. Verifica los logs de despliegue en Vercel

### Error de Puppeteer en Vercel

El proyecto usa `@sparticuz/chromium` que es compatible con Vercel. Si hay errores:
1. Verifica que las dependencias estén instaladas
2. Revisa los logs de la función serverless en Vercel

### PDF no se genera

- En local: Asegúrate de haber ejecutado `npm install`
- En Vercel: Revisa los logs de la función `/api/generate-pdf`

## 📄 Licencia

MIT

## 👤 Autor

Franco Calegari
```
