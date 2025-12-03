# Documentación de Hooks - PixFlow

## 📖 Sobre este Documento

Esta es una **referencia rápida** de todos los hooks documentados en PixFlow. Para arquitectura completa del proyecto, ver [ARCHITECTURE.md](./ARCHITECTURE.md).

### ¿Qué es JSDoc?

**JSDoc** son comentarios especiales en el código (`/** */`) que documentan funciones, hooks y componentes directamente en los archivos TypeScript/JavaScript.

**Ventajas**:

- ✅ **IntelliSense automático**: VS Code muestra descripciones, parámetros y ejemplos al escribir
- ✅ **Sin instalación**: No requiere paquetes npm ni generación de docs externa
- ✅ **Siempre actualizado**: La documentación vive en el código fuente
- ✅ **Validación TypeScript**: Mejora el type checking y detección de errores

**Ejemplo en el código**:

```typescript
/**
 * Hook para aplicar filtros rápidos a imágenes
 * @param imgRef - Referencia al elemento img
 * @returns Controles de filtros y estado activo
 */
export function useQuickFilters({ imgRef }) {
  // ...
}
```

Cuando escribes `useQuickFilters(`, VS Code muestra automáticamente la descripción y parámetros esperados.

---

## 🛠️ Hooks de Herramientas (`hooks/tools/`)

### `useCropTool.ts`

**Propósito**: Herramienta de recorte con optimizaciones móviles y auto-inicialización

**Características**:

- Auto-inicializa con selección 100% al activar herramienta
- Límites móviles: 1024×1024px máx, salida JPEG para compatibilidad iOS
- Límites desktop: 4096×4096px máx
- Flujo de 4 pasos: inicializar → ajustar → aplicar → cancelar

**Uso**:

```tsx
const crop = useCropTool({
  natural,
  imgRef,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeCrop: () => history.saveSnapshot(),
});

// Inicializar cuando se activa la herramienta
useEffect(() => {
  crop.initializeCrop();
}, []);
```

---

### `useResizeTool.ts`

**Propósito**: Redimensionar imágenes con control de aspecto

**Características**:

- Inputs de ancho/alto con bloqueo opcional de aspecto
- Cuando aspecto está activado, cambiar una dimensión auto-calcula la otra
- Redimensionamiento basado en Canvas para cambios permanentes

**Uso**:

```tsx
const resize = useResizeTool({
  natural,
  imgRef,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeResize: () => history.saveSnapshot()
});

<input value={resize.newWidth} onChange={e => resize.handleWidthChange(+e.target.value)} />
<input type="checkbox" checked={resize.maintainAspect}
  onChange={e => resize.setMaintainAspect(e.target.checked)} />
```

---

### `useTransformTool.ts`

**Propósito**: Transformaciones de rotación y volteo

**Características**:

- Rotación: 90°, -90°, 180° con matrices de transformación canvas
- Volteo: Espejado H/V con `ctx.scale()`
- Intercambio de dimensiones para rotaciones 90°/-90° para mantener aspecto

**Uso**:

```tsx
const transform = useTransformTool({
  imgRef,
  setSourceFile,
  setNatural,
  fitToScreen,
  onBeforeTransform: () => history.saveSnapshot()
});

<button onClick={() => transform.applyRotation(90)}>Rotar 90°</button>
<button onClick={() => transform.applyFlip("horizontal")}>Voltear H</button>
```

---

### `useAdjustmentsTool.ts`

**Propósito**: Ajustes de brillo, contraste y saturación

**Características**:

- Ajustes basados en sliders (rango -100 a +100)
- Preview CSS en tiempo real
- Manipulación Canvas a nivel de píxel al aplicar (compatible Safari)
- Orden de ajustes: saturación → contraste → brillo (coincide con CSS)

**Uso**:

```tsx
const adjustments = useAdjustmentsTool({
  imgRef,
  setSourceFile,
  fitToScreen,
  onBeforeAdjust: () => history.saveSnapshot()
});

<img style={{ filter: adjustments.previewFilter }} />
<input type="range" min="-100" max="100" value={adjustments.brightness}
  onChange={e => adjustments.setBrightness(+e.target.value)} />
<button disabled={!adjustments.hasChanges}>Aplicar</button>
```

---

### `useQuickFilters.ts`

**Propósito**: Filtros preset de un clic

**Características**:

- Tres filtros: escala de grises, sepia, invertir
- Selección mutuamente exclusiva (seleccionar uno deselecciona otros)
- Preview CSS instantáneo, aplicación a nivel píxel
- Matrices de transformación de color estándar para precisión

**Uso**:

```tsx
const filters = useQuickFilters({
  imgRef,
  setSourceFile,
  fitToScreen,
  onBeforeApply: () => history.saveSnapshot(),
});

<button
  onClick={() => filters.selectFilter("grayscale")}
  className={filters.activeFilter === "grayscale" ? "active" : ""}
>
  Escala de grises
</button>;
```

---

## 🎮 Hooks de Interacción (`hooks/interaction/`)

### `useZoomPan.ts`

**Propósito**: Controles de zoom y pan con soporte de gestos táctiles

**Características**:

- Desktop: Ctrl+scroll para zoom, scroll para pan
- Móvil: Pinch-to-zoom (0.01x a 8x), arrastrar pan, toggle double-tap
- Auto-ajusta padding fit-to-screen (90% móvil, 98% desktop)
- Refs de estado táctil para rendimiento (evitar re-renders durante gestos)

**Gestos**:

- **Rueda del ratón**: Ctrl+scroll para zoom, scroll para pan
- **Pinch-to-zoom**: Cambios de distancia con dos dedos
- **Arrastrar pan**: Arrastrar con un dedo
- **Double-tap**: Alterna entre fit-to-screen y zoom 2x

**Uso**:

```tsx
const zoomPan = useZoomPan(natural, viewportRef);

<div
  onWheel={zoomPan.handleWheel}
  onTouchStart={zoomPan.handleTouchStart}
  onTouchMove={zoomPan.handleTouchMove}
  onTouchEnd={zoomPan.handleTouchEnd}
>
  <img
    style={{
      transform: `scale(${zoomPan.zoom}) translate(${-zoomPan.offset
        .x}px, ${-zoomPan.offset.y}px)`,
    }}
  />
</div>;
```

---

### `usePanDrag.ts`

**Propósito**: Interacción pan/drag basada en puntero para desktop

**Características**:

- Funcionalidad click-and-drag con eventos de puntero
- Usa refs para estado de arrastre (evitar re-renders)
- Puede habilitarse/deshabilitarse (ej: deshabilitar durante herramienta crop)

**Uso**:

```tsx
const panDrag = usePanDrag({
  enabled: activeTool !== "crop", // Deshabilitar durante crop
  offset,
  setOffset,
});

<div
  onPointerDown={panDrag.startDrag}
  onPointerMove={panDrag.onDrag}
  onPointerUp={panDrag.endDrag}
  onPointerLeave={panDrag.endDrag}
  style={{ cursor: panDrag.isDragging ? "grabbing" : "grab" }}
/>;
```

---

### `useKeyboardShortcuts.ts`

**Propósito**: Atajos de teclado globales para el editor

**Características**:

- Event listeners a nivel ventana (fase de captura)
- Previene defaults del navegador (ej: Cmd+Z navegación página)
- Se limpia automáticamente al desmontar

**Atajos**:

- **Cmd+Z / Ctrl+Z**: Deshacer
- **Cmd+Shift+Z / Ctrl+Shift+Z**: Rehacer
- **Cmd++ / Ctrl++**: Aumentar zoom 10%
- **Cmd+- / Ctrl+-**: Reducir zoom 10%
- **Cmd+0 / Ctrl+0**: Ajustar a pantalla

**Uso**:

```tsx
useKeyboardShortcuts({
  onUndo: () => history.undo(),
  onRedo: () => history.redo(),
  setZoom,
  fitToScreen,
});
// Sin valor de retorno - solo efecto secundario
```

---

## 💾 Hooks de Estado (`hooks/state/`)

### `useEditorHistory.ts`

**Propósito**: Historial deshacer/rehacer con snapshots

**Características**:

- Sistema de dos pilas (pila undo + pila redo)
- Cada snapshot captura: archivo, dimensiones, zoom, offset
- Nuevos cambios limpian pila redo (comportamiento estándar)
- Eficiente en memoria (almacena referencias File, no copias blob)

**Mecánica**:

1. **Guardar**: Empuja estado actual a pila undo, limpia pila redo
2. **Undo**: Extrae de pila undo, restaura estado, empuja actual a pila redo
3. **Redo**: Extrae de pila redo, restaura estado, empuja actual a pila undo

**Uso**:

```tsx
const history = useEditorHistory({
  file,
  natural,
  zoom,
  offset,
  setSourceFile,
  setNatural,
  setZoom,
  setOffset,
  onRestore: () => setActiveTool(null),
});

// En hooks de herramientas:
history.saveSnapshot(); // Llamar antes de operaciones destructivas

// En UI:
<button onClick={history.undo} disabled={!history.canUndo}>
  Deshacer
</button>;
```

---

### `useImageExport.ts`

**Propósito**: Exportar imágenes con conversión de formato y control de calidad

**Características**:

- Soporta formatos PNG (sin pérdida), JPEG, WebP
- Respeta configuración de herramienta activa (área crop, dimensiones resize)
- Calidad JPEG configurable (escala 0-1, 0.92 por defecto)
- Genera archivos descargables con extensiones apropiadas

**Comportamiento de Exportación**:

- **Herramienta crop activa**: Exporta solo región recortada
- **Herramienta resize activa**: Exporta con nuevas dimensiones
- **Otras herramientas**: Exporta dimensiones naturales completas

**Recomendaciones de Calidad**:

- PNG: Sin pérdida, sin parámetro de calidad
- JPEG: 0.92 por defecto (alta), 0.75-0.85 para archivos menores
- WebP: 0.92 por defecto, 0.80-0.90 para balance

**Uso**:

```tsx
const { handleExport } = useImageExport({
  imgRef,
  natural,
  file,
  completedCrop,
  activeTool,
  newWidth,
  newHeight
});

<button onClick={() => handleExport("png")}>Exportar PNG</button>
<button onClick={() => handleExport("jpeg", 0.85)}>Exportar JPEG (85%)</button>
```

---

## 📋 Estándares de Documentación

Todos los hooks siguen esta plantilla JSDoc:

````typescript
/**
 * Descripción breve (una línea)
 *
 * Explicación detallada incluyendo:
 * - Qué hace el hook
 * - Características clave/optimizaciones
 * - Notas importantes de implementación
 *
 * **Patrón de uso** (si aplica):
 * 1. Paso uno
 * 2. Paso dos
 *
 * @param props - Descripción de props
 * @param props.param1 - Descripción de parámetro individual
 * @returns Descripción del valor de retorno
 *
 * @example
 * ```tsx
 * const hook = useHook({ ... });
 * hook.method();
 * ```
 */
````

---

## 📚 Próximos Pasos

Para información completa del proyecto:

- **Guía de Arquitectura**: Ver [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Guía de Testing**: Ver [TESTING.md](./TESTING.md)
- **Instrucciones Copilot**: Ver [.github/copilot-instructions.md](./.github/copilot-instructions.md)

---

**Última Actualización**: 3 de diciembre de 2024  
**Total de Hooks Documentados**: 10/10 ✅  
**Sistema de Documentación**: JSDoc (comentarios inline en código fuente)
