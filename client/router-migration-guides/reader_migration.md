# Reader Routes Migration to React Router v7 Framework Mode

## Context

The frontend routes have been successfully migrated to React Router v7 framework mode with established patterns for loaders, error handling, auth, and data flow. The reader routes (`src/reader/`) are still on the legacy v6 pattern with client-side data fetching via `useFetch` and Redux. It's time to migrate them.

The reader route tree is small (5 routes), but the components have deep Redux entanglement — particularly the Annotatable class component for annotation CRUD. The migration should be incremental: move data fetching to loaders first, then clean up components.

## Current Reader Route Tree

```
/read/:textId                          → Reader (layout)
/read/:textId (index)                  → StartSectionRedirect
/read/:textId/search                   → Search (overlay)
/read/:textId/section/:sectionId       → Section (layout)
/read/:textId/section/:sectionId/search → Search (overlay)
```

## Approach: Two Phases

### Phase 1: Route files + loaders (this plan)

Create framework-mode route files with server-side loaders. Components continue to work mostly as-is — we replace `useFetch` with `loaderData` but leave Redux UI state (appearance, visibility filters, annotation CRUD) untouched.

### Phase 2: Component cleanup (future)

Remove remaining Redux dependencies, refactor Annotatable, migrate ReaderNotes/ReaderFullNotes. This is a much larger effort and can be done incrementally.

---

## Phase 1 Implementation

### Route config

Add to `app/routes.js`:
```js
...(await flatRoutes({ rootDirectory: "routes/reader" })),
```
And add `"reader/**"` to the catch-all's `ignoredRouteFiles`.

### Route files to create

All under `app/routes/reader/`:

#### 1. `read.$textId.jsx` — Reader layout

**Loader**: `textsAPI.show(textId)` via `loadEntity`
- If no section in the URL (i.e., request URL matches `/read/:textId` exactly), redirect to `startTextSectionId` — this replaces the old `StartSectionRedirect` component
- Also load `meAPI.readingGroups` conditionally (if reading groups enabled in settings + user logged in) — use `loadParallelLists` with settings from middleware context
- Return `{ text, readingGroups }` (readingGroups may be null)

```js
export const loader = async ({ params, request, context }) => {
  const text = await loadEntity({ context, fetchFn: () => textsAPI.show(params.textId) });

  // If no section specified, redirect to start section
  const url = new URL(request.url);
  const isBaseRoute = url.pathname === `/read/${params.textId}`
    || url.pathname === `/read/${params.textId}/`;
  if (isBaseRoute) {
    throw redirect(`/read/${params.textId}/section/${text.attributes.startTextSectionId}`);
  }

  // ... load readingGroups, return { text }
};
```

**Component**: Receives `loaderData`, renders Reader layout (Header, Toc, SearchProvider, Outlet, Footer)
- Passes `text` via `<Outlet context={text} />` (flat value, matching the groups pattern)
- Keeps Redux for: `ui.persistent.reader` (appearance), `fatalError`
- Keeps `useCurrentUser()` for persistent UI initialization
- Overlays (#group-annotations, TextMeta) stay as local state
- Imports from `react-router` (not `react-router-dom`)

No separate index route needed — the layout loader handles the redirect.

#### 2. `read.$textId.search.jsx` — Text-level search

**Loader**: None needed — search uses `SearchProvider` context from the parent layout.

**Component**: Receives `text` from `useOutletContext()`. Renders Search overlay. Minimal changes from current `Search/index.js` — just update imports from `react-router-dom` to `react-router`.

#### 3. `read.$textId.section.$sectionId.jsx` — Section

**Loader**: Load section + annotations + resources + resourceCollections in parallel via `loadParallelLists`:
```js
const results = await loadParallelLists({
  context,
  fetchFns: {
    section: () => sectionsAPI.show(params.sectionId, params.textId),
    annotations: () => annotationsAPI.forSection(params.sectionId, params.textId),
    resources: () => resourcesAPI.forSection(params.sectionId, params.textId),
    resourceCollections: () => resourceCollectionsAPI.forSection(params.sectionId, params.textId)
  }
});
```

**Component**: Receives `loaderData` with section data. Gets `text` from `useOutletContext()`. Renders section content, stylesheets, Text component, navigation.
- Passes `{ text, section }` via `<Outlet context={{ text, section }} />` for nested search
- Keeps Redux for `ui.persistent.reader` (typography for NextSection)

**Revalidation note**: Annotations have `refetchOnLogin: true` in current code. In framework mode, login triggers `revalidate()` which re-runs all loaders — this happens automatically.

#### 4. `read.$textId.section.$sectionId.search.jsx` — Section-level search

**Loader**: None needed — uses SearchProvider context.

**Component**: Same as text-level search, receives `{ text, section }` from `useOutletContext()`.

### Components to update

- `src/reader/containers/Reader/index.js` → becomes the component for `read.$textId.jsx`
  - Remove `useFetch` for text and readingGroups
  - Receive `text` from `loaderData` prop
  - Update `react-router-dom` → `react-router`
  - Keep all overlay/UI state logic

- `src/reader/containers/Section/index.js` → becomes the component for `read.$textId.section.$sectionId.jsx`
  - Remove `useFetch` for section, annotations, resources, resourceCollections
  - Receive all from `loaderData` prop
  - Update `react-router-dom` → `react-router`

- `src/reader/containers/Search/index.js` → shared by both search routes
  - Update `react-router-dom` → `react-router`
  - No data loading changes needed

- `src/reader/containers/Reader/StartSectionRedirect.js` → deleted (replaced by redirect in layout loader)

### What stays untouched (Phase 2)

- `src/reader/containers/Annotatable/` — class component with Redux annotation CRUD
- `src/reader/containers/ReaderNotes/` — uses `useFromStore` grab pattern
- `src/reader/containers/ReaderFullNotes/` — uses `useFetch` for filtered annotations
- `src/reader/components/section/Text.js` — uses Redux for visibility filters
- All Redux UI state: `ui.persistent.reader`, `ui.transitory.visibility`

### Error handling

The reader routes should use the root error boundary (no reader-specific error boundary needed initially). If a text or section 404s, `loadEntity` throws and the root boundary catches it.

## Critical files

**Create:**
- `app/routes/reader/read.$textId.jsx`
- `app/routes/reader/read.$textId.search.jsx`
- `app/routes/reader/read.$textId.section.$sectionId.jsx`
- `app/routes/reader/read.$textId.section.$sectionId.search.jsx`

**Modify:**
- `app/routes.js` — add reader flatRoutes entry
- `src/reader/containers/Reader/index.js` — remove useFetch, receive loaderData
- `src/reader/containers/Section/index.js` — remove useFetch, receive loaderData
- `src/reader/containers/Search/index.js` — update imports

**Delete (after migration):**
- `src/reader/routes-v6.js`

**Reuse (existing utilities):**
- `app/routes/utility/loaders/loadEntity.js`
- `app/routes/utility/loaders/loadParallelLists.js`
- `app/routes/utility/helpers/queryApi.js`
- `app/routes/utility/helpers/handleLoaderError.js`

## Verification

1. `/read/:textId` → redirects to first section
2. `/read/:textId/section/:sectionId` → renders section with text, annotations, resources, styles
3. `/read/:textId/search` → opens search overlay
4. `/read/:textId/section/:sectionId/search` → opens search overlay scoped to section
5. SSR: full page load renders with styles and content
6. Client navigation: navigating between sections loads new section data
7. Login/logout: annotations revalidate automatically
8. `#group-annotations` overlay still works
9. Annotation creation/selection still works (Annotatable untouched)
10. Reader appearance settings (color scheme, typography) still apply
