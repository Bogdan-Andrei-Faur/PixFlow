# 🧪 Guía de Testing - PixFlow PWA

## 📋 Checklist de Testing Móvil

### ✅ Funcionalidad Básica

#### Carga de Imágenes

- [ ] Seleccionar imagen desde galería
- [ ] Imagen se optimiza automáticamente (verifica en consola si es >1024px)
- [ ] Mensaje de "Optimizando imagen..." aparece brevemente
- [ ] Imagen carga correctamente en el editor
- [ ] Navegación de Home → Editor funciona

#### Nueva Interfaz Móvil (v2.1.0)

- [ ] **MobileTopBar** visible (≤768px viewport)
- [ ] **Menú hamburguesa** (esquina superior izquierda) abre MenuDrawer
- [ ] **Título centrado** muestra "PixFlow" o nombre de herramienta activa
- [ ] **Botón Aplicar** (esquina superior derecha) solo visible cuando hay cambios pendientes
- [ ] **MenuDrawer** se desliza desde la izquierda con animación
- [ ] **Overlay oscuro** detrás del drawer (click para cerrar)
- [ ] **Secciones del menú**:
  - [ ] Edición: Undo/Redo con estados habilitado/deshabilitado correctos
  - [ ] Imagen: Cargar nueva imagen, Reset
  - [ ] Preferencias: Cambiar tema, Selector de idioma
  - [ ] Salir: Botón rojo que regresa a Home
- [ ] **LanguageSelector** visible y funcional dentro del menú
- [ ] **BottomSheet** aparece en la parte inferior
- [ ] **5 iconos de herramientas** visibles en BottomSheet colapsado
- [ ] **Icono de descarga** (sexto botón) abre modal de exportación
- [ ] **Swipe up** en BottomSheet expande la herramienta seleccionada
- [ ] **Swipe down** en BottomSheet contrae/cierra herramienta
- [ ] **Drag handle** (barrita horizontal) responde al tacto
- [ ] **ZoomIndicator** aparece durante 2s al hacer zoom (esquina superior derecha)

#### Gestos Táctiles

- [ ] **Pan** - Arrastra la imagen con un dedo (mueve la vista)
- [ ] **Pinch-to-zoom** - Pellizca con dos dedos para hacer zoom in/out
- [ ] **Double-tap** - Doble toque para alternar entre zoom 2× y fit-to-screen
- [ ] Zoom suave sin lags (rango 0.01× - 8×)
- [ ] No hay scroll accidental de la página mientras se hace pan
- [ ] Los gestos NO interfieren con los controles UI
- [ ] **CRÍTICO**: Pan/zoom DESACTIVADOS cuando crop tool está activo
- [ ] Puedes arrastrar los handles de crop sin que se active pan

#### Controles de Zoom

- [ ] ~~Botones `+` y `-` funcionan~~ (solo desktop en v2.1.0)
- [ ] ~~Botón "Fit" ajusta la imagen a la pantalla~~ (solo desktop)
- [ ] ~~Botón "1:1" establece zoom 100%~~ (solo desktop)
- [ ] ~~Slider de zoom responde correctamente~~ (solo desktop)
- [ ] **ZoomIndicator** muestra porcentaje correcto
- [ ] **ZoomIndicator** desaparece después de 2 segundos
- [ ] Double-tap funciona como alternativa a controles desktop

### 🛠️ Herramientas de Edición

#### ✂️ Crop (Recorte)

- [ ] Tocar icono de **Recortar** en BottomSheet
- [ ] BottomSheet se expande automáticamente
- [ ] **Crop area inicializada al 100%** de la imagen automáticamente
- [ ] Selector de área aparece sobre la imagen
- [ ] **Hint**: "Arrastra los bordes para seleccionar el área a recortar"
- [ ] Puedes ajustar las esquinas y bordes
- [ ] **Pan y zoom DESACTIVADOS** (no puedes mover la imagen mientras crops)
- [ ] Botón "Cancelar" cierra herramienta y restaura vista
- [ ] Botón "Aplicar" ejecuta el recorte
- [ ] Imagen recortada se muestra correctamente
- [ ] **NO crashea en iPhone** (esto era crítico)
- [ ] Undo funciona correctamente
- [ ] Mensaje informativo NO aparece (removido en v2.1.0 por redundante)

#### 📏 Resize (Redimensionar)

- [ ] Tocar icono de **Redimensionar** en BottomSheet
- [ ] BottomSheet se expande mostrando controles
- [ ] **Inputs compactos**: Ancho y Alto en la misma fila
- [ ] Campos de ancho/alto aceptan input numérico
- [ ] **Checkbox "Mantener proporción"** con min-height 44px
- [ ] Candado mantiene proporción de aspecto
- [ ] Valores se actualizan correctamente al cambiar uno (si proporción activa)
- [ ] Botones "Cancelar" y "Aplicar" son touch-friendly (min-height 48px)
- [ ] Aplicar redimensiona la imagen
- [ ] Undo restaura tamaño original
- [ ] **NO hay scroll horizontal** en inputs

#### 🔄 Transform (Transformar)

- [ ] Tocar icono de **Rotar** en BottomSheet
- [ ] BottomSheet se expande mostrando controles
- [ ] **Sección "Rotar"** con 3 botones:
  - [ ] `-90°` con icono `IconRotateClockwise` volteado (`scaleX(-1)`)
  - [ ] `90°` con icono `IconRotateClockwise`
  - [ ] `180°` con icono `IconRotate`
- [ ] **Sección "Voltear"** con 2 botones:
  - [ ] Horizontal con icono `IconFlipHorizontal`
  - [ ] Vertical con icono `IconFlipVertical`
- [ ] **Iconos Tabler** (NO caracteres Unicode)
- [ ] Grid responsive: min 120px por botón
- [ ] Rotar 90° funciona
- [ ] Rotar -90° funciona
- [ ] Rotar 180° funciona
- [ ] Voltear horizontal funciona
- [ ] Voltear vertical funciona
- [ ] Undo restaura orientación
- [ ] **Efecto visual** al presionar (scale 0.97)

#### 🎨 Adjustments (Ajustes)

- [ ] Tocar icono de **Ajustes** en BottomSheet
- [ ] BottomSheet se expande mostrando 3 sliders
- [ ] **Slider de brillo**:
  - [ ] Label "Brillo" + valor actual (ej: "50%")
  - [ ] Rango -100 a 100
  - [ ] **Gradiente visible**: #333 → #4f46e5
  - [ ] Altura: 6px
  - [ ] Thumb: 18px, púrpura (#4f46e5)
  - [ ] Hover en thumb aumenta tamaño (scale 1.1)
- [ ] **Slider de contraste** (mismo estilo)
- [ ] **Slider de saturación** (mismo estilo)
- [ ] Preview se actualiza en tiempo real
- [ ] Botones "Cancelar" y "Aplicar" visibles
- [ ] Aplicar hace permanentes los cambios
- [ ] Cancelar restaura valores a 0
- [ ] **Match con sliders desktop** (gradiente, tamaño thumb)

#### 🖼️ Filters (Filtros)

- [ ] Tocar icono de **Filtros** (paleta) en BottomSheet
- [ ] BottomSheet se expande mostrando grid 2×2
- [ ] **4 filtros disponibles**:
  - [ ] Original
  - [ ] Blanco y Negro
  - [ ] Sepia
  - [ ] Invertir
- [ ] Filtro activo tiene fondo púrpura (#4f46e5)
- [ ] Preview instantáneo al seleccionar filtro
- [ ] Botones "Cancelar" y "Aplicar" visibles
- [ ] Aplicar hace permanente el filtro
- [ ] Cancelar restaura a "Original"

### 💾 Exportación y Guardado

- [ ] Tocar **icono de descarga** en BottomSheet
- [ ] Modal de exportación se abre (ExportModal)
- [ ] **Nombre de archivo** editable (sin extensión)
- [ ] Extensión mostrada a la derecha (.png, .jpeg, .webp)
- [ ] **3 formatos disponibles**:
  - [ ] PNG con icono de info (tooltip)
  - [ ] JPEG con icono de info (tooltip)
  - [ ] WebP con icono de info (tooltip)
- [ ] **Tooltips visibles** al presionar icono de info
  - [ ] Tooltip centrado en pantalla (position: fixed)
  - [ ] Z-index: 10000 (sobre modal backdrop)
  - [ ] Max-width: 90vw (responsive móvil)
  - [ ] Información detallada de cada formato
- [ ] **Slider de calidad** (solo JPEG/WebP)
  - [ ] Deshabilitado para PNG
  - [ ] Rango 1-100
  - [ ] Valor mostrado (ej: "85%")
- [ ] **Tamaño estimado** se actualiza al cambiar formato/calidad
- [ ] Botón "Cancelar" cierra modal
- [ ] Botón "Descargar" descarga archivo
- [ ] Archivo se descarga con nombre correcto
- [ ] Archivo abre correctamente en galería

### ⏪ Historial

- [ ] Undo deshace el último cambio
- [ ] Redo rehace el cambio deshecho
- [ ] Botones se habilitan/deshabilitan correctamente
- [ ] Funciona con todas las herramientas
- [ ] No pierde el historial al cambiar de herramienta

### 🌙 Tema

- [ ] Botón de tema cambia entre claro/oscuro
- [ ] Patrón de transparencia se actualiza
- [ ] Colores de UI cambian correctamente
- [ ] Tema persiste al recargar (si implementado)

### 📱 Interfaz Móvil

#### Home Page

- [ ] Logo visible y centrado
- [ ] Botón "Seleccionar imagen" es grande y táctil
- [ ] Área de drop funciona (drag & drop en móvil si browser lo soporta)
- [ ] Mensajes de error se muestran claramente
- [ ] Footer con info del autor

#### Editor - MobileTopBar (v2.1.0)

- [ ] **Altura fija**: 56px
- [ ] **Menú hamburguesa** (izquierda):
  - [ ] Icono `IconMenu2` (3 líneas horizontales)
  - [ ] Min-width/height: 44px
  - [ ] Abre MenuDrawer al tocar
- [ ] **Título centrado**:
  - [ ] Muestra "PixFlow" con icono cuando no hay herramienta activa
  - [ ] Muestra nombre de herramienta cuando está activa (ej: "Crop", "Resize")
  - [ ] Font-size: 1.125rem, peso 600
- [ ] **Botón Aplicar** (derecha):
  - [ ] Visible solo cuando `hasChanges === true`
  - [ ] Icono `IconCheck` en botón púrpura
  - [ ] Ejecuta acción de aplicar de la herramienta activa
  - [ ] Espaciador vacío (44px) cuando no hay cambios pendientes

#### Editor - MenuDrawer (v2.1.0)

- [ ] **Apertura**: Animación slide desde izquierda
- [ ] **Cierre**: Click en overlay o botón X
- [ ] **Ancho**: min(320px, 85vw) desktop, min(280px, 80vw) móvil
- [ ] **Header**:
  - [ ] Título "Menú" centrado
  - [ ] Botón X (derecha) con min 44×44px
- [ ] **Secciones**:
  - [ ] "Edición": Undo, Redo (con estados disabled correctos)
  - [ ] "Imagen": Cargar nueva imagen, Reset
  - [ ] "Preferencias": Toggle tema (luna/sol), LanguageSelector
  - [ ] Botón "Salir" en rojo (#ef4444)
- [ ] **Items de menú**:
  - [ ] Min-height: 48px
  - [ ] Iconos 20px + texto
  - [ ] Hover: background rgba(255,255,255,0.05)
  - [ ] Active: background rgba(255,255,255,0.1) + scale 0.95
- [ ] **LanguageSelector**:
  - [ ] Wrapper con padding 0.5rem 1.25rem
  - [ ] Dropdown z-index 1001 (sobre drawer z-index 999)
  - [ ] Opciones visibles al abrir
- [ ] **Scroll**: Overflow-y auto, overflow-x hidden
- [ ] **Body scroll lock**: `overflow: hidden` cuando drawer abierto

#### Editor - BottomSheet (v2.1.0)

- [ ] **Posición**: Fixed bottom, full width
- [ ] **Altura colapsado**: 100px (desktop), 90px (móvil)
- [ ] **Altura expandido**: auto, max-height 70vh (desktop), 65vh (móvil)
- [ ] **Drag handle**:
  - [ ] Barrita horizontal 40×4px, opacidad 0.5
  - [ ] Cursor grab/grabbing
  - [ ] Responsive al tacto
- [ ] **Vista colapsada**:
  - [ ] 5 iconos de herramientas + 1 descarga
  - [ ] Distribución uniforme (space-around)
  - [ ] Min-width: 52px, min-height: 52px (desktop)
  - [ ] Min-width: 48px, min-height: 48px (móvil)
  - [ ] Icono activo: fondo púrpura (#4f46e5)
  - [ ] Hover: borde púrpura
- [ ] **Vista expandida**:
  - [ ] Header con título de herramienta
  - [ ] Área de controles scrollable (max-height calc(65vh - 100px))
  - [ ] Scrollbar custom (6px, #333)
- [ ] **Swipe gestures**:
  - [ ] Swipe up (> -50px): expande si hay herramienta activa
  - [ ] Swipe down (> 50px): contrae y desactiva herramienta
- [ ] **Animación**: slideUp 0.3s ease-out al aparecer
- [ ] **Toggle herramienta**: Tap en icono activo lo desactiva

#### Editor - Canvas Area

- [ ] **Altura móvil**: `calc(100dvh - 56px - 100px)` (resta TopBar + BottomSheet)
- [ ] **BottomSheet expandido**: Canvas min-height 30vh
- [ ] **Centrado**: flex center vertical y horizontal
- [ ] **Landscape**: Altura ajustada a `calc(100dvh - 50px - 80px)`
- [ ] **Responsive**: Se adapta al expandir/contraer BottomSheet

#### Zoom Indicator (v2.1.0)

- [ ] **Posición**: Fixed, top 70px (65px móvil), right 1rem (0.75rem móvil)
- [ ] **Estilo**: Background negro semi-transparente, backdrop-filter blur
- [ ] **Contenido**: Porcentaje de zoom (ej: "150%")
- [ ] **Visibilidad**: Aparece al cambiar zoom, desaparece a los 2s
- [ ] **Animación**: Fade in/out + scale 0.9 → 1
- [ ] **Z-index**: 90 (bajo BottomSheet 95, MenuDrawer 999)
- [ ] **Solo móvil**: No se muestra en desktop (≥769px)

### 📱 PWA - Progressive Web App

#### Instalación

- [ ] Safari (iOS): opción "Añadir a pantalla de inicio" disponible
- [ ] Chrome (Android): prompt de instalación aparece
- [ ] Desktop: icono de instalación en barra de direcciones
- [ ] App se instala correctamente
- [ ] Icono correcto en launcher/home screen

#### Funcionamiento Offline

- [ ] Abre la app instalada
- [ ] Desactiva WiFi/datos móviles
- [ ] La app sigue funcionando
- [ ] Puedes editar imágenes previamente cargadas
- [ ] Service Worker cachea assets correctamente

#### Manifest

- [ ] `manifest.json` se carga sin errores (dev tools)
- [ ] Nombre de la app correcto
- [ ] Iconos de todos los tamaños disponibles
- [ ] Color de tema se aplica

### 🎯 Rendimiento

#### Optimización de Imágenes

- [ ] Fotos grandes (>1024px) se redimensionan automáticamente en móvil
- [ ] Tiempo de carga razonable (<3 segundos para imágenes grandes)
- [ ] No hay memory leaks visibles
- [ ] App responde fluidamente

#### Crop en iOS (Prueba Crítica)

- [ ] iPhone: carga foto de máxima calidad (48MP si es iPhone 15 Pro Max)
- [ ] Imagen se optimiza a 1024×1024px automáticamente
- [ ] Selecciona área de crop
- [ ] **Aplica crop SIN crashear**
- [ ] Imagen recortada se muestra
- [ ] Puedes aplicar múltiples crops seguidos
- [ ] Safari no muestra pantalla de error

### 🌐 Compatibilidad

#### Navegadores para Probar

##### iOS

- [ ] Safari (navegador principal)
- [ ] Chrome iOS (motor WebKit)
- [ ] Diferentes tamaños: iPhone SE, 14, 15 Pro Max

##### Android

- [ ] Chrome (recomendado)
- [ ] Samsung Internet
- [ ] Firefox
- [ ] Diferentes tamaños: pequeño, estándar, grande

##### Desktop

- [ ] Chrome
- [ ] Edge
- [ ] Firefox
- [ ] Safari (macOS)

### 🐛 Bugs Conocidos y Casos Edge

- [ ] Imagen extremadamente pequeña (<100px) se maneja bien
- [ ] Imagen muy grande (>20MB) muestra mensaje de error
- [ ] Zoom máximo (800%) funciona sin pixelado excesivo
- [ ] Múltiples undo/redo consecutivos no causan problemas
- [ ] Cambiar de orientación (portrait ↔ landscape) reajusta UI
- [ ] Cerrar app y reabrirla no pierde estado (si implementado)

---

## 🚀 Testing Rápido (5 minutos)

Si tienes poco tiempo, haz estas pruebas esenciales:

1. **Carga** - Sube una foto grande desde tu móvil
2. **Gestos** - Prueba pinch-to-zoom y pan
3. **Crop** - Recorta la imagen (crítico en iOS)
4. **Herramientas** - Usa al menos resize y un filtro
5. **Export** - Descarga la imagen editada
6. **PWA** - Instala la app y prueba offline

---

## 📊 Reportar Bugs

Si encuentras algún bug, por favor reporta:

1. **Dispositivo**: Modelo exacto (ej: iPhone 15 Pro Max)
2. **OS**: Versión (ej: iOS 18.1)
3. **Navegador**: Nombre y versión
4. **Pasos**: Cómo reproducir el error
5. **Esperado**: Qué debería pasar
6. **Actual**: Qué pasó realmente
7. **Screenshots**: Si es posible

---

## ✅ Criterios de Aprobación

Para considerar la PWA lista para producción, debe cumplir:

- ✅ **100%** de funcionalidad básica
- ✅ **100%** de gestos táctiles
- ✅ **90%+** de herramientas de edición (todas las principales)
- ✅ **100%** de crop en iOS (sin crashes)
- ✅ **PWA instalable** en iOS y Android
- ✅ **Funciona offline** correctamente
- ✅ **0 crasheos** críticos en dispositivos principales

---

**Última actualización**: 2 de diciembre de 2025
