# PixFlow - AI Agent Instructions

## Project Overview

PixFlow is a **Progressive Web App (PWA)** image editor built with React 19 + TypeScript + Vite. It uses destructive editing with Canvas API, client-side routing with React Router, and is optimized for mobile devices with touch gestures and automatic image optimization.

**Live URL**: <https://pixflow.andreifaur.dev>  
**Routes**: `/` (home), `/editor` (editor)  
**Type**: PWA - Installable, offline-capable, mobile-optimized

## Architecture Patterns

### 1. Editor Tool System

All editing tools follow a **preview → apply → undo/redo** pattern:

- **Preview**: CSS filters applied to `<img>` element (non-destructive, instant)
- **Apply**: Canvas manipulation creates new File (destructive, permanent)
- **Undo/Redo**: Snapshots stored with `useEditorHistory` hook

**Example** (see `/src/pages/Editor/hooks/useQuickFilters.ts`):

```typescript
// 1. Preview (CSS)
const previewFilter = "grayscale(100%)";

// 2. Apply (Canvas)
ctx.filter = previewFilter;
ctx.drawImage(img, 0, 0);
canvas.toBlob((blob) => {
  const newFile = new File([blob], "filtered.png");
  setSourceFile(newFile); // Creates new snapshot
});
```

**Custom Hooks** (`/src/pages/Editor/hooks/`):

- `useCropTool` - Rectangle crop with iOS optimization (1024px mobile limit, JPEG output)
- `useResizeTool` - Width/height with aspect ratio lock
- `useTransformTool` - Rotate (90°/-90°/180°), flip (H/V)
- `useAdjustmentsTool` - Brightness/contrast/saturation sliders
- `useQuickFilters` - One-click filters (grayscale/sepia/invert)
- `useZoomPan` - Zoom and pan controls with touch gesture support (pinch-to-zoom, pan)
- `useEditorHistory` - Undo/redo with snapshots

### 2. State Management

- **Global**: `ImageEditorContext` holds `file`, `objectURL`, `originalFile`
- **History**: `useEditorHistory` stores snapshots (file + natural dimensions + zoom/offset)
- **Local**: Tool hooks manage their own state (crop rect, brightness value, etc.)

### 3. Image Optimization System

**Critical for Mobile Performance**: Automatic optimization prevents iOS Safari crashes.

**Mobile Limits** (≤768px viewport):

- Max dimensions: 1024×1024px
- Max file size: 2MB
- JPEG quality: 75%
- Format: JPEG (not PNG)

**Desktop Limits**:

- Max dimensions: 4096×4096px
- Max file size: 15MB
- JPEG quality: 92%

**Implementation** (`/src/utils/imageOptimization.ts`):

```typescript
export async function optimizeImageForDevice(file: File): Promise<File> {
  const isMobile = isMobileDevice();
  const limits = isMobile ? DEFAULT_MOBILE_OPTIONS : DEFAULT_DESKTOP_OPTIONS;
  // ... resize + JPEG compression
}
```

**Integration Points**:

- `ImageUploader.tsx` - Auto-optimizes on upload
- `useCropTool.ts` - Enforces limits on crop output
- Detection: User agent + viewport width

### 4. Touch Gesture System

**Gestures Supported**:

- **Pinch-to-zoom**: Two-finger distance calculation
- **Pan**: Single-finger drag
- **Tap**: Standard button interaction

**Implementation** (`useZoomPan.ts`):

```typescript
const getTouchDistance = (touches: React.TouchList): number => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (e.touches.length === 2 && touchStateRef.current) {
    const newDistance = getTouchDistance(e.touches);
    const scale = newDistance / touchStateRef.current.distance;
    setZoom((prevZoom) => clamp(prevZoom * scale, 0.01, 8));
  }
};
```

**UI Guidelines**:

- Minimum button size: 44×44px (iOS/Android guidelines)
- Touch targets: Adequate spacing (0.6rem minimum)
- Prevent scroll interference: `e.preventDefault()` on touch events

### 5. Progressive Web App (PWA)

**Service Worker** (`/public/sw.js`):

- Cache-first strategy for static assets
- Offline functionality
- Version-based cache management

**Web Manifest** (`/public/manifest.json`):

- 9 icon sizes (72×72 to 512×512)
- Theme color: `#4f46e5`
- Display: standalone
- Start URL: `/`

**Installation**:

- iOS: "Add to Home Screen" from Safari share menu
- Android: Install prompt in Chrome
- Desktop: Install icon in address bar

**Meta Tags** (`index.html`):

```html
<meta name="theme-color" content="#4f46e5" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />
<meta name="mobile-web-app-capable" content="yes" />
```

### 6. GitHub Pages SPA Configuration

**Critical**: Build script copies `index.html` to `404.html` for client-side routing fallback.

```json
// package.json
"build": "tsc -b && vite build && cp dist/index.html dist/404.html"
```

Without this, direct access to `/editor` shows GitHub's 404 page. The `404.html` file enables React Router to handle all routes client-side.

## Code Conventions

### TypeScript

- Strict mode enabled (`"strict": true`)
- No explicit `any` types unless absolutely necessary
- Use `React.FC` for components with props
- Prefer `interface` over `type` for object shapes

### CSS Modules

- All styles use CSS Modules (`.module.css`)
- BEM-like naming: `.toolButton`, `.toolButton.active`
- Color scheme: `#4f46e5` (purple) for primary actions

### File Naming

- Components: PascalCase (`ImageUploader.tsx`)
- Hooks: camelCase with `use` prefix (`useZoomPan.ts`)
- Utilities: camelCase (`number.ts`)

## Critical Workflows

### Adding a New Tool

1. Create hook in `/src/pages/Editor/hooks/useTOOLNAME.ts`
2. Return: `{ previewFilter, apply, cancel, hasChanges }`
3. Integrate in `Editor.tsx`: import hook, pass to `ToolsPanel`, handle `activeTool` state
4. Add UI in `ToolsPanel.tsx` with appropriate controls
5. **Always** call `history.saveSnapshot()` in `onBeforeApply` callback

### Canvas Operations

- Always use `naturalWidth`/`naturalHeight` (not rendered dimensions)
- Set canvas size before drawing: `canvas.width = targetWidth`
- **Mobile-specific**: Enforce dimension limits (1024px max) before canvas operations
- **Format optimization**: Use JPEG instead of PNG for photos (60-80% size reduction)
- Convert to blob with format: `canvas.toBlob(callback, "image/jpeg", quality)`
- Create new File from blob: `new File([blob], "name.jpg", { type: "image/jpeg" })`
- **Memory management**: Call `ctx.clearRect()` after operations on mobile

### Deployment

1. Commit changes to `main` branch
2. GitHub Actions runs `.github/workflows/deploy.yml`
3. Build outputs to `dist/` (includes `index.html` copy to `404.html`)
4. Deploy to GitHub Pages with CNAME file (`pixflow.andreifaur.dev`)
5. Health check validates `health.json` with updated timestamp

## Common Pitfalls

❌ **Don't** modify image without saving snapshot first  
✅ **Do** call `history.saveSnapshot()` in `onBeforeApply`

❌ **Don't** use `window.location.href` for navigation  
✅ **Do** use React Router's `navigate()` hook

❌ **Don't** forget to revoke object URLs  
✅ **Do** use cleanup in `useEffect` return: `URL.revokeObjectURL(url)`

❌ **Don't** apply filters directly to canvas without preview  
✅ **Do** preview with CSS first, then apply to canvas on user confirmation

❌ **Don't** use terminal commands for database operations  
✅ **Do** use MCP tools (if available) for PostgreSQL/Prisma operations

## Testing Changes

```bash
# Local development
npm run dev

# Test build (includes 404.html generation)
npm run build
npm run preview

# Verify both files exist
ls -la dist/index.html dist/404.html
```

## Key Files Reference

- `/src/pages/Editor/Editor.tsx` - Main editor component
- `/src/context/ImageEditorContext.tsx` - Global state
- `/src/pages/Editor/hooks/useEditorHistory.ts` - Undo/redo snapshots
- `/src/pages/Editor/hooks/useQuickFilters.ts` - Example tool implementation
- `/src/pages/Editor/hooks/useZoomPan.ts` - Zoom/pan with touch gestures
- `/src/utils/imageOptimization.ts` - Auto-optimization by device
- `/src/pages/Editor/components/ToolsPanel/` - Modular tool components (14 files)
- `/public/sw.js` - Service Worker for offline functionality
- `/public/manifest.json` - PWA manifest
- `package.json` - Build script with 404.html copy
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `TESTING.md` - Comprehensive testing guide (100+ checkpoints)
