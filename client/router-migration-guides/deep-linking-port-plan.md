# Porting the `deep-linking` frontend work onto `edge`

## Context

The `deep-linking` branch = the `framework-mode` branch + 37 commits (`framework-mode..deep-linking`).
Those 37 commits build two things: **(a) a new LTI "deep linking" browse/select/cart mini-app**, and
**(b) a URL-driven search refactor** (facets, order, pagination, a query-context provider). We want that
work on `edge`, the branch we ship.

The two branches diverged into **different paradigms** and share almost no file tree, so a squash +
cherry-pick does not apply cleanly. This is a **manual, layered port** that reads `deep-linking` as a
reference (`git show` / `git diff framework-mode..deep-linking -- <path>`) and re-expresses each piece in
edge's idiom.

| | `edge` (target) | `deep-linking` (source) |
|---|---|---|
| Build | webpack | Vite |
| Code root | `client/src/**` | `client/app/**` |
| Router | RR7 **data mode** — route-config **objects** merged in `src/routes/createRouter.js` | RR7 **framework mode** — file-system routes exporting `loader` |
| Data | redux **`entityStore`** (`useFetch`/`dispatch(request(...))`/`select`) | **`queryApi`** in loaders, no redux |
| Styling | **emotion** (`@emotion/styled` + `@emotion/react`) | **styled-components** |
| LTI | **none — greenfield** | full mini-app |

**Decisions:**
1. Layered port onto a branch off `edge` (`deep-linking-port`). No squash/cherry-pick.
2. All ported data fetching uses edge's redux `entityStore` (not RR loaders, not `queryApi`).
3. Full scope (eventual): the LTI app **and** refactoring edge's existing frontend/project/reader search
   onto the new query-context + facet/order/pagination UX.
4. Convert all ported styling back to emotion.

**Target structure on edge** (agreed): the LTI mini-app lives under `client/src/lti/`, a peer of
`frontend/`/`reader/`/`backend/`:
- `client/src/lti/components/**` — presentational component tree (was `deep-linking:client/app/components/lti/**`).
- `client/src/lti/contexts/**` — LTI-only React contexts (SelectionContext).
- `client/src/lti/containers/**` — route/page container components (Layer 3; mirrors `frontend/containers`).
- `client/src/lti/routes.js` — the route-config object array, merged into `createRouter.js` (Layer 3).
Shared, non-LTI pieces stay in their normal homes (`hooks/`, `global/components/icon`, `config/app/locale`).

**Key scope finding — the LTI backend is greenfield on both branches.** The 37 commits make **zero** changes
to `api/`. The mini-app reuses only pre-existing endpoints (`GET /api/v1/search_results` and the
project/text/resource-collection/resource entity resources, all present on edge under `client/src/api/resources/`).
The Cart's "Add to course" button has **no handler** — the LTI 1.3 launch (JWT) and selection return are
**unbuilt and out of scope** for this port. Wire that button to a marked stub; flag the backend as a separate dependency.

---

## Layer 1 — portable pieces + emotion conversion — ✅ DONE

Relocated (path `client/app/…` → `client/src/…`):
- `contexts/SelectionContext.jsx` → `client/src/lti/contexts/SelectionContext.jsx` (+ barrel `index.js`; imported as `lti/contexts`).
- `hooks/useSearch/helpers.js` → **new** `client/src/hooks/useSearch/helpers.js` (`parseQueryFromUrl`/`serializeQueryToUrl`/`hasSearchableQuery`/`scopeToPatch`; adds `perPage`+`order`). Single source of truth for Layer 2.
- `routes/lti/search/filters.js` (pure `resolveFacets`) → `client/src/lti/containers/Search/filters.js`.
- LTI component tree (48 files) → `client/src/lti/components/**` (`Search/**`, `Cart/**`, `Detail/**`, `atomics/{Badge,BrowseButton,Icon,Message}`, `layout/{Header,Breadcrumbs}`).
- i18n: `client/src/config/app/locale/en-US/json/lti/{lti.json,index.js}` (top-level `lti` namespace), registered in `.../en-US/en-US.js`. Merged `shared/actions.json` (`clear`) and `shared/utility.json` (`placeholder_long`, `no_facets_selected`).
- Icons: ported `16/CheckCircle`, `16/Link`, `16/PlusCircle` (registered in `global/components/icon/index.js`) and `unique/DeepLinkingLogo` (registered as `DeepLinkingLogoUnique` in `global/components/icon/unique/index.js`).

Import remaps applied across the ported tree: `components/global/*`→`global/components/*`; `components/lti/*`→`lti/components/*`;
`contexts`→`lti/contexts`; `lib/utils/humps`→`utils/humps`; `lodash-es`→`lodash`; `app/components/frontend/*`→`frontend/components/*`.

**Conventions for ported code (apply in every layer):**
- **react-router:** newly-added ported files keep **bare `react-router`** (as they come from framework mode, and where
  edge lands when it moves to framework mode v7) — do NOT remap to `react-router-dom`. `react-router` is a direct edge
  dependency and on v7 exports everything these files use (`Link`, `useLocation`, `useNavigate`, `useOutletContext`,
  `Outlet`, `useParams`); `react-router-dom` is a compat re-export. Only *pre-existing* edge files that already import
  `react-router-dom` keep it.
- **Extensions:** edge's webpack has no `.jsx` in `resolve.extensions` and zero `.jsx` files — rename every ported
  `.jsx` → `.js` (imports are extensionless, so this is transparent).

New edge helper created: `client/src/hooks/useSettings/index.js` — reads the settings entity from the redux
`entityStore` (`select(requests.settings, …)`), replacing deep-linking's framework-mode `AppContext`-based `useSettings`.

**Emotion conversion:** every ported `styles.js` switched `styled-components` → `@emotion/styled` (and `css` →
`@emotion/react`). Prop-filtering applied **per component, only where a `$`-transient prop is used** — via
`transientOptions` from `helpers/emotionHelpers` (`styled("div", transientOptions)`), on: `atomics/Message` `Box`,
`atomics/Icon` `Background`, and `Detail/…/TextSection` `Row`/`Label`/`AddButton`. No `.attrs()` usages existed.

**Known dormant dependency:** `lti/components/Search/Results/index.jsx` and `Search/Filters/index.jsx` import
`global/components/search/query/Context`, which is created in Layer 2. These components are not yet imported by any
route, so they are not bundled and do not affect the Layer-1 build. ESLint passes on the whole ported tree.

---

## Layer 2 — search query-context refactor + migrate edge's search onto it (not started)

**Reconcile the `useSearch` collision.** `client/src/hooks/useSearch/index.js` currently does both URL parsing and
redux result-fetching (its own `useEffect` dispatches `request(searchResultsAPI.index(query), requests.rSearchResults)`
and reads back via `select`/`meta`). Deep-linking's `useSearch` is URL-only. Make edge's hook a **superset** that keeps
redux fetching but adopts deep-linking's helpers/setters/richer query shape, exposing both surfaces so no consumer breaks:
- Import the helpers from `./helpers` (delete the inlined copies).
- `searchQueryState = useMemo(() => parseQueryFromUrl(location.search), …)` — now includes `perPage`/`order`.
- Keep the redux effect + `flush` cleanup, extended to refetch on `page`/`perPage`/`order` change, dispatching `searchResultsAPI.index({ ...query, page: { number, size: perPage } })`.
- Add `setQuery(patch, path)` (resets page to 1) and `setPerPage`; keep `setPage`; keep `setQueryState` as a thin alias over `setQuery`.

Then port the query context and migrate consumers:
- Port `global/components/search/query/Context/index.jsx` (`SearchQueryProvider` + `SearchQueryControlledProvider` + `useSearchQueryContext`), `Context/hooks/useControlled`, `Context/hooks/useFacets`, new `KeywordInput`/`ScopeRadios`, and rewritten `Form.js`. Export `Provider`/`ControlledProvider` from `search/query/index.js`. (This satisfies the Layer-1 dormant import.)
- **`useFacets` rework (no loader to bypass on edge):** replace the `useNavigation()` + `window.history.replaceState` loader-bypass with a normal `setQuery({ facets: [] }, path)`; let edge's `useSearch` redux effect refetch; drive the "facets cleared" message off `resultsMeta` changes.
- **`page` shape:** deep-linking's `useControlled` uses `page:{number:1}`; edge serializes `page` as an integer — normalize in `setQuery`/`serializeQueryToUrl`.
- Migrate the three edge containers onto the context (wrap in `SearchQuery.Provider`, pass the `facets` list to the new `Form`, keep rendering results from the redux context): `frontend/containers/Search`, `frontend/containers/ProjectSearch`, `reader/containers/Search`.
- Port the differing `results/**` presentation pieces (order/pagination/perPage UX); convert their `styles.js` to emotion.

---

## Layer 3 — the LTI mini-app (not started)

New sub-app `client/src/lti/` with `client/src/lti/routes.js` merged in `createRouter.js`, sitting **outside**
frontend's `isLibrary`/`checkLibraryMode` guard:
```
// client/src/routes/createRouter.js
import ltiRoutes from "lti/routes";
const allRoutes = [...readerRoutes, ...frontendRoutes, ...backendRoutes, ...ltiRoutes];
```
Route objects (framework-mode → data-mode translation: `_layout`→parent `{element,children}`; `_index`→`{index:true}`; `$id`→`{path:":id"}`; `handle` exports → `handle`):
```
[{ path: "lti", element: <LtiLayout/>, handle:{ name:"lti" }, children: [
  { index: true, element: <LtiLanding/> },
  { path: "search", element: <LtiSearch/>, handle:{ breadcrumb:… } },
  { path: "projects/:id", element: <LtiProjectDetail/> },
  { path: "resource-collections/:id", element: <LtiResourceCollectionDetail/> },
  { path: "texts/:id", element: <LtiTextDetail/> },
]}]
```
Each container lives in `client/src/lti/containers/**` and = the ported route module **minus its `loader`/`clientLoader`**,
with fetching moved to redux `useFetch`/`dispatch(request(...))`:
- **`LtiLayout`** (`_layout.jsx`) — `SelectionProvider` + `Header` + `<Outlet/>` + `Cart`, `useDialog`, body class, head content.
- **`LtiLanding`** (`_index.jsx`) — `SearchQuery.Provider` + `SearchQuery.Form action="/lti/search"`.
- **`LtiSearch`** (`search/route.jsx`) — delete loader; use reconciled redux `useSearch`; apply `resolveFacets(location.search)` from `lti/containers/Search/filters.js` to inject LTI-scoped facets before dispatch. Keep `handle.breadcrumb`.
- **`LtiProjectDetail`** (`projects/$id.jsx`) — redux `projectsAPI.show(id)` + `.resources(id)` + `.resourceCollections(id)`; build `categories`; render `Detail type="project"`. **Adaptation:** loaders fetched *all pages*; edge's `useFetch` is single-page — replicate with a paginated loop or large `page[size]`.
- **`LtiResourceCollectionDetail`** — `resourceCollectionsAPI.show(id)` + `collectionResources(id)` (all pages).
- **`LtiTextDetail`** — `textsAPI.show(id)`; categories from `text.attributes.toc`.
- **Drop:** `lib/react-router/loaders/search.js`, `loadEntity`/`loadAllPages*`, and `queryApi-request-memoization.plan.md` (RR7-middleware specific).

**Cart / selection submission.** `SelectionContext` + `Cart` port as-is (Layer 1). Wire the "Add to course" button's
`onClick` to a `submitSelection` stub (no-op / `console.warn`) with a `TODO(lti-backend)` marker — the LTI deep-linking
return needs the greenfield backend. Do not invent an endpoint.

---

## Verification

- **Edge search regression (Layers 1–2):** run the client (`npm run watch` in `client/`). Exercise global `/search?keyword=…`
  (keyword, scope radios, facet checkboxes incl. clear-all, pagination, perPage, order), a project's `/…/search`, and the
  reader search overlay. Confirm `rSearchResults` dispatch/flush and URL-driven refetch on every change.
- **LTI mini-app (Layer 3):** no JWT gate yet, so routes are directly browsable — `/lti`, `/lti/search?keyword=…`,
  `/lti/projects/:id`, `/lti/texts/:id`, `/lti/resource-collections/:id`. Verify landing→search, result cards + Add,
  Cart population/auto-open, detail categories, breadcrumbs, and the "Add to course" stub (console warning).
