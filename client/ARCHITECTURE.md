# Client Architecture

A high-level orientation to how this client app is put together — file structure, data flow, routing, SSR, and the key decisions behind them. For step-by-step usage of the loader and form helpers, see [`router-migration-guides/backend_data_patterns.md`](./router-migration-guides/backend_data_patterns.md).

---

## 1. What "framework mode" means here

React Router v7 in framework mode gives us three things that, together, replace the old Redux + container/HOC stack:

1. **File-based routing** — routes are discovered from `app/routes/` rather than declared in a giant config.
2. **Loaders and actions** — data fetching and mutations live next to the route, run on both server and client, and have a built-in revalidation model.
3. **Middleware** — server code that runs once per request, before any loader, and stashes shared data on a context object.

The migration is complete — every route lives under `app/routes/` and follows the patterns in this guide. The deep-dive guides in `router-migration-guides/` are kept as historical reference and per-section playbooks.

### Active reference

[`backend_data_patterns.md`](./router-migration-guides/backend_data_patterns.md) — in-depth notes on using the loader and form helpers (`loadEntity`, `loadList`, `loadParallelLists`, `authorize`, `formAction`, `useApiCallback`) along with the drawer, bulk-action, confirmation, and delete patterns. The detailed companion to this guide.

### Historical (migration plans & logs)

The rest of `router-migration-guides/` is kept for reference but describes work that is already done. Useful for understanding *why* a piece of the codebase looks the way it does, not for ongoing development.

| Guide | What's in it |
|---|---|
| [`to_v7_framework-mode.md`](./router-migration-guides/to_v7_framework-mode.md) | POC results and the v7 framework-mode migration log. |
| [`router-loaders-migration.plan.md`](./router-migration-guides/router-loaders-migration.plan.md) | The plan for replacing `useFetch` callsites with loaders. |
| [`admin_routes_migration_plan.md`](./router-migration-guides/admin_routes_migration_plan.md) | The per-route conversion playbook used for the admin section. |
| [`reader_migration.md`](./router-migration-guides/reader_migration.md), [`reader.md`](./router-migration-guides/reader.md) | Reader-section migration plan and component assessment. |
| [`frontend_cleanup.md`](./router-migration-guides/frontend_cleanup.md) | Post-migration cleanup checklist for the public frontend. |
| [`to_v6.md`](./router-migration-guides/to_v6.md), [`to_v5_compat_and_functional_components.md`](./router-migration-guides/to_v5_compat_and_functional_components.md), [`initial_v6_plan.md`](./router-migration-guides/initial_v6_plan.md) | Earlier migration phases (v5→v6 compat, original v6 plan). |

---

## 2. Architecture at a glance

```
Request
  ↓
bootstrapMiddleware (server only)        ← reads auth cookie, fetches settings/user/pages/groups
  ↓
routerContext (per-request data bag)
  ↓
Loader / Action                          ← reads context.get(routerContext), calls queryApi
  ↓
Component                                ← receives loaderData prop, or useOutletContext()
  ↓
Mutation                                 ← route action OR useApiCallback + revalidate()
```

Four layers, each with a single responsibility:

- **Middleware** sets up per-request state. Only place that touches cookies directly.
- **Loaders/actions** are the data layer. They never render and never read URL state directly — `parseListParams` does that.
- **Components** consume `loaderData` or outlet context. They don't fetch their own primary data.
- **Mutations** either go through a route `action` (form submissions / CRUD that navigates) or `useApiCallback` (imperative calls). Both call `revalidate()` afterward to refresh loader data.

The big shift from the old codebase: there is no global store. Per-request data lives on `routerContext`; per-route data lives in the loader's return value; UI state lives in components or context providers.

---

## 3. File structure & `recursiveFlatRoutes`

### Layout of `app/routes/`

```
app/routes/
├── $.jsx                    # catch-all 404
├── _frontend/               # public pages (SSR-first, SEO-relevant)
├── backend/                 # admin (auth-gated, server-only loaders)
├── read/$textId/            # reader (one text per URL, custom state model)
└── actions/                 # standalone action endpoints (no UI)
```

Inside each section, the conventions are:

- `_layout.jsx` — wraps a directory's children in a layout route. Used for entity fetch + auth + shared chrome.
- `_index.jsx` — index route for that directory.
- `$id.jsx` / `$slug.jsx` — URL params.
- Folders prefixed with `_` (e.g. `_editor/`) are organizational — they group files without creating a layout route.
- `ErrorBoundary.jsx`, `styles.js`, `filters.js` are co-located with route files but excluded from route resolution (see `app/routes.js`).

### Why a custom route resolver

React Router's built-in flat-routes convention only globs the **top level** of `app/routes/`. We needed nested organizational folders — e.g. `backend/projects/$id/_editor/exports/` — without forcing every directory to become a layout. The custom resolver at [`app/lib/react-router/recursiveFlatRoutes.js`](./app/lib/react-router/recursiveFlatRoutes.js) walks the tree recursively, distinguishes layout files (`_layout.jsx`) from sibling route files, and emits a flat list of route configs.

It's wired up in [`app/routes.js`](./app/routes.js):

```js
import { recursiveFlatRoutes } from "./lib/react-router/recursiveFlatRoutes";

export default [
  ...(await recursiveFlatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: ["**/styles.js", "**/ErrorBoundary.jsx", "**/filters.js"]
  }))
];
```

### Gotchas

- An organizational folder (no `_layout.jsx`) is **transparent** — it doesn't add a layout to the route tree, just groups files. Only `_layout.jsx` creates nesting.
- `ignoredRouteFiles` patterns are evaluated against paths relative to `appDirectory`. If a co-located file is showing up as a route, check the glob.
- Route IDs include the full path beneath `routes/`. Don't rely on short names when matching by ID.

---

## 4. Middleware & SSR strategy

### SSR is on globally

[`react-router.config.js`](./react-router.config.js):

```js
export default {
  ssr: true,
  appDirectory: "app",
  future: {
    v8_middleware: true,
    unstable_optimizeDeps: true
  }
};
```

Every route renders on the server first. Opt-out is **per-component**, not per-route — components that can't SSR (Swagger UI, the Slate-based ContentEditor, the Ace CodeArea, drag-drop builders) are wrapped in `<ClientOnly>` ([`app/components/global/utility/ClientOnly`](./app/components/global/utility/)). The route still SSRs; the wrapped subtree skips the server render and mounts only after hydration.

`v8_middleware: true` enables React Router's middleware-runs-before-loaders model, which is what makes the bootstrap pattern (next section) work.

### `bootstrapMiddleware`

[`app/lib/middleware/bootstrap.server.js`](./app/lib/middleware/bootstrap.server.js) runs on every server request, before any loader. It:

1. Reads the `authToken` cookie from the request.
2. Builds an `ApiClient` with that token.
3. Fetches in parallel via `Promise.allSettled`: settings (always), pages (always), current user + reading groups (if authed).
4. Stashes the result on `routerContext` as `{ settings, auth: { user, authToken, readingGroups }, pages }`.

The middleware is exported from [`app/root.jsx`](./app/root.jsx):

```js
export const middleware = [bootstrapMiddleware];

export const loader = ({ context }) => context.get(routerContext);
```

Loaders read it via `context.get(routerContext)`. The result is also exposed to components through `AppContext` (see [`backend_data_patterns.md` §6](./router-migration-guides/backend_data_patterns.md)), so a deeply-nested component can `useContext(AppContext)` for settings/auth/pages without prop drilling or a loader of its own.

### Streaming SSR + styled-components

[`app/entry.server.jsx`](./app/entry.server.jsx) renders via `renderToPipeableStream` and uses styled-components' `ServerStyleSheet` to collect styles during render, then injects them at `</head>` in a custom transform stream. (The naive `interleaveWithNodeStream` approach re-parents the head and breaks meta tags; the custom injection avoids this.)

[`app/entry.client.jsx`](./app/entry.client.jsx) hydrates with `hydrateRoot(document, ...)`, wraps the tree in `StyleSheetManager` with a `shouldForwardProp` filter ([`app/lib/styled-components/shouldForwardProp.js`](./app/lib/styled-components/shouldForwardProp.js)) so styled-components doesn't pass our `$`-prefixed transient props through to the DOM. Note: **no `StrictMode`** — `@atlaskit/pragmatic-drag-and-drop` is not strict-mode safe.

### Token flow

- **Server**: cookie → middleware → `routerContext` → `queryApi` reads `context.get(routerContext)?.auth?.authToken`.
- **Client**: `queryApi` checks context first (still works for any in-flight loader call); falls back to reading the `authToken` cookie directly for client-side mutations and `clientLoader` calls.

The auth token is never thrown into a Redux store or React context for use in API calls — it's always pulled fresh from cookie or routerContext at the call site.

---

## 5. Data fetching & loaders

### Two-mode loader pattern

- **`loader`** runs on the server (and on the client during SPA navigations). Default for all routes; the only mode used in `backend/`.
- **`clientLoader`** runs only on the client, after hydration. Used selectively on frontend list routes (projects, journals, groups) so that filter/pagination changes skip the server round-trip while still getting SSR for first paint.

The pattern: pair a `loader` with a `clientLoader` built by `createListClientLoader`. On first render, the SSR `loaderData` is used directly. After hydration, the `clientLoader` takes over for subsequent visits to the same route. The `hydrateKey` option marks the SSR/client boundary so hydration mismatches can't happen.

```js
// app/routes/_frontend/projects/_index.jsx (sketch)
export const loader = ({ request, context }) =>
  loadList({ request, context, fetchFn: projectsAPI.index, options: { /* ... */ } });

export const clientLoader = createListClientLoader({
  hydrateKey: "__projectsHydrated",
  fetchFn: projectsAPI.index,
  options: { /* ... */ }
});
```

Why backend doesn't do this: backend pages are auth-gated (no SEO benefit from caching SSR HTML), every action triggers a `revalidate()` anyway, and consistent server-side fetching keeps the data flow simpler.

### Loader utilities

All in [`app/lib/react-router/loaders/`](./app/lib/react-router/loaders/). One-liners — see [`backend_data_patterns.md` §2](./router-migration-guides/backend_data_patterns.md) for full signatures.

| Utility | Purpose |
|---|---|
| `loadEntity` | Fetch a single entity. 404 on miss, redirect to login on 401. |
| `loadList` | Fetch a paginated list. Parses URL search params via `parseListParams`. |
| `loadParallelLists` | Fetch several lists in parallel; failed requests return `undefined`, not throw. |
| `authorize` | Run an ability check. Pass the **entity**, not a type string. |
| `requireLogin` | 302 to `/login?redirect_uri=...` if unauthed. |
| `parseListParams` | Pull `filters` + `pagination` out of a URL. |
| `createListClientLoader` | Build a `clientLoader` for list routes (sets `hydrate = true`). |
| `shouldRevalidate` | Default policy: revalidate on form submits and same-URL navigations. |

### Component-side data access

```
own loader      → loaderData prop
parent loader   → useOutletContext()
deep nesting    → useLoaderEntity(type) / useLoaderCollection(type)
global state    → useContext(AppContext)
```

Outlet context is **minimal and predictable per section** — typically a single entity (`project`, `group`), occasionally a pair (`{ project, collection }`), or `{ entity, closeUrl }` for drawer routes. Don't pass callbacks through context; let children call `useRevalidator()` for refresh.

---

## 6. Forms & mutations

### Preferred path: route action + `formAction` helper

For any single-mutation form, the action is a one-liner with [`formAction`](./app/lib/react-router/helpers/formAction.js):

```js
export const action = formAction({
  mutation: ({ data, params }) => projectsAPI.update(params.id, data)
});
```

Add `redirectTo: ({ result }) => "/path"` when the action should navigate; omit it when the route should stay put (React Router auto-revalidates the parent loader). Two more knobs:

- `requireAuth: true` — reject unauthenticated requests with the canonical [`unauthorizedError()`](./app/lib/react-router/helpers/unauthorizedError.js) shape.
- `errorMessage: "..."` — fallback message for errors that don't carry their own `errors` payload.

Form components hook in via `FormContainer.Form` with the `fetcher` prop; submit state, errors, and the navigation blocker all wire up automatically.

### When to write a manual action

Only when you need:
- Multi-intent dispatch (`if (intent === "delete") ...`)
- A return value other than `{ success: true }` or a redirect
- `return redirect()` (rare — see below)

Use `unauthorizedError()` for auth gating to keep response shapes consistent with `formAction`.

### Imperative mutations: `useApiCallback`

For mutations that don't navigate (inline edits, comments, deletes from a list):

```js
const destroyAnnotation = useApiCallback(annotationsAPI.destroy);
const { revalidate } = useRevalidator();

await destroyAnnotation(id);
revalidate();
```

### `throw redirect()`, never `return`

Every redirect in this codebase uses `throw redirect(...)`. This is consistent with how React Router models responses (loaders/actions throw `Response`-shaped values to short-circuit), and it unmounts the component cleanly so transitional UI doesn't flash.

See [`backend_data_patterns.md` §5](./router-migration-guides/backend_data_patterns.md) for the full mutation matrix including `useSubmit` and direct `queryApi` patterns.

---

## 7. Authorization

The model is layered, with a clear rule for which layer to use:

| Layer | When |
|---|---|
| `authorize()` in loader | The route fetches its own entity. Run after `loadEntity`. |
| `useAuthorizeRoute()` in component | The route gets its entity from a parent layout via outlet context. |
| Parent layout authorizes for whole subtree | Don't duplicate auth in children. |

The component-level hook is for sub-layouts that broaden or refine the parent's auth check. If a child needed its own server fetch *only to run a different auth check*, the hook avoids that — the child reads the entity from outlet context and authorizes client-side.

```js
// loader-level
await authorize({ request, context, ability: "update", entity: project });

// component-level (parent already provided the entity)
useAuthorizeRoute({ entity: project, ability: "manageResources" });
```

**Pass the entity, not a type string.** `authorize({ ability: "update", entity: ["journal"] })` checks "can this user update *any* journal"; `authorize({ ability: "update", entity: project })` checks "can this user update *this* journal." Almost always you want the latter.

The middleware-fetched user/auth state is also exposed on `AppContext`, so components rendering conditionally on auth (login buttons, edit links) read it from context — no prop drilling, no extra fetch.

Error responses surface through ErrorBoundaries:
- 401 → `requireLogin` issues a `redirect("/login?redirect_uri=...")`
- 403 → throws a `Response` with status 403; section ErrorBoundary catches via `isRouteErrorResponse()`

See [`backend_data_patterns.md` §2](./router-migration-guides/backend_data_patterns.md) for the decision matrix and edge cases.

---

## 8. Section conventions: frontend / backend / reader

The three sections look similar at the file level but have meaningfully different data strategies. Pick the right one before you start writing.

### `_frontend/` — public pages

- **SSR-first** for SEO and time-to-first-paint.
- List routes use `createListClientLoader` so filter/pagination changes don't round-trip to the server after hydration.
- Auth is mostly read-only — checks for personalization (favorites, joined groups) but doesn't gate access.
- Outlet context typically a single entity or a paired (project + collection).

### `backend/` — admin

- **Server loaders only.** Every action's revalidation goes through the server, keeping cache coherence simple.
- Heavy use of `_layout.jsx`: parent fetches the entity + runs `authorize`, children consume via outlet context.
- Drawer routes (`export const handle = { drawer: true }`) for new/edit overlays — see [`backend_data_patterns.md` §9](./router-migration-guides/backend_data_patterns.md).
- No `clientLoader` — there's nothing to gain from it given the data is already auth-gated and revalidated per-mutation.

### `read/$textId/` — reader

- One text per URL, with section/annotation routes nested under it.
- Minimal loader logic; the bulk of state lives in `ReaderContext` (a reducer-based context that persists to user preferences).
- Text metadata is server-loaded; section content and per-user interactive state load client-side.
- The migration here is incremental — see [`reader_migration.md`](./router-migration-guides/reader_migration.md).

---

## 9. Error boundaries

Three layers, each catching errors at a different scope:

- **Root** — [`app/RootErrorBoundary.jsx`](./app/RootErrorBoundary.jsx). Catches errors thrown above any section, including errors during root loader / middleware. Renders bare HTML with the typekit link inlined so it works even when nothing else has hydrated.
- **Per-section** — [`app/routes/_frontend/ErrorBoundary.jsx`](./app/routes/_frontend/ErrorBoundary.jsx), [`app/routes/backend/ErrorBoundary.jsx`](./app/routes/backend/ErrorBoundary.jsx), [`app/routes/read/$textId/ErrorBoundary.jsx`](./app/routes/read/$textId/ErrorBoundary.jsx). Catch thrown 4xx `Response` objects via `isRouteErrorResponse()` and render the error inside the section's chrome (header, footer, etc.).

`ErrorBoundary.jsx` files are excluded from automatic route resolution by `ignoredRouteFiles` in `app/routes.js`. Each section's `_layout.jsx` re-exports `ErrorBoundary` so React Router picks it up.

The convention for raising errors from loaders/actions:

```js
throw data("Not found", { status: 404 });
throw redirect("/login?redirect_uri=...");
```

The ErrorBoundary inspects `error.status` to decide what to render. Runtime errors (uncaught exceptions, render errors) bubble to the root boundary.

---

## 10. Cheat sheet for new contributors

Before writing a new route, work through this:

- **Section?** `_frontend/`, `backend/`, or `read/`. The patterns differ; don't mix.
- **What data does this route need?**
  - Single entity → `loadEntity`.
  - List → `loadList`. Add `clientLoader` via `createListClientLoader` if it's a frontend list with filters.
  - Multiple unrelated lists → `loadParallelLists`.
- **Does the parent already fetch what I need?** If yes, use `useOutletContext()` and skip the loader.
- **Auth?**
  - Loader fetches the entity → `authorize()` in loader.
  - Entity comes from parent → `useAuthorizeRoute()` in component.
  - Parent already authorizes the same ability → don't duplicate.
- **Mutations?**
  - Form submission → route `action` + `formAction` helper.
  - Imperative (no nav) → `useApiCallback` + `revalidate()`.
- **SSR-incompatible component?** Wrap in `<ClientOnly>`.
- **Co-located files?** `styles.js`, `filters.js`, `ErrorBoundary.jsx` are auto-excluded from route resolution; everything else under a route directory becomes a route.

When in doubt, [`backend_data_patterns.md`](./router-migration-guides/backend_data_patterns.md) has the in-depth notes on the loader and form helpers — the patterns it documents apply across all three sections.
