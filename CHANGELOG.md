# Changelog - PixFlow

## [2.1.0] - 2024-12-02 - Mobile UI Overhaul & UX Polish

### 🎨 Nueva Interfaz Móvil

#### Añadido

- **MobileTopBar**: Barra superior con menú hamburguesa (izquierda), título (centro), aplicar cambios (derecha)
- **MenuDrawer**: Menú lateral deslizable con todas las opciones del editor
  - Secciones: Edición (undo/redo), Imagen (cargar/reset), Preferencias (tema/idioma)
  - Animaciones fluidas de entrada/salida
  - Overlay con backdrop blur
- **BottomSheet**: Panel inferior expandible/colapsable para herramientas
  - Altura automática basada en contenido (max 70vh desktop, 65vh móvil)
  - Swipe gestures para expandir/contraer
  - Iconos de herramientas en vista colapsada
- **MobileToolControls**: 5 componentes específicos por herramienta
  - `MobileCropControls`: Hint + botones aplicar/cancelar
  - `MobileResizeControls`: Inputs compactos + checkbox proporción
  - `MobileTransformControls`: Grid de botones con iconos Tabler
  - `MobileAdjustmentsControls`: 3 sliders con gradiente
  - `MobileFilterControls`: Grid 2×2 de filtros
- **ZoomIndicator**: Indicador temporal de zoom (2s) en esquina superior derecha

### 🎯 Gestos Táctiles Mejorados

- **Double-tap**: Zoom 2× / Fit to screen toggle
- **Pinch-to-zoom**: Zoom fluido con dos dedos (0.01× - 8×)
- **Pan**: Arrastre con un dedo (desactivado durante crop)
- **Prevención de conflictos**: Gestos de zoom/pan deshabilitados cuando herramienta crop está activa

### 🔧 Mejoras de Herramientas

#### Crop Tool

- **Auto-inicialización**: Crop area al 100% de la imagen al activar herramienta
- **Gestos exclusivos**: Pan/zoom desactivados durante crop para evitar interferencias
  - `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerLeave`
  - `onWheel`, `onTouchStart`, `onTouchMove`, `onTouchEnd`
  - Todos establecidos a `undefined` cuando `activeTool === "crop"`

#### Transform Tool

- **Iconos Tabler**: Reemplazados caracteres Unicode (↶, ↷, ↻) por iconos profesionales
  - `-90°`: `IconRotateClockwise` con `scaleX(-1)`
  - `90°`: `IconRotateClockwise`
  - `180°`: `IconRotate`
  - Horizontal: `IconFlipHorizontal`
  - Vertical: `IconFlipVertical`

#### Adjustments Tool

- **Sliders con gradiente**: Estilo desktop replicado en móvil
  - Altura: 6px
  - Fondo: `linear-gradient(to right, #333 0%, #4f46e5 100%)`
  - Thumb: 18px con hover scale(1.1)
  - Gradiente aplicado directamente al slider (no al track)

### 🎨 UI/UX Polish

#### LanguageSelector

- **Z-index corregido**: backdrop 1000, dropdown 1001 (sobre MenuDrawer z-index 999)
- **Alineación**: Left-aligned, full width
- **Touch-friendly**: Min-height 44px, padding aumentado

#### ExportModal

- **Tooltips visibles**: Z-index 10000 con position fixed
  - Anteriormente z-index 10, ocultos detrás del modal backdrop (z-index 1000)
  - Ahora centrados en pantalla: `left: 50%; top: 50%; transform: translate(-50%, -50%)`
  - Max-width: 90vw para mobile responsiveness

#### Spacing Optimization

- **MobileToolControls**: Gap reducido de 1.25rem → 0.75rem
- **Inputs compactos**: Padding 0.5rem, font-size 0.875rem, min-width: 0, box-sizing: border-box
- **Sin márgenes**: Eliminados margin-bottom en inputGroup y checkbox

#### Export Button

- **Icono cambiado**: `IconDotsVertical` → `IconDownload`
- **Aria-label**: "Más opciones" → "Descargar"

### 🌐 Internacionalización

- **Nuevas traducciones** (`common.json` en/es):
  - `buttons.close`: Close / Cerrar
  - `menu.title`: Menu / Menú
  - `menu.editing`: Editing / Edición
  - `menu.image`: Image / Imagen
  - `menu.preferences`: Preferences / Preferencias
  - `menu.about`: About / Acerca de

### 📐 Responsive Design

#### Breakpoints

- **Mobile**: ≤768px
  - TopBar desktop oculto, MobileTopBar visible
  - BottomSheet activo
  - ZoomControls desktop ocultos, ZoomIndicator visible
  - Canvas height: `calc(100dvh - 56px - 100px)` (resta TopBar + BottomSheet)
  - BottomSheet expandido: canvas min-height 30vh

#### Landscape Mode

- **Optimizaciones**: Canvas height ajustado a `calc(100dvh - 50px - 80px)`

### 🐛 Fixes

- ✅ **Horizontal scroll en MenuDrawer**: `overflow-x: hidden` en drawer y content
- ✅ **LanguageSelector oculto**: Z-index aumentado a 1000/1001
- ✅ **BottomSheet espacio excesivo**: Altura auto con max-height
- ✅ **Inputs solapados**: min-width: 0, box-sizing, spacing reducido
- ✅ **Pan/zoom interfiere con crop**: Handlers deshabilitados durante crop
- ✅ **Tooltips ocultos**: Position fixed, z-index 10000
- ✅ **ImageUploader unused var**: Error catch sin variable
- ✅ **Zoom accidental en inputs**: Font-size 16px en iOS

### 📦 Arquitectura

#### Nuevos Componentes (10 archivos)

- `MobileTopBar.tsx` + `.module.css`
- `MenuDrawer.tsx` + `.module.css`
- `BottomSheet.tsx` + `.module.css`
- `MobileToolControls.tsx` + `.module.css`
- `ZoomIndicator.tsx` + `.module.css`

#### Hooks Modificados

- **useZoomPan.ts**: Double-tap detection, improved touch handling
  ```typescript
  const lastTapRef = React.useRef<number>(0);
  const [isZoomedIn, setIsZoomedIn] = React.useState(false);
  ```

#### Detectores de Dispositivo

```typescript
const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
React.useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### 📊 Métricas

- **Archivos nuevos**: 10
- **Archivos modificados**: 11
- **Líneas añadidas**: ~1,200 (componentes + estilos)
- **Líneas de CSS**: ~500 (responsive + mobile-first)
- **Componentes React**: 10 nuevos

### 🎯 Testing Recommendations

- [ ] Probar BottomSheet swipe gestures (up/down)
- [ ] Verificar double-tap zoom en diferentes dispositivos
- [ ] Confirmar que pan/zoom NO funciona durante crop
- [ ] Validar crop auto-init al 100% de imagen
- [ ] Verificar tooltips visibles en ExportModal
- [ ] Probar MenuDrawer en landscape mode
- [ ] Confirmar LanguageSelector visible sobre menú
- [ ] Validar sliders match apariencia desktop

---

## [2.0.0] - 2024-12-02 - PWA & Mobile Optimization Release

### 🎉 Progressive Web App (PWA)

#### Añadido

- **PWA completa**: La aplicación ahora es instalable en iOS, Android y Desktop
- **Service Worker**: Cacheo de assets para funcionamiento offline
- **Web Manifest**: Configuración completa con iconos de todos los tamaños
- **Iconos PWA**: Set completo de iconos (72x72 a 512x512) para todas las plataformas
- **Meta tags PWA**: Configuración para iOS (apple-touch-icon, mobile-web-app-capable)

### 📱 Optimización Móvil

#### Gestos Táctiles

- **Pinch-to-zoom**: Zoom in/out con dos dedos en dispositivos táctiles
- **Pan táctil**: Movimiento de imagen con un dedo
- **Touch events**: Implementación completa de touchstart/touchmove/touchend
- **Prevención de scroll**: Los gestos no causan scroll accidental de página

#### Interfaz Touch-Friendly

- **Botones grandes**: Todos los controles cumplen mínimo 44x44px (iOS guidelines)
- **Zoom controls mejorados**: Botones más grandes y mejor espaciado en móvil
- **Slider táctil**: Altura aumentada para mejor interacción con dedos
- **Drawer móvil**: Panel de herramientas rediseñado como bottom drawer

### 🖼️ Optimización de Imágenes

#### Límites Automáticos por Dispositivo

- **Móvil**: Redimensionado automático a máx 1024×1024px, 2MB, JPEG 75%
- **Desktop**: Límite de 4096×4096px, 15MB, JPEG 92%
- **Detección inteligente**: User agent + viewport width para determinar dispositivo

#### Crop Tool - Optimizaciones iOS

- **Fix crítico**: Resuelto crash en Safari iOS al usar herramienta de recorte
- **Límite agresivo**: Máximo 1024px en iOS para prevenir memory errors
- **JPEG output**: Conversión de PNG a JPEG para reducir uso de memoria
- **Calidad adaptativa**: 75% en móvil, 92% en desktop
- **Cleanup**: Limpieza explícita de memoria con ctx.clearRect()
- **Error handling**: Try-catch robusto con mensajes informativos

### 🏗️ Refactorización de Código

#### ToolsPanel Modularización

- **14 archivos nuevos**: De 783 líneas monolíticas a componentes de <200 líneas
- **Estructura clara**: `types.ts`, `index.tsx`, `MobileDock.tsx`, `DesktopPanel.tsx`
- **Componentes por herramienta**: 5 docks móviles + 5 panels desktop
- **Mejor mantenibilidad**: Cada herramienta en su propio archivo

#### Image Optimization Utils

- **Nuevo archivo**: `/src/utils/imageOptimization.ts`
- **Funciones**:
  - `optimizeImageForDevice()`: Entry point principal
  - `isMobileDevice()`: Detección de tipo de dispositivo
  - `optimizeImage()`: Resize + compress con Canvas
  - `checkIfNeedsResize()`: Validación de dimensiones

### 🎨 Mejoras de UI/UX

#### Responsive Design

- **Home page**: Totalmente responsive, touch-friendly
- **TopBar móvil**: Adaptado con iconos compactos
- **Zoom controls**: Posicionamiento superior en móvil, inferior en desktop
- **Mensajes informativos**: Alert para usuarios iOS sobre optimizaciones

#### Feedback Visual

- **Loading state**: "Optimizando imagen..." mientras procesa
- **Error messages**: Banner rojo dismissible para errores de memoria
- **Disabled states**: Input deshabilitado durante procesamiento

### 🐛 Fixes

#### Críticos

- ✅ **iOS Safari crash**: Resuelto crash al usar crop con fotos de alta resolución
- ✅ **Memory leaks**: Cleanup apropiado de object URLs y canvas
- ✅ **Import errors**: Añadidas extensiones `.js` a imports relativos (ES6 modules)

#### Menores

- 🔧 Linter warning en useCropTool: `error` variable no usada
- 🔧 Console.logs de debug eliminados de producción
- 🔧 Variables `let` → `const` donde corresponde

### 📚 Documentación

#### Nuevos Archivos

- **TESTING.md**: Guía completa de testing con checklist de 100+ puntos
- **CHANGELOG.md**: Este archivo con historial de cambios

#### README Actualizado

- ✨ Sección PWA con características
- 📱 Sección de gestos táctiles
- 🌐 Tabla de compatibilidad de navegadores
- 📲 Instrucciones de instalación PWA (iOS/Android/Desktop)
- 🎯 Límites de optimización documentados

### 🔧 Configuración

#### Package.json

- Build script mantiene copia de `index.html` → `404.html` para SPA routing

#### TypeScript

- Tipos actualizados para `React.TouchList`
- Strict mode mantenido

### 📊 Métricas

#### Bundle Size

- CSS: 34.10 kB (6.80 kB gzipped)
- JS: 360.95 kB (113.05 kB gzipped)
- Total: ~395 kB (~120 kB gzipped)

#### Código

- **Líneas refactorizadas**: ~783 líneas → 14 archivos modulares
- **Archivos nuevos**: 17 (ToolsPanel components + utils + docs)
- **Archivos modificados**: 17
- **Archivos eliminados**: 1 (ToolsPanel.tsx monolítico)

### 🎯 Testing

- ✅ iPhone 15 Pro Max - Safari: Crop funciona sin crashes
- ✅ Compilación TypeScript: Sin errores
- ✅ Build de producción: Exitoso
- ⏳ Pendiente: Testing en Android y otros dispositivos

---

## [1.0.0] - 2024-11-XX - Initial Release

### Características Iniciales

- Editor de imágenes básico con Canvas API
- Herramientas: Crop, Resize, Transform, Adjustments, Filters
- Undo/Redo con historial
- Zoom y Pan
- Export a PNG/JPEG/WebP
- Tema claro/oscuro
- React Router para navegación
- Deployment en GitHub Pages

---

**Formato**: [Major.Minor.Patch] según [Semantic Versioning](https://semver.org/)

- **Major**: Cambios incompatibles de API
- **Minor**: Nueva funcionalidad compatible con versiones anteriores
- **Patch**: Correcciones de bugs compatibles con versiones anteriores
