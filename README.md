# PixFlow - Editor de Imágenes Online

![PixFlow](public/photo-dark.svg)

## Editor de imágenes web ligero y completo, construido con React 19 + TypeScript + Vite

[🌐 Demo en vivo](https://pixflow.andreifaur.dev) | [📖 Documentación](#-características) | [🚀 Inicio rápido](#-instalación)

---

## ✨ Características

### 📱 Progressive Web App (PWA)

- **💾 Instalable** - Añade a pantalla de inicio en iOS/Android
- **⚡ Offline** - Funciona sin conexión gracias al Service Worker
- **📲 Gestos táctiles** - Pinch-to-zoom, pan con un dedo
- **🎯 Optimizado para móvil** - Interfaz touch-friendly, botones de 44px mínimo
- **🖼️ Optimización automática** - Redimensiona imágenes grandes en dispositivos móviles
  - Móvil: máx. 1024×1024px, 2MB, JPEG 75%
  - Desktop: máx. 4096×4096px, 15MB, JPEG 92%

### Herramientas de Edición

- **✂️ Recorte** - Selección libre con vista previa en tiempo real (optimizado para iOS)
- **📏 Redimensionar** - Ajuste de dimensiones con bloqueo de aspecto
- **🔄 Transformar** - Rotación (90°, -90°, 180°) y volteo (H/V)
- **🎨 Ajustes** - Brillo, contraste y saturación con sliders
- **🖼️ Filtros rápidos** - Escala de grises, sepia, invertir

### Funcionalidades

- **⏪ Deshacer/Rehacer** - Historial completo de cambios con snapshots
- **🔍 Zoom y Pan** - Control preciso con rueda del ratón, pinch-to-zoom en móvil
- **💾 Exportación** - PNG, JPEG, WebP con ajuste de calidad
- **📱 Responsive** - Diseño adaptable con drawer móvil
- **🌙 Tema oscuro/claro** - Cambio visual con patrón de transparencia

### Atajos de Teclado (Desktop)

- `Cmd/Ctrl + Z` - Deshacer
- `Cmd/Ctrl + Shift + Z` - Rehacer
- `Cmd/Ctrl + +` - Aumentar zoom
- `Cmd/Ctrl + -` - Reducir zoom
- `Cmd/Ctrl + 0` - Ajustar a pantalla

### Gestos Táctiles (Móvil)

- **Pinch** - Zoom in/out con dos dedos
- **Pan** - Mover imagen con un dedo
- **Tap** - Seleccionar herramientas y botones
- **Botones 44px** - Todos los controles táctiles cumplen guidelines de iOS/Android

## 🚀 Instalación

### Requisitos previos

- Node.js 20+
- npm o yarn

### Clonar e instalar

```bash
# Clonar repositorio
git clone https://github.com/Bogdan-Andrei-Faur/PixFlow.git
cd PixFlow

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El editor estará disponible en `http://localhost:5173`

## 📲 Instalar como PWA

### iOS (Safari)

1. Abre https://pixflow.andreifaur.dev en Safari
2. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
3. Desplázate y toca "Añadir a pantalla de inicio"
4. Personaliza el nombre si lo deseas y toca "Añadir"
5. ¡Listo! Ahora puedes abrir PixFlow como una app nativa

### Android (Chrome)

1. Abre https://pixflow.andreifaur.dev en Chrome
2. Toca el menú (⋮) y selecciona "Añadir a pantalla de inicio"
3. Confirma en el diálogo que aparece
4. La app se instalará en tu launcher

### Desktop (Chrome/Edge)

1. Abre https://pixflow.andreifaur.dev
2. Mira el icono de instalación en la barra de direcciones
3. Haz clic en "Instalar"
4. La app se abrirá en su propia ventana

**Beneficios**: Funciona offline, carga más rápido, interfaz nativa sin pestañas del navegador.

## 📦 Tecnologías

| Categoría    | Tecnologías                  |
| ------------ | ---------------------------- |
| **Frontend** | React 19.2, TypeScript 5.9   |
| **Build**    | Vite 7.2                     |
| **Routing**  | React Router 7.9             |
| **PWA**      | Service Worker, Web Manifest |
| **Edición**  | Canvas API, react-image-crop |
| **Estilos**  | CSS Modules                  |
| **Iconos**   | Tabler Icons React           |
| **Deploy**   | GitHub Pages, GitHub Actions |

## 🌐 Compatibilidad de Navegadores

| Navegador        | Versión Mínima | Características                      |
| ---------------- | -------------- | ------------------------------------ |
| Chrome/Edge      | 90+            | ✅ Todas (PWA, offline, gestos)      |
| Safari (iOS)     | 15.4+          | ✅ Todas (optimizaciones especiales) |
| Firefox          | 88+            | ✅ Todas (sin instalación PWA)       |
| Samsung Internet | 14+            | ✅ Todas                             |

**Nota**: Las imágenes se optimizan automáticamente en dispositivos móviles para prevenir crashes por memoria.

## 🏗️ Arquitectura

### Patrón de Herramientas: Preview → Apply → Undo

Todas las herramientas de edición siguen este flujo:

```typescript
// 1. Preview (CSS - no destructivo)
const previewFilter = "grayscale(100%)";
<img style={{ filter: previewFilter }} />;

// 2. Apply (Canvas - destructivo)
ctx.filter = previewFilter;
ctx.drawImage(img, 0, 0);
canvas.toBlob((blob) => {
  const newFile = new File([blob], "filtered.png");
  setSourceFile(newFile); // Guarda snapshot automático
});

// 3. Undo/Redo
history.saveSnapshot(); // Antes de aplicar
history.undo(); // Restaura estado anterior
```

### Estructura de Carpetas

```text
src/
├── pages/
│   ├── Home/              # Página de carga de imagen
│   ├── Editor/            # Editor principal
│   │   ├── hooks/         # Custom hooks de herramientas
│   │   │   ├── useCropTool.ts
│   │   │   ├── useResizeTool.ts
│   │   │   ├── useTransformTool.ts
│   │   │   ├── useAdjustmentsTool.ts
│   │   │   ├── useQuickFilters.ts
│   │   │   ├── useEditorHistory.ts  # Undo/Redo
│   │   │   └── useZoomPan.ts
│   │   └── components/    # UI del editor
│   └── NotFound/          # Página 404
├── context/
│   └── ImageEditorContext.tsx  # Estado global
└── components/
    └── Alert/             # Componente de alertas
```

### Gestión de Estado

- **Global**: `ImageEditorContext` - archivo, objectURL, originalFile
- **Historial**: `useEditorHistory` - snapshots con undo/redo
- **Local**: Cada herramienta maneja su estado (crop rect, valores de sliders, etc.)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor local con HMR

# Producción
npm run build        # Build + copia index.html → 404.html (SPA)
npm run preview      # Preview del build local

# Calidad de código
npm run lint         # ESLint
```

## 🌐 Despliegue

El proyecto se despliega automáticamente en GitHub Pages mediante GitHub Actions:

1. Push a `main` → Dispara workflow
2. Build genera `dist/` con `404.html` (fallback SPA)
3. Agrega CNAME (`pixflow.andreifaur.dev`)
4. Actualiza timestamp en `health.json`
5. Deploy a GitHub Pages

**Configuración crítica SPA**:

```json
// package.json
"build": "tsc -b && vite build && cp dist/index.html dist/404.html"
```

Esto permite que rutas como `/editor` funcionen con acceso directo (React Router maneja el routing client-side).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-herramienta`)
3. Commit cambios (`git commit -m 'feat: agregar herramienta de desenfoque'`)
4. Push a la rama (`git push origin feature/nueva-herramienta`)
5. Abre un Pull Request

Consulta `.github/copilot-instructions.md` para patrones de código del proyecto.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

### Bogdan Andrei Faur

- GitHub: [@Bogdan-Andrei-Faur](https://github.com/Bogdan-Andrei-Faur)
- Web: [pixflow.andreifaur.dev](https://pixflow.andreifaur.dev)

---

Hecho con ❤️ usando React + TypeScript + Vite
