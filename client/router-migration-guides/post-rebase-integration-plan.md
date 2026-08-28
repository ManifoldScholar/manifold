# Post-rebase integration plan: `framework-squash-rebase`

## Context

The framework-mode migration branch was just rebased onto ~87 upstream commits (merge base `f59c464e1`, release 9.2.1). The squash commit `596fc4480` deleted `client/src/**`; upstream files touched after the branch's original base survived as delete/modify conflicts and now sit in `src/` (173 files). `src/` is fully orphaned — no vite alias resolves into it, nothing in `app/` imports it — so it is a *to-do list*, not live code.

Goal: get dev running, then fully integrate every upstream feature into framework mode, with search recreated to match upstream's finalized behavior (URL-is-truth query state, form-native submission, controlled variants for dialog/menu) using route loaders instead of redux. Then delete `src/`.

Findings that shape the plan:
- Upstream's search refactor (`c7448bc62`, `426b25917`, `325a827d0`) is **already in `app/components/global/search/**` and `app/hooks/search/*`**, byte-identical to upstream. What's stale is the branch's *wiring*: `app/hooks/useSearch/*` (old fork of helpers, missing `perPage`/`order`/`scopeToPatch`), `app/lib/react-router/loaders/search.js` (imports the stale helpers), the layout-level `SearchProvider` mounts, and the reader route (targets a removed prop API).
- Upstream's `SearchProvider` (`app/hooks/search/useSearchResults.js`) and `useFacets` still depend on `react-redux`/`actions`/`requests.gSearchResults`, none of which exist here.
- Unmigrated features with **no** `app/` counterpart: LTI deep-linking mini-app (62 files, `src/lti/**`), user-groups admin (14 files), OAuth redirect route (2 files).
- ~40 `src/` files have `app/` counterparts and may carry upstream fixes not yet in `app/` (biggest cluster: `30a341955` admin a11y pass, 27 files).

---

## Phase 0 — Get dev running (rebase damage) — ✅ done 2026-08-28

All in `app/`; verify with `yarn build` (lint won't catch these — `.eslintrc` still resolves through `src`).

1. **Conflict markers / duplicate tree.** `app/components/backend/list/EntitiesList/Entity/EntitlementRow/EntitlementRow.js` still has `<<<<<<<` markers. The whole `EntitlementRow/` dir is a rebase duplicate of the already-resolved `Entity/EntitlementRow.js` — but the resolved file imports `./helpers` from it. Move `EntitlementRow/helpers.js` up (or alongside), delete the dir. Confirm `app/components/global/form/CodeArea/darkTheme.js` fix is committed.
2. **Unaliased legacy specifiers** (14 hits, 8 files): `global/components/...` → `components/global/...`; `hoc/Authorize` → `authorize()`/`useAuthorizeRoute`. Files: `content-block/Builder/Block/index.js`, `ingestion/ingest/Log.js`, `category/List/TextsInner.js`, `authoring/TOCList/TOCEntry.js`, `EntitiesList/Entity/{UserRow,UserGroupEntitlementRow}.js`, `global/search/query/{CheckboxMixed,ScopeRadios,KeywordInput/index}.js`.
3. **`react-router-dom` → `react-router`**: `app/hooks/search/useSearch.js`, `app/hooks/search/useSearchResults.js` (rewritten in Phase 1 anyway).
4. **`react-redux` consumers** (package not declared; only present transitively):
   - `app/hooks/useSettings/index.js` — rewrite to read settings from `AppContext` (ARCHITECTURE §4). 50 importers via `hooks/index.js`; import site stays the same.
   - `app/components/global/LanguageSelect/index.js` — same treatment (settings/user from `AppContext`).
   - `app/hooks/search/useSearchResults.js`, `app/components/global/search/query/Context/hooks/useFacets/index.js` — Phase 1.
5. **`requests` not exported from `app/lib/api/index.js`** — three importers; remove the imports once redux users are gone (they only used `requests.*` keys).
6. Run `yarn dev`, fix whatever else surfaces route-by-route (frontend home, `/search`, a backend list, reader).

## Phase 1 — Search: recreate upstream behavior on loaders — ✅ done 2026-08-28 (reader overlay needs a logged-in manual check)

Keep upstream's components and context *shape* unchanged; replace the redux fetch layer with route loaders. One stack, one helpers file.

**Canonical modules:** `app/hooks/search/{useSearch,helpers}.js` and `app/components/global/search/**`.

1. **Delete `app/hooks/useSearch/`** (index, context, helpers). Remove its `SearchProvider` mount from `app/routes/_frontend/_layout.jsx:12,57`, `app/routes/read/$textId/_layout.jsx:10,69`, and both `ErrorBoundary.jsx` files. Nothing needs a layout-level search provider anymore.
2. **`app/hooks/search/useSearchResults.js`** — delete the redux `SearchProvider` (effect + `useSelector`). Keep `SearchResultsControlledProvider` + `useSearchResults`; rename/alias the controlled provider as the default `SearchResultsProvider` (it takes `results`/`resultsMeta` props — exactly what loaderData supplies). Drop `react-redux`, `actions`, `requests`, `utils/entityUtils` imports.
3. **`useFacets`** — drop `useDispatch`/`flush`. Keep the `facetsCleared` state and the `window.history.replaceState` URL strip (upstream intentionally avoids a router navigation here). Have `SearchResults.List` render `Empty` when the query context reports `facetsCleared` (expose it through `SearchQueryProvider`'s value) so the cleared UI shows no results without a refetch.
4. **`app/lib/react-router/loaders/search.js`** — import `parseQueryFromUrl`/`hasSearchableQuery` from `hooks/search/helpers`; build the API query as upstream does: `page: { number: page || 1, size: perPage || 20 }`, pass `order`. Keep `params` merge for route-scoped defaults.
5. **Routes:**
   - `app/routes/_frontend/search/route.jsx` — wrap the body in `SearchResultsProvider results={results} resultsMeta={meta}` from loaderData. Facets list matches upstream. (Loader already correct.)
   - `app/routes/_frontend/projects/$id/search/route.jsx` — same; loader passes `params: { project: project.id }` (from parent `loadEntity` via context/outlet or refetch by slug — check how sibling project routes get the id in loaders). Keep upstream's `setQuery({ project })` effect only if the URL must carry `project` for the Form action; otherwise the loader merge replaces it. `hideParent` on List.
   - `app/routes/read/$textId/section.$sectionId/search.jsx` — rewrite from upstream `client/src/reader/containers/Search/index.js` (`git show origin/edge:...`): `SearchQuery.Provider` + `Form facets scopes` (section/text/project scopes), default-scope effect via `scopeToPatch("text", scopes)`, `SearchResultsProvider` from loaderData, `close()` navigating to `/read/:textId/section/:sectionId`. Loader: `searchLoader` with no forced params (scope is in the URL).
6. **Dialog / Menu** (`dialog/Dialog.js`, `menu/Body.js`) already use the controlled providers and `useFetch`/`navigate`; only the import rename from step 2 applies.
7. **`hooks/index.js`** — export `useSearch` (currently only `useListSearchParams`).
8. Verify (see Verification) — `/search`, `/projects/:slug/search`, reader overlay search, header search dialog, reader search menu; pagination, perPage, order, facet toggle, clear-all-facets, scope radios, SSR of `/search?keyword=x`.

## Phase 2 — Port stranded upstream fixes from `src/` duplicates — ✅ done 2026-08-28

For each `src/` file with an `app/` counterpart, port real changes (not import-path/emotion churn). Bound the diff to what upstream changed since the branch's *original* base: find the pre-rebase ref (e.g. reflog / old `framework-mode` branch), `OLD_BASE=$(git merge-base <old-ref> origin/edge)`, then `git log -p $OLD_BASE..origin/edge -- client/src/<path>` per file. Read those hunks, apply to the `app/` file.

Priority clusters (by last-touch commit):
- `30a341955` admin a11y — 27 files (backend components, containers→routes, global form/icon, Notifications)
- `5a0031e36` unbound form errors — `Errorable`, `InputError`, `SwitchArray`, `containers/form/Form` (no `app/` counterpart for Form — check where `app/` handles unbound errors, likely `components/global/form/Form` or `FormContainer`)
- `bec4c0146` multi-drawer `OutletWithDrawers` — 13 files; `app/` already has an `OutletWithDrawers`, diff carefully
- `697eb7f8a` SAML → v7 — 10 files
- `bee6ebf84` OAI-PMH/directory settings — `project-collection/form/Fields.js`, journal Properties, `PoweredBy`
- `2ff689365` pragmatic-dnd `TOCList/Loader.js`; `1006a82cc` authorization UX in `useFetch`; `a4cc01d9d` pages Wrapper + resource-annotation Dialog
- Big-delta files worth a full diff: `Annotation/Editor` (399→135), `AvatarBuilder` (327→178), `EntitiesList/Entity/Row` (482→343), `Notifications` (229→97), `useFetch` (158→62).

Containers whose route equivalents exist (journal/project/records/settings/groups/etc.) — port behavior changes into the route module, don't resurrect the container.

## Phase 3 — User-groups admin — ✅ done 2026-08-28 (needs logged-in manual check)

Model on `app/routes/backend/records/makers/` and `records/entitlements/`. API resources (`userGroups`, `userGroupMemberships`, `userGroupEntitlements`) and row components (`UserGroupRow`, `UserGroupEntitlementRow`) are already in `app/`; `app/lib/helpers/navigation.js:109,401,455-475` already names the routes (uncomment the `entity: "userGroup"` bits).

New files under `app/routes/backend/records/user-groups/`:
- `_layout.jsx` — `loadList({ fetchFn: userGroupsAPI.index })` + `filters.js` (from `src/hoc/withFilteredLists/userGroupFilters.js` → `FILTER_PARAMS/INIT_FILTERS/INIT_SEARCH_PROPS`), `useListQueryParams`, `EntitiesList` with `UserGroupRow`, `OutletWithDrawers`.
- `new.jsx` — drawer; `formAction` + `FormContainer.Form` (from `src/backend/containers/user-groups/New.js`).
- `$id/_layout.jsx` — `loadEntity` + `authorize`, `PageHeader` utility with delete via `useConfirmation` + `useApiCallback`, secondary nav from `navigation.js` (from `user-group/Wrapper.js`).
- `$id/_index.jsx` → redirect to properties; `$id/properties.jsx` (form; component from `src/backend/components/user-group/Properties.js` → `app/components/backend/user-group/Properties.js`); `$id/users.jsx` (memberships list + add/remove); `$id/entitlements/_layout.jsx`, `entitlements/new.jsx` (from `user-group/entitlements/{List,New,Form}.js`).
- i18n: confirm `records.user_groups.*`, `modals.delete_user_group`, `notifications.user_group_delete` exist in `app/lib/i18n/locales/en-US/json/`.

## Phase 4 — OAuth redirect route — ✅ done 2026-08-28 (needs a real provider round-trip to verify Set-Cookie)

New `app/routes/_frontend/oauth.jsx` (upstream: `src/frontend/containers/OAuth/index.js`, path `oauth`). Do it as a **loader**, not a client effect: read `_oauth_auth_code` from the request cookie header, `queryApi(tokensAPI.createToken({ authCode }), context)`, then `throw redirect(path)` with the `authToken` cookie set the same way the login flow does — trace `app/routes/_frontend/login.jsx` → `actions/login.jsx` → wherever `{ authToken }` becomes a cookie, and reuse that helper (server-side `Set-Cookie` vs `BrowserCookieHelper`). Redirect map `redirect_type` → literal paths (`/journals/:slug`, `/projects/:slug`, `/project-collections/:slug`, `/read/:slug`, `/read/:parent/section/:slug`, `/projects/:parent/resource/:slug`, `/projects/:parent/resource-collection/:slug`, default `/`), `redirect_path` override, `error` param → render `FatalError` (keep styles from `OAuth/styles.js`, convert to styled-components). Delete `store/middleware/currentUserMiddleware.js` dependency.

## Phase 5 — LTI deep-linking mini-app — ✅ done 2026-08-28 (needs an LMS launch to verify end-to-end)

Upstream route tree (`src/lti/routes.js`): `lti/deep_linking` layout (`DeepLinkingProvider` + `Layout`) with `index` (Landing), `search`, `projects/:id`, `resource-collections/:id`, `texts/:id`. Handle `{ name: "lti" }`.

- **Routes** `app/routes/lti/deep_linking/`: `_layout.jsx` (provider + Layout; sits outside `_frontend`, so no frontend header — confirm root layout gives it what it needs: `HeadContent`, body class via whatever replaced `hoc/BodyClass` in `app/`), `_index.jsx`, `search.jsx` (loader = `searchLoader` with LTI defaults from `src/lti/containers/Search/filters.js`; component mounts `SearchQuery.Provider` + `SearchResultsProvider`), `projects.$id.jsx`, `resource-collections.$id.jsx`, `texts.$id.jsx` (`loadEntity` each; port containers). Remove the `SearchProvider` from the Layout — results come from the search route's loader.
- **Context** → `app/contexts/DeepLinking.js` (export from `app/contexts/index.js`). Replace `useSelector(state => state.authentication.authToken)` with `AppContext`/`routerContext` auth token; keep sessionStorage token capture.
- **Components** `src/lti/components/{Cart,Detail,Search,layout,atomics}/**` → `app/components/lti/**` (keep `patterns/` subfolder convention). Rewrite imports (`global/components` → `components/global`, `lti/` → `components/lti`/`contexts`), `lh.link` → literal paths, `react-router-dom` → `react-router`, emotion → styled-components (check each `styles.js`; the deep-linking port converted these *to* emotion for edge). `@castiron/hooks/useDialog` — verify it's a dependency in `package.json`.
- API + i18n (`app/lib/api/resources/lti.js`, `json/lti/lti.json`) and `DeepLinkingLogo` icon already exist.
- OAuth redirect types for LTI (`17e96b409`) are covered by Phase 4's map.

## Phase 6 — Cleanup

- `git rm -r src/` (after each phase's port is verified; can be done incrementally per area).
- `.eslintrc:195` — drop `"src"` from `import/resolve.moduleDirectory`; run `yarn lint` and fix newly-surfaced unresolved imports.
- `yarn depcheck`; ensure no `react-redux`/`react-router-dom` imports remain (`grep -rn "react-redux\|react-router-dom\|from \"actions\"" app`).
- Update `ARCHITECTURE.md` §9 with one short paragraph each for LTI and search-on-loaders; mark `deep-linking-port-plan.md` historical (it describes the reverse port).
- Add a project memory note: search = URL query state + route loader results + controlled providers for dialog/menu.

---

## Verification

- `yarn build` clean after Phase 0; `yarn dev` serves `/`, `/search`, a backend list, `/read/:id`.
- Search (Phase 1): `/search?keyword=foo&facets=Project&page=2&perPage=10&order=…` SSRs with results (view-source); toggling a facet resubmits and updates URL; clearing all facets strips `facets` from URL without a network request and shows empty; pagination `setPage`; project search scoped to project; reader overlay scopes (chapter/text/project) and default `text` scope; header dialog and reader menu navigate to the right search route with serialized query.
- Phase 2: spot-check each ported fix in the UI (keyboard nav in admin lists, unbound form error rendering, multi-drawer open/close).
- Phase 3: CRUD a user group, add/remove members, add entitlement; nav links resolve.
- Phase 4: hit `/oauth?redirect_type=Project&redirect_id=<slug>` with the auth cookie set → logged in + redirected; `?error=1` → FatalError.
- Phase 5: `/lti/deep_linking?lti_context=<token>` → landing; search, detail pages, cart add/remove, header/breadcrumbs; token survives reload.
- Phase 6: `yarn lint` clean; `grep` for legacy imports returns nothing; `src/` gone.
