# 🧪 Guía de Testing - PixFlow PWA

## 📋 Checklist de Testing Móvil

### ✅ Funcionalidad Básica

#### Carga de Imágenes

- [ ] Seleccionar imagen desde galería
- [ ] Imagen se optimiza automáticamente (verifica en consola si es >1024px)
- [ ] Mensaje de "Optimizando imagen..." aparece brevemente
- [ ] Imagen carga correctamente en el editor
- [ ] Navegación de Home → Editor funciona

#### Gestos Táctiles

- [ ] **Pan** - Arrastra la imagen con un dedo (mueve la vista)
- [ ] **Pinch-to-zoom** - Pellizca con dos dedos para hacer zoom in/out
- [ ] Zoom suave sin lags
- [ ] No hay scroll accidental de la página mientras se hace pan
- [ ] Los gestos no interfieren con los controles UI

#### Controles de Zoom

- [ ] Botones `+` y `-` funcionan
- [ ] Botón "Fit" ajusta la imagen a la pantalla
- [ ] Botón "1:1" establece zoom 100%
- [ ] Slider de zoom responde correctamente
- [ ] Todos los botones tienen tamaño táctil adecuado (≥44px)
- [ ] Fácil de presionar con el dedo

### 🛠️ Herramientas de Edición

#### ✂️ Crop (Recorte)

- [ ] Botón "Recortar" abre la herramienta
- [ ] Selector de área aparece sobre la imagen
- [ ] Puedes ajustar las esquinas y bordes
- [ ] Mensaje informativo aparece en iOS: "Las imágenes se optimizan automáticamente..."
- [ ] Botón "Aplicar" ejecuta el recorte
- [ ] Imagen recortada se muestra correctamente
- [ ] **NO crashea en iPhone** (esto era crítico)
- [ ] Undo funciona correctamente

#### 📏 Resize (Redimensionar)

- [ ] Campos de ancho/alto aceptan input
- [ ] Candado mantiene proporción de aspecto
- [ ] Valores se actualizan correctamente
- [ ] Aplicar redimensiona la imagen
- [ ] Undo restaura tamaño original

#### 🔄 Transform (Transformar)

- [ ] Rotar 90° funciona
- [ ] Rotar -90° funciona
- [ ] Rotar 180° funciona
- [ ] Voltear horizontal funciona
- [ ] Voltear vertical funciona
- [ ] Undo restaura orientación

#### 🎨 Adjustments (Ajustes)

- [ ] Slider de brillo funciona
- [ ] Slider de contraste funciona
- [ ] Slider de saturación funciona
- [ ] Preview se actualiza en tiempo real
- [ ] Aplicar hace permanentes los cambios
- [ ] Cancelar restaura valores

#### 🖼️ Filters (Filtros)

- [ ] Filtro de escala de grises
- [ ] Filtro sepia
- [ ] Filtro invertir
- [ ] Preview instantáneo
- [ ] Aplicar hace permanente el filtro

### 💾 Exportación y Guardado

- [ ] Botón "Exportar" abre modal
- [ ] Opciones de formato: PNG, JPEG, WebP
- [ ] Slider de calidad (solo JPEG/WebP)
- [ ] Botón "Descargar" funciona
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
- [ ] Área de drop funciona
- [ ] Mensajes de error se muestran claramente
- [ ] Footer con info del autor

#### Editor - TopBar

- [ ] Se adapta a pantalla móvil
- [ ] Nombre de archivo visible (puede truncarse)
- [ ] Iconos accesibles
- [ ] Menú hamburger si es necesario
- [ ] Botones de undo/redo visibles

#### Editor - ToolsPanel

- [ ] Aparece como drawer en la parte inferior
- [ ] Se puede cerrar/abrir fácilmente
- [ ] Herramientas listadas claramente
- [ ] Controles de cada herramienta accesibles
- [ ] No cubre la imagen completamente
- [ ] Botones "Aplicar" y "Cancelar" bien posicionados

#### Zoom Controls

- [ ] Posicionados en la parte superior en móvil
- [ ] Ancho completo con espacio lateral
- [ ] Botones grandes (44x44px)
- [ ] Espaciado adecuado entre elementos
- [ ] Slider con altura suficiente para touch

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

**iOS**

- [ ] Safari (navegador principal)
- [ ] Chrome iOS (motor WebKit)
- [ ] Diferentes tamaños: iPhone SE, 14, 15 Pro Max

**Android**

- [ ] Chrome (recomendado)
- [ ] Samsung Internet
- [ ] Firefox
- [ ] Diferentes tamaños: pequeño, estándar, grande

**Desktop**

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
