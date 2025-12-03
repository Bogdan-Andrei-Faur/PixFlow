# PixFlow - Arquitectura del Proyecto

## 📋 Tabla de Contenidos

- [Estructura General](#estructura-general)
- [Módulos Principales](#m%C3%B3dulos-principales)
- [Flujo de Datos](#flujo-de-datos)
- [Patrones de Diseño](#patrones-de-dise%C3%B1o)
- [Cómo Añadir Funcionalidades](#c%C3%B3mo-a%C3%B1adir-funcionalidades)

---

## 🏗️ Estructura General

```text
src/
├── components/          # Componentes compartidos globalmente
│   ├── Alert/          # Sistema de notificaciones
│   └── LanguageSelector/  # Selector de idioma
├── context/            # Estado global de la aplicación
│   ├── ImageEditorContext.tsx  # Estado del editor (imagen actual)
│   └── useImageEditor.ts       # Hook para acceder al contexto
├── i18n/              # Internacionalización (ES/EN)
│   └── locales/       # Traducciones por idioma
├── pages/             # Páginas de la aplicación
│   ├── Home/          # Página inicial (carga de imagen)
│   └── Editor/        # Editor principal ⭐
├── utils/             # Utilidades globales
│   └── imageOptimization.ts  # Optimización móvil (1024px/2MB)
└── main.tsx           # Punto de entrada
```

---

## ⭐ Editor - Módulo Principal

### Estructura Organizada

```text
pages/Editor/
├── components/
│   ├── mobile/              # Componentes específicos de móvil
│   │   ├── MobileTopBar/    # Barra superior móvil (menú + título + aplicar)
│   │   ├── MenuDrawer/      # Menú hamburguesa lateral (deshacer/rehacer/reset/salir)
│   │   ├── BottomSheet/     # Panel inferior expandible con herramientas
│   │   ├── ZoomIndicator/   # Indicador temporal de zoom (aparece 2s)
│   │   ├── MobileToolControls/  # Controles específicos por herramienta
│   │   └── ToolsPanel/      # Panel móvil de herramientas
│   │       ├── MobileDock.tsx   # Dock móvil con botones de herramientas
│   │       └── docks/       # Paneles individuales por herramienta (5)
│   ├── desktop/             # Componentes específicos de escritorio
│   │   ├── TopBar/          # Barra superior desktop (navegación + idioma + tema)
│   │   ├── ZoomControls/    # Controles de zoom fijos
│   │   └── ToolsPanel/      # Panel lateral de herramientas
│   │       ├── DesktopPanel.tsx # Panel desktop con herramientas detalladas
│   │       ├── desktop/     # Paneles detallados por herramienta (5)
│   │       ├── types.ts     # Tipos compartidos (Tool, NaturalDims, CropRect, FilterType)
│   │       └── index.tsx    # Orquestador que integra mobile/desktop
│   ├── shared/              # Componentes compartidos
│   │   ├── ExportModal/     # Modal de exportación (PNG/JPEG/WebP)
│   │   └── ReactCrop/       # Wrapper de react-image-crop
│   └── index.ts             # Exportaciones centralizadas
├── hooks/
│   ├── tools/               # Hooks de herramientas de edición
│   │   ├── useCropTool.ts          # Recorte (crop)
│   │   ├── useResizeTool.ts        # Redimensionar
│   │   ├── useTransformTool.ts     # Rotar/Voltear
│   │   ├── useAdjustmentsTool.ts   # Ajustes (brillo/contraste/saturación)
│   │   └── useQuickFilters.ts      # Filtros rápidos (grayscale/sepia/invert)
│   ├── interaction/         # Hooks de interacción del usuario
│   │   ├── useZoomPan.ts           # Zoom y pan con gestos táctiles
│   │   ├── usePanDrag.ts           # Arrastrar canvas con puntero
│   │   └── useKeyboardShortcuts.ts # Atajos de teclado
│   ├── state/               # Hooks de estado y persistencia
│   │   ├── useEditorHistory.ts     # Deshacer/Rehacer con snapshots
│   │   └── useImageExport.ts       # Exportación de imagen
│   └── index.ts             # Exportaciones centralizadas
├── utils/
│   └── number.ts            # Utilidades matemáticas (clamp)
├── Editor.tsx               # Componente principal orquestador
└── Editor.module.css        # Estilos compartidos del editor
```

### Responsabilidades por Módulo

#### 📱 Mobile Components

- **MobileTopBar**: Navegación simplificada, botón aplicar contextual
- **MenuDrawer**: Menú lateral (izquierda) con opciones secundarias
- **BottomSheet**: Panel expandible (100px ↔ auto) con herramientas
- **ZoomIndicator**: Feedback visual temporal de nivel de zoom
- **MobileToolControls**: 5 variantes de controles (Crop, Resize, Transform, Adjustments, Filters)

#### 🖥️ Desktop Components

- **TopBar**: Navegación completa + idioma + tema
- **ZoomControls**: Controles de zoom siempre visibles
- **ToolsPanel**: Panel lateral con herramientas detalladas

#### 🛠️ Tools Hooks

Todos siguen el patrón: **Preview → Apply → Undo/Redo**

1. **Preview**: Filtros CSS aplicados a `<img>` (no destructivo)
2. **Apply**: Manipulación de Canvas → nuevo File (destructivo)
3. **Snapshot**: `useEditorHistory` guarda estado antes de aplicar

#### 🎮 Interaction Hooks

- **useZoomPan**: Gestos táctiles (pinch-to-zoom, pan, double-tap)
- **usePanDrag**: Arrastrar con puntero (mouse/touch)
- **useKeyboardShortcuts**: Ctrl+Z, Ctrl+Y, Ctrl+S, etc.

#### 💾 State Hooks

- **useEditorHistory**: Stack de snapshots (file + dimensiones + zoom/offset)
- **useImageExport**: Conversión Canvas → Blob → File + descarga

---

## 🔄 Flujo de Datos

### 1. Carga de Imagen

```text
Home/ImageUploader
  → optimizeImageForDevice() [auto: móvil 1024px, desktop 4096px]
  → setSourceFile() [ImageEditorContext]
  → navigate('/editor')
  → Editor.tsx recibe file desde context
```

### 2. Edición de Imagen

```text
Usuario selecciona herramienta
  → setActiveTool('crop'|'resize'|...)
  → Tool hook inicializa estado (ej: initializeCrop())
  → Usuario ajusta parámetros
  → Preview con CSS filters (no destructivo)
  → Usuario aplica cambios
  → onBeforeApply() → saveSnapshot() [History]
  → Canvas manipulation → nuevo File
  → setSourceFile(newFile) [Context]
  → fitToScreen() [ZoomPan]
```

### 3. Deshacer/Rehacer

```text
Usuario presiona Ctrl+Z o botón Deshacer
  → history.undo()
  → Recupera snapshot anterior (file + natural + zoom + offset)
  → setSourceFile(snapshot.file)
  → setNatural(snapshot.natural)
  → setZoom(snapshot.zoom)
  → setOffset(snapshot.offset)
```

### 4. Exportación

```text
Usuario abre ExportModal
  → Selecciona formato (PNG/JPEG/WebP) + calidad
  → Canvas.toBlob(format, quality)
  → Descarga automática del archivo
```

---

## 🎨 Patrones de Diseño

### 1. Preview-Apply Pattern (Herramientas)

**Problema**: Manipular canvas es costoso y destructivo
**Solución**:

- Mostrar preview con CSS filters (instantáneo, reversible)
- Aplicar a canvas solo cuando usuario confirma
- Guardar snapshot antes de aplicar

**Ejemplo** (useQuickFilters):

```typescript
// Preview
const previewFilter = "grayscale(100%)";
imgRef.current.style.filter = previewFilter;

// Apply
ctx.filter = previewFilter;
ctx.drawImage(img, 0, 0);
canvas.toBlob((blob) => {
  const newFile = new File([blob], "filtered.png");
  setSourceFile(newFile); // Destructivo pero con snapshot guardado
});
```

### 2. Snapshot Pattern (Historial)

**Problema**: Deshacer/rehacer en edición destructiva  
**Solución**: Guardar estado completo antes de cada cambio

```typescript
interface Snapshot {
  file: File;
  natural: { w: number; h: number };
  zoom: number;
  offset: { x: number; y: number };
}

// Antes de aplicar cualquier cambio
onBeforeApply: () => history.saveSnapshot();
```

### 3. Responsive Component Pattern

**Problema**: UX diferente en móvil vs desktop  
**Solución**: Componentes separados + detección de viewport

```typescript
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

{
  isMobile ? <MobileTopBar /> : <TopBar />;
}
{
  isMobile ? <BottomSheet /> : <ToolsPanel />;
}
```

### 4. Centralized Exports Pattern

**Problema**: Imports complejos con rutas profundas  
**Solución**: Archivos `index.ts` en cada módulo

```typescript
// ❌ Antes
import { useZoomPan } from "./hooks/interaction/useZoomPan";
import { useCropTool } from "./hooks/tools/useCropTool";

// ✅ Ahora
import { useZoomPan, useCropTool } from "./hooks";
```

---

## 🚀 Cómo Añadir Funcionalidades

### Añadir Nueva Herramienta

**1. Crear hook en `hooks/tools/`**

```typescript
// hooks/tools/useMyTool.ts

/**
 * Hook para la herramienta MyTool
 * Aplica efecto X a la imagen
 *
 * @param imgRef - Referencia al elemento img
 * @param natural - Dimensiones naturales de la imagen
 * @param file - Archivo de imagen actual
 * @param setSourceFile - Función para actualizar la imagen
 * @param onBeforeApply - Callback antes de aplicar (guarda snapshot)
 */
export function useMyTool({
  imgRef,
  natural,
  file,
  setSourceFile,
  onBeforeApply,
}) {
  const [myParam, setMyParam] = useState(0);
  const [previewFilter, setPreviewFilter] = useState("");

  const apply = useCallback(() => {
    if (!imgRef.current || !natural) return;

    // Guardar snapshot antes de modificar
    onBeforeApply?.();

    // Crear canvas y aplicar cambios
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = natural.w;
    canvas.height = natural.h;

    // Tu lógica aquí
    ctx.filter = previewFilter;
    ctx.drawImage(imgRef.current, 0, 0);

    // Convertir a File
    canvas.toBlob(
      (blob) => {
        const newFile = new File([blob], file?.name || "edited.jpg", {
          type: "image/jpeg",
        });
        setSourceFile(newFile);
      },
      "image/jpeg",
      0.92
    );
  }, [imgRef, natural, file, previewFilter, onBeforeApply]);

  const cancel = useCallback(() => {
    setMyParam(0);
    setPreviewFilter("");
  }, []);

  return {
    myParam,
    setMyParam,
    previewFilter,
    apply,
    cancel,
    hasChanges: myParam !== 0,
  };
}
```

**2. Añadir al tipo `Tool`**

```typescript
// components/desktop/ToolsPanel/types.ts
export type Tool =
  | "none"
  | "crop"
  | "resize"
  | "transform"
  | "adjustments"
  | "filters"
  | "mytool"; // ← Nuevo
```

#### 3. Integrar en Editor.tsx

```typescript
import { useMyTool } from "./hooks";

// En el componente
const myTool = useMyTool({
  imgRef,
  natural,
  file,
  setSourceFile,
  onBeforeApply: () => history.saveSnapshot(),
});

// En handleToolChange
if (t === "mytool" && activeTool !== "mytool") {
  myTool.initialize?.();
}
```

#### 4. Crear panel de controles

```typescript
// components/mobile/MobileToolControls/MobileToolControls.tsx
export const MobileMyToolControls = ({
  myParam,
  onChangeMyParam,
  onApply,
  onCancel,
}) => (
  <div className={styles.controlsContainer}>
    <div className={styles.sliderGroup}>
      <label className={styles.sliderLabel}>
        <span>Mi Parámetro</span>
        <span className={styles.value}>{myParam}%</span>
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={myParam}
        onChange={(e) => onChangeMyParam(parseInt(e.target.value))}
        className={styles.slider}
      />
    </div>
    <div className={styles.buttonGroup}>
      <button
        className={`${styles.button} ${styles.cancel}`}
        onClick={onCancel}
      >
        <IconX size={20} /> Cancelar
      </button>
      <button className={`${styles.button} ${styles.apply}`} onClick={onApply}>
        <IconCheck size={20} /> Aplicar
      </button>
    </div>
  </div>
);
```

#### 5. Añadir a ToolsPanel/BottomSheet

```typescript
// En ToolsPanel o BottomSheet, añadir botón:
{
  id: "mytool",
  icon: IconMyTool,
  label: "Mi Herramienta"
}
```

**6. Exportar hook en `hooks/index.ts`**

```typescript
export { useMyTool } from "./tools/useMyTool";
```

---

### Añadir Optimización Móvil

**Límites actuales** (`utils/imageOptimization.ts`):

- Móvil: 1024×1024px, 2MB, JPEG 75%
- Desktop: 4096×4096px, 15MB, JPEG 92%

**Dónde aplicar**:

1. **Carga inicial**: `ImageUploader.tsx` → `optimizeImageForDevice()`
2. **Crop**: `useCropTool.ts` → límites de dimensiones
3. **Cualquier operación canvas**: Verificar dimensiones antes de crear canvas

**Evitar crashes iOS**:

```typescript
const isMobile = window.innerWidth <= 768;
const maxDim = isMobile ? 1024 : 4096;

// Escalar si excede límites
if (width > maxDim || height > maxDim) {
  const scale = Math.min(maxDim / width, maxDim / height);
  width = Math.round(width * scale);
  height = Math.round(height * scale);
}
```

---

### Añadir Gesto Táctil

**Ubicación**: `hooks/interaction/useZoomPan.ts`

**Estructura existente**:

- `handleTouchStart`: Detecta inicio de gesto
- `handleTouchMove`: Calcula delta
- `handleTouchEnd`: Ejecuta acción

**Ejemplo - Triple-tap zoom**:

```typescript
const tapCountRef = useRef(0);
const tapTimerRef = useRef<number | null>(null);

const handleTouchStart = useCallback((e: React.TouchEvent) => {
  if (e.touches.length === 1) {
    tapCountRef.current++;

    if (tapCountRef.current === 3) {
      // Triple-tap detectado
      setZoom(3);
      tapCountRef.current = 0;
    }

    // Reset contador después de 500ms
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 500);
  }
  // ... resto de lógica
}, []);
```

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`MobileTopBar.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useZoomPan.ts`)
- **Utilidades**: camelCase (`number.ts`)
- **Tipos**: PascalCase (`type Tool = ...`)

### Estructura de Archivos

```text
ComponentName/
├── ComponentName.tsx       # Lógica del componente
├── ComponentName.module.css # Estilos CSS Modules
└── index.ts (opcional)     # Re-exportación simple
```

### Comentarios JSDoc

Todos los hooks, funciones públicas y componentes deben tener:

```typescript
/**
 * Descripción breve de la funcionalidad
 *
 * Detalles adicionales si es necesario, casos especiales,
 * optimizaciones móviles, límites, etc.
 *
 * @param param1 - Descripción del parámetro
 * @param param2 - Descripción del parámetro
 * @returns Descripción del valor de retorno
 *
 * @example
 * const result = myFunction(value);
 */
```

### CSS Modules

- BEM-like naming: `.toolButton`, `.toolButton.active`
- Color scheme: `#4f46e5` (purple) para acciones primarias
- Variables CSS: `var(--text-primary, #f5f5f5)` con fallback

---

## 🔧 Tecnologías y Dependencias

### Core

- **React 19** + **TypeScript** + **Vite**
- **React Router** (client-side routing)
- **React i18next** (internacionalización ES/EN)

### Edición de Imágenes

- **Canvas API** (manipulación destructiva)
- **react-image-crop** (UI de recorte)
- **CSS Filters** (preview no destructivo)

### PWA

- **Service Worker** (offline, cache-first)
- **Web Manifest** (instalación, iconos)
- **Touch Gestures** (custom hooks)

### Utilidades

- **@tabler/icons-react** (iconos consistentes)

---

## 🐛 Troubleshooting

### Build Errors después de reorganizar

1. Verificar que todos los imports usen paths relativos correctos
2. Ejecutar `npx tsc -b` para ver errores TypeScript específicos
3. Verificar que `hooks/index.ts` y `components/index.ts` exportan todo

### Crashes en móvil iOS

1. Verificar que las dimensiones no excedan 1024px
2. Usar JPEG en lugar de PNG (reduce 60-80% tamaño)
3. Llamar `ctx.clearRect()` después de operaciones canvas
4. Verificar que `optimizeImageForDevice()` se llama en carga

### Pan/Zoom conflicta con herramientas

1. Verificar que los event handlers están deshabilitados cuando `activeTool !== "none"`
2. Ejemplo en `Editor.tsx`:

```typescript
onPointerDown={activeTool !== "crop" ? panDrag.startDrag : undefined}
```

---

## 📚 Recursos Adicionales

- **README.md**: Visión general del proyecto
- **DOCUMENTACION_HOOKS.md**: Referencia rápida de todos los hooks con JSDoc
- **TESTING.md**: Guía completa de testing (100+ checkpoints)
- **CHANGELOG.md**: Historial de cambios
- **.github/copilot-instructions.md**: Instrucciones para AI

---

**Última actualización**: 3 de diciembre de 2025  
**Versión**: 1.0.0
