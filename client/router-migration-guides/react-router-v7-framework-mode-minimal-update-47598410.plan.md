<!-- 47598410-cf16-4260-892d-6f794b0f1cf2 a64534e7-b24c-4054-ae09-a117244410d4 -->
# React Router v7 Framework Mode Migration Plan

## Current State

The codebase is running React Router v7 with manual route definitions:

- ✅ Using `createBrowserRouter` and `RouterProvider` for client-side
- ✅ Using `createStaticHandler`, `createStaticRouter`, and `StaticRouterProvider` for SSR
- ✅ All routes in v6/v7 format with `element`, `children`, and `handle` properties
- ✅ React Router v7 packages installed (`react-router: "7"`, `react-router-dom: "7"`)
- ✅ Routes defined in `routes-v6.js` files (frontend, backend, reader)
- ✅ Using Webpack build system
- ✅ Custom SSR setup in `entry-ssr.js`

## Framework Mode Overview

React Router v7 framework mode provides:

- **File-based routing**: Routes defined by file structure instead of manual route objects
- **Vite build system**: Uses Vite instead of Webpack
- **Automatic route generation**: Routes generated from file structure
- **Built-in SSR**: Simplified SSR setup via React Router tooling
- **Route modules**: Each route file can export `loader`, `action`, `component`, etc.

## Migration Strategy

This is a **major architectural change** that requires:

1. Restructuring route definitions from objects to file-based structure
2. Migrating from Webpack to Vite
3. Updating build configuration
4. Restructuring project directory for file-based routing
5. Updating SSR setup to use framework mode

## Phase 1: Install Framework Mode Dependencies

**Files**: `package.json`

Install React Router framework mode packages:

```json
{
  "dependencies": {
    "@react-router/dev": "^7.x.x",
    "@react-router/node": "^7.x.x",
    "@react-router/serve": "^7.x.x"
  },
  "devDependencies": {
    "vite": "^5.x.x"
  }
}
```

**Note**: May need to remove or keep existing webpack setup during transition.

## Phase 2: Create React Router Config

**File**: `react-router.config.ts` (new file in project root)

```typescript
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  // Configure build output
  buildDirectory: "dist",
  // Server entry point
  serverModuleFormat: "esm",
  // Public path
  publicPath: "/",
} satisfies Config;
```

## Phase 3: Set Up Vite Configuration

**File**: `vite.config.js` (new file, may replace webpack configs)

```javascript
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    reactRouter({
      // Configure routes directory
      routes: (defineRoute) => {
        // Define routes based on file structure
      }
    })
  ],
  // Preserve existing webpack behavior where possible
});
```

## Phase 4: Restructure Routes to File-Based

**Current Structure**:

```
src/
  frontend/
    routes-v6.js  (manual route objects)
  backend/
    routes-v6.js  (manual route objects)
  reader/
    routes-v6.js  (manual route objects)
```

**Target Structure** (Framework Mode):

```
app/
  routes/
    _index.tsx           (root route)
    frontend/
      _layout.tsx        (Frontend wrapper)
      projects/
        _layout.tsx      (ProjectsWrapper)
        $id.tsx          (ProjectDetail)
        $id.search.tsx   (ProjectSearch)
    backend/
      _layout.tsx        (Backend wrapper)
      projects/
        _layout.tsx      (ProjectsWrapper)
        $id.tsx          (ProjectDetail)
    reader/
      _layout.tsx        (Reader wrapper)
```

**Migration Approach**:

- Convert route objects to file structure
- Each route file exports a component
- Use `_layout.tsx` for wrapper components (renders `<Outlet />`)
- Use `$param.tsx` for dynamic segments (e.g., `$id.tsx` for `:id`)
- Use `.tsx` extension for nested routes (e.g., `$id.search.tsx` for `/projects/:id/search`)

**Route Metadata Handling**:

- Framework mode doesn't use `handle` property
- Route names/helpers need to be handled differently
- May need to create a route manifest or use route IDs

## Phase 5: Update Route Components

**Changes Needed**:

- Remove route object definitions from `routes-v6.js` files
- Each route becomes a file in `app/routes/`
- Route files export default component
- Layout files export default component that renders `<Outlet />`
- Loaders/actions can be exported from route files if needed

**Example Conversion**:

```javascript
// Before: routes-v6.js
{
  element: <ProjectDetail />,
  path: "/projects/:id",
  handle: {
    name: "frontendProject",
    helper: (id) => `/projects/${id}`
  }
}

// After: app/routes/frontend/projects/$id.tsx
export default function ProjectDetail() {
  // Component code
}

// Route metadata needs separate handling
```

## Phase 6: Update Build Scripts

**File**: `package.json`

Update scripts to use React Router commands:

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  }
}
```

**Note**: May need to keep webpack scripts during transition or run both systems.

## Phase 7: Update SSR Setup

**File**: `entry-ssr.js` (may be replaced by framework mode SSR)

Framework mode provides built-in SSR, but may need custom setup:

- Framework mode generates SSR entry point
- May need to adapt existing SSR logic
- Store initialization, bootstrap, etc. need to be preserved

## Phase 8: Handle Route Helpers/Metadata

**Challenge**: Current system uses `handle` property for route names and helpers via `LinkHandler`.

**Options**:

1. **Create route manifest**: Generate a mapping of route IDs to names/helpers
2. **Use route IDs**: Framework mode assigns route IDs, map these to names
3. **Hybrid approach**: Keep `LinkHandler` but adapt to use route IDs

**File**: `src/helpers/linkHandler.js` - Needs update to work with framework mode route IDs

## Phase 9: Update Imports

**Changes**:

- Update imports to use framework mode conventions
- Route components import from their file locations
- Remove `createRouter` function (routes auto-discovered)
- Update `App` component to use framework mode router

**File**: `src/global/containers/App/index.js`

Framework mode may provide different router setup - need to check v7 framework mode API.

## Phase 10: Testing and Validation

**Testing Checklist**:

- [ ] All routes accessible and render correctly
- [ ] Route parameters work (`$id` segments)
- [ ] Nested routes work (layout files)
- [ ] SSR works correctly
- [ ] Route helpers/navigation still work
- [ ] Build process works (Vite)
- [ ] Development server works
- [ ] No regressions in functionality

## Major Challenges

1. **Route Metadata**: Current `handle` system for route names/helpers doesn't map directly to framework mode
2. **Build System**: Migrating from Webpack to Vite is a major change
3. **Route Structure**: Converting 500+ route objects to file structure is significant work
4. **SSR Customization**: Existing SSR has custom bootstrap, store setup, etc.
5. **LinkHandler**: Needs adaptation to work with framework mode route IDs
6. **Incremental Migration**: Framework mode is all-or-nothing (can't mix file-based and object-based)

## Alternative: Hybrid Approach

If full framework mode is too disruptive, consider:

- Keep current route structure
- Use framework mode features where beneficial
- Gradually migrate routes to file-based structure
- However, framework mode typically requires full commitment

## Files to Create

1. `react-router.config.ts` - Framework mode configuration
2. `vite.config.js` - Vite configuration
3. `app/routes/` directory structure - File-based routes
4. Route manifest/helper mapping (if needed)

## Files to Modify

1. `package.json` - Dependencies and scripts
2. `src/global/containers/App/index.js` - Router setup
3. `src/entry-ssr.js` - SSR setup (may be replaced)
4. `src/helpers/linkHandler.js` - Route helper system
5. All route definition files - Convert to file-based structure

## Files to Remove (After Migration)

1. `src/frontend/routes-v6.js`
2. `src/backend/routes-v6.js`
3. `src/reader/routes-v6.js`
4. `src/routes/createRouter.js`
5. Webpack configuration files (if fully migrating to Vite)

## Notes

- **Scope**: This is a major architectural migration, not a minimal update
- **Risk**: High - affects routing, build system, and project structure
- **Timeline**: This would be a multi-week/multi-month effort
- **Testing**: Extensive testing required to ensure no regressions
- **Rollback**: Difficult to rollback once migrated (would need to revert all changes)

## Recommendation

Before proceeding, confirm:

1. Is file-based routing a requirement?
2. Is Vite migration acceptable?
3. How to handle route metadata/helpers in framework mode?
4. Can we maintain existing SSR customization?
5. Is incremental migration possible, or must it be all-at-once?