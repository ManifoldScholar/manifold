# Manifold Client - AI Agent Instructions

Manifold is a React-based publishing platform with SSR support. The client is migrating from Webpack to React Router v7 Framework Mode with Vite.

## Architecture Overview

### Dual Build Systems (Migration in Progress)
- **Legacy (Webpack)**: Entry at `src/entry-browser.js` / `src/entry-ssr.js`, uses Redux for state
- **Framework Mode (Vite/React Router v7)**: Entry at `app/root.jsx`, uses React context + loaders

### Key Directories
- `app/` - React Router v7 framework mode (routes, middleware, contexts)
- `src/` - Legacy codebase (components, hooks, Redux, API clients)
- `src/global/components/` - Shared components used across frontend/backend
- `src/frontend/` - Public-facing UI components
- `src/backend/` - Admin dashboard components
- `src/api/resources/` - API endpoint definitions (JSON:API pattern)

### Data Flow (Framework Mode)
1. Server middleware (`app/middleware/bootstrap.server.js`) loads settings/auth
2. Data stored in `routerContext` (React Router context)
3. Root loader reads from context, passes to `AppContext` (React context)
4. Components use hooks: `useSettings()`, `useAuthentication()`, `useCurrentUser()`

### Route File Conventions
Routes use flat file routing in `app/routes/`:
- `_frontend._index.jsx` → Homepage (`/`)
- `_frontend.projects.$id.jsx` → Project detail (`/projects/:id`)
- Loaders export: `loader`, `shouldRevalidate`
- Components receive `loaderData` prop

## Development Commands

```bash
yarn watch              # Legacy dev server (Webpack, SSR rescue mode)
yarn dev:framework      # Vite dev server (framework mode)
yarn build              # Production build (legacy)
yarn build:framework    # Vite production build
yarn lint               # ESLint check
yarn fix                # Auto-fix lint errors
```

## Code Patterns

### Styling with Emotion
Use `@emotion/styled` with `transientOptions` for props that shouldn't forward to DOM:

```javascript
import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled("div", transientOptions)`
  color: ${({ $isActive }) => $isActive ? "blue" : "gray"};
`;
```

Prefix transient props with `$` (e.g., `$isActive`, `$variant`).

### API Calls in Loaders
Use `loadEntity` or `loadParallelLists` helpers:

```javascript
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { projectsAPI } from "api";

export const loader = async ({ params, context }) => {
  return loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id)
  });
};
```

### API Calls in Components
Use `useApiCallback` hook for mutations:

```javascript
import { useApiCallback } from "hooks";
import { projectsAPI } from "api";

const updateProject = useApiCallback(projectsAPI.update);
await updateProject(id, { title: "New Title" });
```

### Icons
Use `IconComposer` with kebab-case icon names:

```javascript
import IconComposer from "global/components/utility/IconComposer";
<IconComposer icon="arrow-right-24" size={24} />
```

Icon components live in `src/global/components/icon/{size}/`.

### Authorization
Use `Authorize` component or `Authorization` helper:

```javascript
import Authorize from "hoc/Authorize";
<Authorize kind="admin" failureRedirect="/login">
  <AdminPanel />
</Authorize>
```

### Form Components
Use components from `global/components/form`:

```javascript
import Form from "global/components/form";
<Form.TextInput label="Title" name="attributes[title]" />
<Form.Switch label="Published" name="attributes[published]" />
```

## Context Providers

| Context | Purpose | Access Hook |
|---------|---------|-------------|
| `AppContext` | Settings, auth, pages | `useSettings()`, `useAuthentication()` |
| `FrontendContext` | Subjects, frontend mode | `useSubjects()`, `useFrontendModeContext()` |

## Important Conventions

- **No `__BROWSER__`/`__SERVER__` in new code** - Use `typeof window !== 'undefined'` checks
- **Prefer hooks over HOCs** - Legacy HOCs in `src/hoc/` are being deprecated
- **Redux is legacy** - New loaders should use `queryApi()` directly, not Redux actions
- **File naming**: Components use PascalCase folders, styles in `styles.js`
- **Absolute imports**: Configured via babel module-resolver (e.g., `import { useSettings } from "hooks"`)
