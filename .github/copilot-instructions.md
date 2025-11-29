# PixFlow - AI Agent Instructions

## Project Overview

PixFlow is a browser-based image editor built with React 19 + TypeScript + Vite. It uses destructive editing with Canvas API and client-side routing with React Router.

**Live URL**: https://pixflow.andreifaur.dev  
**Routes**: `/` (home), `/editor` (editor)

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

- `useCropTool` - Rectangle crop (react-image-crop)
- `useResizeTool` - Width/height with aspect ratio lock
- `useTransformTool` - Rotate (90°/-90°/180°), flip (H/V)
- `useAdjustmentsTool` - Brightness/contrast/saturation sliders
- `useQuickFilters` - One-click filters (grayscale/sepia/invert)

### 2. State Management

- **Global**: `ImageEditorContext` holds `file`, `objectURL`, `originalFile`
- **History**: `useEditorHistory` stores snapshots (file + natural dimensions + zoom/offset)
- **Local**: Tool hooks manage their own state (crop rect, brightness value, etc.)

### 3. GitHub Pages SPA Configuration

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
- Convert to blob with format: `canvas.toBlob(callback, "image/png")`
- Create new File from blob: `new File([blob], "name.png", { type: "image/png" })`

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
- `package.json` - Build script with 404.html copy
- `.github/workflows/deploy.yml` - CI/CD pipeline
