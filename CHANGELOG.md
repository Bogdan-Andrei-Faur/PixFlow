# Changelog - PixFlow

## [2.3.0] - 2025-12-06 - Landing Page & Marketing Features

### 🎨 Nueva Landing Page

#### Añadido

- **Landing page completa** con diseño moderno y profesional
  - Hero section con gradientes y CTA destacado
  - Grid de 6 features (crop, resize, transform, adjustments, filters, export)
  - Highlights de PWA y privacidad
  - Footer con enlaces a About, Privacy y GitHub
- **Página Privacy** (`/privacy`) - Requerida para Google AdSense
  - Política de procesamiento local (sin servidores)
  - Información sobre Google Analytics
  - Política de cookies y terceros
- **Página About** (`/about`) - Información del proyecto
  - Qué es PixFlow y por qué existe
  - Stack tecnológico (React 19, TypeScript, Vite, Canvas API)
  - Información del autor con enlaces
  - Versión y última actualización

### 📊 Analytics & Monetización

- **Google Analytics 4** integrado en `index.html`
  - Placeholder `G-XXXXXXXXXX` listo para ID real
  - Script optimizado en `<head>`
- **AdBanner component** preparado para Google AdSense
  - Solo se muestra en landing (`/`), nunca en editor
  - Placeholder discreto con mensaje "ayuda a mantener gratis"
  - Comentarios con instrucciones paso a paso para activar
  - Estructura lista: `data-ad-client`, `data-ad-slot`, etc.

### 🌐 Internacionalización

- **4 nuevos archivos de traducción**:
  - `home.json` (es/en) - Landing page completa
  - `privacy.json` (es/en) - Política de privacidad
  - `about.json` (es/en) - Página acerca de
- **i18n config actualizado** con namespaces: `home`, `privacy`, `about`

### 🎯 SEO Mejorado

- **Meta tags optimizados** en `index.html`:
  - Title: "Editor de imágenes online gratis - Sin instalación"
  - Description mejorada con keywords (PWA, offline, privado)
  - Open Graph y Twitter Cards actualizadas

### 🧭 Routing

- **3 nuevas rutas** en `App.tsx`:
  - `/` - Landing page (antes era selector de imagen)
  - `/privacy` - Política de privacidad
  - `/about` - Acerca de PixFlow
  - `/editor` - Editor (sin cambios)

### 📦 Arquitectura

#### Nuevos Componentes (6 archivos)

- `Home.tsx` + `.module.css` - Landing page completa (reemplaza antigua)
- `Privacy.tsx` + `.module.css` - Página de privacidad
- `About.tsx` + `.module.css` - Página acerca de
- `AdBanner.tsx` + `.module.css` - Componente de publicidad

#### Archivos Modificados

- `App.tsx` - Rutas nuevas
- `index.html` - GA4 script + meta tags mejorados
- `i18n/config.ts` - Nuevos namespaces

### 📊 Métricas

- **Archivos nuevos**: 12 (componentes + estilos + traducciones)
- **Archivos modificados**: 3
- **Líneas de código**: ~1,800 (landing + páginas + estilos)
- **Bundle size**: 392.30 KB JS (gzip 121.18 KB) ✅
- **Build time**: ~1.4s ✅

### 🎯 Listo para Producción

- ✅ **Landing page** lista para validar usuarios
- ✅ **Analytics** preparado (solo falta ID real)
- ✅ **AdSense** estructura completa (solo falta activar cuenta)
- ✅ **SEO** optimizado para búsqueda orgánica
- ✅ **Privacidad** cumple requisitos legales AdSense

### 📝 Próximos Pasos (Fase 2)

1. Obtener ID de Google Analytics 4 → reemplazar `G-XXXXXXXXXX`
2. Crear cuenta Google AdSense → obtener Publisher ID
3. Configurar AdBanner con IDs reales
4. Deploy y validar 2-3 semanas
5. Product Hunt launch

---

## [2.2.0] - 2024-12-03 - Code Architecture Reorganization

### 🏗️ Refactorización Completa de Arquitectura

#### Reorganización de Componentes

- **Separación Desktop/Mobile**: Componentes ahora organizados en carpetas separadas
  - `components/desktop/` - TopBar, ZoomControls, ToolsPanel
  - `components/mobile/` - MobileTopBar, MenuDrawer, BottomSheet, ZoomIndicator, MobileToolControls, ToolsPanel
  - `components/shared/` - ExportModal, ReactCrop
- **ToolsPanel Modularizado**:
  - Desktop: `DesktopPanel.tsx` + 5 panels individuales (Adjustments, Crop, Filters, Resize, Transform)
  - Mobile: `MobileDock.tsx` + 5 docks individuales
  - Compartido: `types.ts` con tipos centralizados (Tool, NaturalDims, CropRect, FilterType)
- **Barrel Exports**: Archivo `index.ts` en `components/` para imports simplificados

#### Reorganización de Hooks

- **Estructura categorizada** en 3 carpetas:
  - `hooks/tools/` - 5 hooks de herramientas de edición
    - `useCropTool.ts` - Recorte con límites por dispositivo
    - `useResizeTool.ts` - Redimensionar con aspect ratio
    - `useTransformTool.ts` - Rotación y volteo
    - `useAdjustmentsTool.ts` - Brillo/contraste/saturación
    - `useQuickFilters.ts` - Filtros rápidos (grayscale/sepia/invert)
  - `hooks/interaction/` - 3 hooks de interacción
    - `useZoomPan.ts` - Zoom y pan con gestos táctiles
    - `usePanDrag.ts` - Arrastrar canvas con puntero
    - `useKeyboardShortcuts.ts` - Atajos de teclado (Cmd+Z, +, -, 0)
  - `hooks/state/` - 2 hooks de estado
    - `useEditorHistory.ts` - Deshacer/rehacer con snapshots
    - `useImageExport.ts` - Exportación con formato/calidad
- **Barrel Exports**: Archivo `index.ts` en `hooks/` con exports organizados por categoría

#### Componentes Nuevos

**Desktop**:

- `TopBar.tsx` - Barra superior con navegación completa, undo/redo, tema, idioma
- `ZoomControls.tsx` - Controles de zoom con slider, botones +/-, Fit, 1:1
- `DesktopPanel.tsx` - Orquestador de paneles de herramientas
- 5 Panels: `AdjustmentsPanel.tsx`, `CropPanel.tsx`, `FiltersPanel.tsx`, `ResizePanel.tsx`, `TransformPanel.tsx`

**Mobile**:

- `MobileDock.tsx` - Dock de herramientas con iconos
- 5 Docks: `AdjustmentsDock.tsx`, `CropDock.tsx`, `FiltersDock.tsx`, `ResizeDock.tsx`, `TransformDock.tsx`

**Shared**:

- `ExportModal.tsx` - Modal de exportación con preview de tamaño y selección de formato
- `EasyCropWrapper.tsx` - Wrapper para react-easy-crop
- `ReactCropContainer.module.css` - Estilos optimizados para handles de crop

#### Documentación Completa

- **JSDoc en todos los hooks** (10/10): Descripción, parámetros, retorno, ejemplos
- **DOCUMENTACION_HOOKS.md**: Referencia rápida de todos los hooks con patrones de uso
- **ARCHITECTURE.md**: Guía completa de arquitectura con ejemplos paso a paso
- **README.md**: Actualizado con nueva estructura v2.2.0

#### Mejoras de Código

- **Imports simplificados**:

  ```typescript
  // Antes
  import { useZoomPan } from "./hooks/interaction/useZoomPan";

  // Ahora
  import { useZoomPan } from "./hooks";
  ```

- **Tipos centralizados**: `types.ts` compartido entre desktop y mobile
- **Sin duplicados**: Eliminados archivos obsoletos y duplicados de reorganizaciones anteriores

#### Correcciones

- ✅ **Estructura de carpetas**: mobile/ToolsPanel y desktop/ToolsPanel en ubicaciones correctas
- ✅ **Eliminación de duplicados**: Sin archivos repetidos o en ubicaciones incorrectas
- ✅ **Actualización de iconos**: Referencias cambiadas de `photo-dark.svg` a `icons/favicon.svg`
- ✅ **Limpieza de configuración**: Eliminado `.markdownlint.json` (extensión desinstalada)

### 📊 Métricas

- **Archivos reorganizados**: 47 archivos (componentes + hooks)
- **Archivos nuevos**: 24 (componentes separados + hooks categorizados + barrel exports)
- **Líneas de documentación**: ~1,500 (JSDoc + DOCUMENTACION_HOOKS.md)
- **Compilación TypeScript**: 0 errores ✅
- **Build**: 375.96 KB JS gzipped (sin cambios) ✅
- **Linter**: 0 warnings ✅

### 🎯 Beneficios

- ✨ **Mejor mantenibilidad**: Componentes y hooks organizados por responsabilidad
- 🔍 **Más fácil de navegar**: Estructura clara con separación desktop/mobile/shared
- 📚 **Documentación completa**: Todos los hooks con JSDoc + guías de arquitectura
- 🚀 **Imports más limpios**: Barrel exports eliminan paths profundos
- 🧪 **Más testeable**: Componentes pequeños y enfocados

---

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
