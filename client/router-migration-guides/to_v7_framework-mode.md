<!-- 47598410-cf16-4260-892d-6f794b0f1cf2 a64534e7-b24c-4054-ae09-a117244410d4 -->

# React Router v7 Framework Mode Migration Plan

---

## POC Results (December 2024)

### Summary

We successfully migrated the homepage to React Router v7 Framework Mode. **SSR, hydration, data loading, authentication, and login/logout are all working correctly**. The homepage is now running in "pure framework mode" - data fetching bypasses Redux entirely.

### What Worked ✅

1. **Vite dev server runs** with framework mode
2. **SSR renders the homepage** with full content and styles
3. **Emotion CSS-in-JS styles render** on SSR and persist after hydration
4. **Loaders fetch data** from the API
5. **Route components render** correctly on server and client
6. **Redux state serialization** - Server state is injected into HTML and hydrated on client
7. **Hydration succeeds** - Client takes over from server-rendered HTML
8. **TypeKit fonts load** - External font stylesheet works correctly
9. **SSR Authentication** - User auth persists across page refresh via cookie-based bootstrap

### Remaining Issues ⚠️

1. ~~**`react-uid` ID mismatches** - 59 files use `react-uid` which generates non-deterministic IDs~~ ✅ Fixed for homepage components

2. ~~**Deprecated lifecycle warning** - `UNSAFE_componentWillMount` in `SideEffect(BodyClass)`~~ ✅ Fixed

### Homepage Migration Status: ✅ COMPLETE

The homepage route (`/`) is fully migrated to React Router v7 Framework Mode with:

- Server middleware for settings + auth bootstrap
- Pure framework mode loaders (no Redux for data fetching)
- All components using context hooks
- Login/logout revalidation working
- `shouldRevalidate` optimization

---

## Phase 2: Middleware & Context Migration (December 2024)

### Summary

Migrated `manifoldBootstrap` functionality to React Router v7 middleware and React contexts. Authentication, settings, and pages are now loaded via server middleware and provided to components through React contexts, reducing Redux dependency.

### What Was Done ✅

#### 1. Created Middleware System

- **`app/middleware/bootstrap.server.js`** - Server middleware that:

  - Reads `authToken` from cookies
  - Fetches settings, user, and pages in parallel via `ApiClient`
  - Sets data into router context (`routerContext`)

- **`app/middleware/bootstrap.client.js`** - Client middleware (no-op, revalidation triggers server middleware)

- **`app/contexts.js`** - Defines consolidated contexts:
  - `routerContext` - Router context for middleware/loaders
  - `AppContext` - React context for components (settings, auth, pages, frontendMode, revalidate)

#### 2. Auth/Settings/Pages Hooks

| Hook                  | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `useSettings()`       | Access settings from `AppContext`                          |
| `usePages()`          | Access pages from `AppContext`                             |
| `useCurrentUser()`    | Get current user (uses `useAuthentication`)                |
| `useAuthentication()` | Get auth state `{ authenticated, currentUser, authToken }` |
| `useRevalidate()`     | Trigger route revalidation                                 |
| `useLogout()`         | Handle logout with revalidation                            |
| `useBodyClass()`      | Manage body classes (replaces `BodyClass` HOC)             |

**Note**: `useAuth` was deleted as redundant - use `useAuthentication` instead.

#### 3. Updated Root Loader & Component

- Root loader reads from middleware context and returns to component
- Root component provides `AppContext` to children (consolidated from multiple contexts)
- Loading state combines React Router navigation + Redux API loading

#### 4. Fixed Hydration Warnings

- **`react-uid` → `useId()`**: Replaced in `DisclosureNavigationMenu` and `SearchQueryForm`
- **`BodyClass`**: Converted from `react-side-effect` to hook-based implementation

#### 5. Auth Revalidation System

Login/logout trigger route revalidation to refresh auth state:

```javascript
// Login calls revalidate via handleAuthenticationSuccess
handleAuthenticationSuccess(dispatch, {
  authToken,
  user: res,
  setCookie: true,
  revalidate // ← Triggers middleware re-run
});

// Logout uses useLogout hook
const logout = useLogout(); // Dispatches + revalidates
```

**Note**: Navigation to a different route automatically triggers loaders. Manual revalidation is only needed when staying on the same page (e.g., login overlay, logout while already on "/").

---

## Phase 3: Pure Framework Mode & Redux Decoupling (December 2024)

### Summary

Completed migration to "pure framework mode" for the homepage - data fetching now bypasses Redux entirely using `ApiClient` directly in loaders. Consolidated contexts and hooks for cleaner architecture.

### What Was Done ✅

#### 1. Context Consolidation

**Before**: Multiple separate contexts

- `userContext`, `settingsContext` (router contexts)
- `UserContext`, `SettingsContext`, `RevalidationContext`, `FrontendModeContext` (React contexts)

**After**: Two consolidated contexts

- `routerContext` - Single router context for middleware/loaders
- `AppContext` - Single React context with `{ settings, auth, frontendMode, revalidate }`

#### 2. Hook Consolidation

**Deleted**: `useAuth` (redundant with `useAuthentication`)

**Kept**:

- `useAuthentication()` → Returns `{ authenticated, currentUser, authToken }` from `AppContext`
- `useCurrentUser()` → Convenience wrapper, returns just `currentUser`

#### 3. ApiClient Enhancements

Enhanced `ApiClient` for cleaner loader code:

```javascript
// Pass authToken in constructor - applies to all requests
const client = new ApiClient(authToken);

// Opt-in denormalization - hydrates JSON:API relationships
const client = new ApiClient(authToken, { denormalize: true });

// Clean syntax - pass API request object directly
const data = await client.call(pagesAPI.index());
const project = await client.call(projectsAPI.show(projectId));
```

**Files Modified**:

- `src/api/client.js` - Added `authToken` constructor param and `denormalize` option
- `src/api/LowLevelApiClient.js` - Added `authToken` constructor param

#### 4. Created Denormalize Helper

**`src/helpers/api/denormalize.js`** - Hydrates JSON:API relationships:

```javascript
// Input: { data: [...], included: [...] }
// Output: Array of entities with relationships resolved to actual objects
const entities = denormalize(apiResponse);
```

This replaces the entity store's hydration logic for framework mode loaders.

#### 5. Layout Route Structure

Created proper layout route for frontend pages:

```
app/routes/
├── _frontend.jsx        # Layout route (header, footer, providers)
└── _frontend._index.jsx # Homepage content
```

**`_frontend.jsx`** provides:

- `useBodyClass("browse")`
- `BreadcrumbsProvider`
- `SearchProvider`
- `Layout.Header`
- `<Outlet />` for child routes
- `Footers.FrontendFooter`

#### 6. Pure Framework Mode Loader

Homepage loader now fetches data directly without Redux:

```javascript
// app/routes/_frontend._index.jsx
export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { settings, auth } = context.get(routerContext) ?? {};

  // Create authenticated client with auto-denormalization
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  // Fetch data in parallel - clean syntax!
  const [
    journalsResult,
    featuresResult,
    projectsResult
  ] = await Promise.allSettled([
    client.call(journalsAPI.index(JOURNAL_FILTERS)),
    client.call(featuresAPI.index(FEATURES_FILTERS)),
    client.call(projectsAPI.index(PROJECT_FILTERS, PROJECT_PAGINATION))
  ]);

  // Return denormalized data directly
  return {
    journals: journalsResult.status === "fulfilled" ? journalsResult.value : [],
    features: featuresResult.status === "fulfilled" ? featuresResult.value : []
    // ...
  };
};
```

#### 7. Component Migration: withSettings → useSettings

**Problem**: `withSettings` HOC reads from Redux, but settings now come from `AppContext`.

**Solution**: Replace `withSettings(Component)` with `useSettings()` hook.

**Example** (`CollectionNavigation`):

```javascript
// Before
import withSettings from "hoc/withSettings";
function CollectionNavigation({ settings }) { ... }
export default withSettings(CollectionNavigation);

// After
import { useSettings } from "hooks";
function CollectionNavigation() {
  const settings = useSettings();
  ...
}
export default CollectionNavigation;
```

#### 7. Sign-in-up Components Migrated

Updated sign-in-up components to use hooks instead of Redux:

| Component             | Changes                                                             |
| --------------------- | ------------------------------------------------------------------- |
| `OAuthProviderButton` | `useFromStore` → `useSettings()`                                    |
| `OAuthLoginOptions`   | `useFromStore` → `useSettings()`                                    |
| `AcceptTerms`         | `useFromStore` → `useSettings()` + `usePages()`                     |
| `CreateUserForm`      | Removed Redux dispatch, uses `tokensAPI.createToken()` + revalidate |

**CreateUserForm** now authenticates directly after account creation:

```javascript
const authenticateUser = async (email, password) => {
  const response = await tokensAPI.createToken(email, password);
  const authToken = response?.meta?.authToken;
  if (authToken) {
    cookie.write("authToken", authToken);
    revalidate();
  }
};
```

### Files Created

| File                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `src/helpers/api/denormalize.js`  | JSON:API relationship hydration           |
| `src/hooks/usePages/index.js`     | Hook to access pages from AppContext      |
| `app/routes/_frontend.jsx`        | Frontend layout route                     |
| `app/routes/_frontend._index.jsx` | Homepage route with pure framework loader |

### Files Modified

| File                                                                  | Changes                                           |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `app/contexts.js`                                                     | Added `pages` to `AppContext`                     |
| `app/middleware/bootstrap.server.js`                                  | Fetches pages, uses `denormalize`                 |
| `app/root.jsx`                                                        | Provides pages in `AppContext`                    |
| `app/routes/_frontend.jsx`                                            | Uses `usePages()`, no longer fetches pages        |
| `src/api/client.js`                                                   | Added `authToken` param, `denormalize` option     |
| `src/api/LowLevelApiClient.js`                                        | Added `authToken` constructor param               |
| `src/hooks/index.js`                                                  | Exports `usePages`                                |
| `src/hooks/useAuthentication/index.js`                                | Reads from `AppContext`                           |
| `src/hooks/useCurrentUser/index.js`                                   | Uses `useAuthentication()` internally             |
| `src/hooks/useSettings/index.js`                                      | Reads from `AppContext`                           |
| `src/hooks/useFrontendModeContext/index.js`                           | Reads from `AppContext`                           |
| `src/frontend/components/CollectionNavigation/index.js`               | `withSettings` → `useSettings()`                  |
| `src/frontend/components/layout/Header/index.js`                      | Removed `pages` prop                              |
| `src/frontend/components/layout/Header/LibraryHeader/index.js`        | Uses `usePages()` hook                            |
| `src/global/components/Footers/DefaultFooter.js`                      | Uses `usePages()` hook                            |
| `src/global/components/Footers/BrandedFooter.js`                      | Uses `usePages()` hook                            |
| `src/global/components/sign-in-up/CreateUserForm/index.js`            | Direct auth, `usePages()`, removed Redux dispatch |
| `src/global/components/sign-in-up/AcceptTerms/index.js`               | `useSettings()` + `usePages()`                    |
| `src/global/components/sign-in-up/oauth/OAuthProviderButton/index.js` | `useSettings()`                                   |
| `src/global/components/sign-in-up/oauth/OAuthLoginOptions/index.js`   | `useSettings()`                                   |

### Files Deleted

| File                                     | Reason                             |
| ---------------------------------------- | ---------------------------------- |
| `src/hooks/useAuth/index.js`             | Redundant with `useAuthentication` |
| `src/frontend/containers/Home/loader.js` | Logic moved to route module        |
| `app/routes/_index.jsx`                  | Split into layout + index routes   |

### Architecture: Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Request                                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ bootstrap.server.js (middleware)                             │
│ - Reads authToken from cookie                                │
│ - Fetches settings, user, pages via ApiClient                │
│ - Sets routerContext({ settings, auth, pages })              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Route Loader (e.g., _frontend._index.jsx)                    │
│ - Reads from routerContext                                   │
│ - Creates ApiClient(authToken, { denormalize: true })        │
│ - Fetches route-specific data                                │
│ - Returns denormalized data                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ root.jsx (Root Component)                                    │
│ - Reads loaderData (settings, auth, pages from middleware)   │
│ - Provides AppContext({ settings, auth, pages, ... })        │
│ - Renders <Outlet />                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Route Component                                              │
│ - useLoaderData() for route-specific data                    │
│ - useSettings() / useCurrentUser() / usePages() for globals  │
└─────────────────────────────────────────────────────────────┘
```

### ~~TODO: Components Still Using Redux for Settings~~ ✅ DONE (Homepage)

All homepage components migrated from `withSettings` HOC to `useSettings()` hook.

### ~~TODO: Remaining Logout Callers~~ ✅ DONE

All logout callers now use `useLogout()` hook which triggers revalidation.

---

## Phase 4: Homepage Migration Complete (December 2024)

### Summary

Completed full homepage route migration to React Router v7 Framework Mode. All homepage-related components now use React contexts instead of Redux for settings and authentication.

### What Was Done ✅

#### 1. Shared `shouldRevalidate` Helper

Created shared helper to prevent unnecessary data refetching on navigation:

**`src/helpers/router/shouldRevalidate.js`**:

```javascript
export const shouldRevalidate = ({
  currentUrl,
  nextUrl,
  formAction,
  defaultShouldRevalidate
}) => {
  // Always revalidate on form submission
  if (formAction) return defaultShouldRevalidate;

  // Revalidate if staying on same URL (explicit revalidate() call)
  if (currentUrl.pathname === nextUrl.pathname) return defaultShouldRevalidate;

  // For navigations to different pages, use cached data
  return false;
};
```

Routes export it with one line:

```javascript
export { shouldRevalidate } from "helpers/router/shouldRevalidate";
```

#### 2. All Logout Callers Updated

Updated all components that call logout to use `useLogout()` hook:

| Component          | File                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| `DefaultFooter`    | `src/global/components/Footers/DefaultFooter.js`                     |
| `BrandedFooter`    | `src/global/components/Footers/BrandedFooter.js`                     |
| `NavigationMobile` | `src/global/components/navigation/Mobile.js`                         |
| `reader/Header`    | `src/reader/components/Header/index.js`                              |
| `DeleteConfirm`    | `src/frontend/components/privacy/AccountData/DeleteConfirm/index.js` |

Pattern used:

```javascript
const logout = useLogout();
const commonActionsWithLogout = { ...commonActions(dispatch), logout };
```

#### 3. Homepage Components: `withSettings` → `useSettings()`

| Component     | File                                                     |
| ------------- | -------------------------------------------------------- |
| `PoweredBy`   | `src/global/components/Footers/Parts/PoweredBy/index.js` |
| `HeadContent` | `src/global/components/HeadContent/index.js`             |

Both converted from class components to functional components.

#### 4. Homepage Components: `useFromStore` → Context Hooks

| Component          | File                                                        | Changes                              |
| ------------------ | ----------------------------------------------------------- | ------------------------------------ |
| `CookiesBanner`    | `src/global/components/CookiesBanner/index.js`              | `useCurrentUser()` + `useSettings()` |
| `CurrentUser`      | `src/global/components/CookiesBanner/CurrentUser.js`        | `useCurrentUser()` + `useSettings()` |
| `AnonymousUser`    | `src/global/components/CookiesBanner/AnonymousUser.js`      | `useSettings()`                      |
| `FormEmbedBanner`  | `src/global/components/CookiesBanner/FormEmbedBanner.js`    | `useSettings()`                      |
| `StandaloneHeader` | `src/frontend/components/layout/Header/StandaloneHeader.js` | `useSettings()`                      |

#### 5. ApiClient Syntax Improvement

Updated `client.call()` to accept request object directly:

```javascript
// Before
const req = pagesAPI.index();
await client.call(req.endpoint, req.method, req.options);

// After
await client.call(pagesAPI.index());
```

#### 6. Pages in AppContext (Not Props)

Pages are fetched once in root middleware and available via `usePages()` hook:

```javascript
// app/middleware/bootstrap.server.js
const pagesResult = await client.call(pagesAPI.index());
pages = denormalize(pagesResult);
context.set(routerContext, { settings, auth, pages });

// Components use hook directly
import { usePages } from "hooks";
const pages = usePages();
```

Components updated to use `usePages()` instead of receiving pages as props:

- `LibraryHeader`
- `DefaultFooter`
- `BrandedFooter`
- `CreateUserForm`
- `AcceptTerms`

### Files Created

| File                                     | Purpose                   |
| ---------------------------------------- | ------------------------- |
| `src/helpers/router/shouldRevalidate.js` | Shared revalidation logic |

### Files Modified

| File                                                                 | Changes                                           |
| -------------------------------------------------------------------- | ------------------------------------------------- |
| `app/root.jsx`                                                       | Exports `shouldRevalidate`, added `ErrorBoundary` |
| `app/routes/_frontend.jsx`                                           | Exports `shouldRevalidate`, passes pages as props |
| `src/api/client.js`                                                  | `call()` accepts request object directly          |
| `src/global/components/Footers/DefaultFooter.js`                     | Uses `useLogout()`                                |
| `src/global/components/Footers/BrandedFooter.js`                     | Uses `useLogout()`                                |
| `src/global/components/Footers/Parts/PoweredBy/index.js`             | Converted to functional + `useSettings()`         |
| `src/global/components/HeadContent/index.js`                         | Converted to functional + `useSettings()`         |
| `src/global/components/CookiesBanner/*.js`                           | Uses context hooks                                |
| `src/global/components/navigation/Mobile.js`                         | Uses `useLogout()`                                |
| `src/reader/components/Header/index.js`                              | Uses `useLogout()`                                |
| `src/frontend/components/layout/Header/StandaloneHeader.js`          | Uses `useSettings()`                              |
| `src/frontend/components/layout/Header/LibraryHeader/index.js`       | Accepts `pages` prop                              |
| `src/frontend/components/privacy/AccountData/DeleteConfirm/index.js` | Uses `useLogout()`                                |

---

## Phase 5: List Routes Migration (December 2024)

### Summary

Migrated all frontend list routes (projects, journals, issues, project-collections) to React Router v7 Framework Mode with a server/client loader pattern optimized for filtering and pagination.

### What Was Done ✅

#### 1. Created Shared Utilities for List Routes

| File                                                   | Purpose                                          |
| ------------------------------------------------------ | ------------------------------------------------ |
| `src/helpers/router/loaders/parseListParams.js`        | Parse URL params into filters + pagination       |
| `src/helpers/router/loaders/createListClientLoader.js` | Factory for clientLoaders with hydration pattern |
| `src/hooks/useListSearchParams/index.js`               | Hook for reading/updating filters via URL        |

**`parseListParams`** - Extracts filters and pagination from URL:

```javascript
import parseListParams from "helpers/router/loaders/parseListParams";

const { filters, pagination } = parseListParams(url, {
  defaultFilters: { standaloneModeEnforced: "false" }
});
// filters: { standaloneModeEnforced: "false", keyword: "...", subject: "..." }
// pagination: { number: 1, size: 20 }
```

**`createListClientLoader`** - Creates clientLoader with smart revalidation:

```javascript
import createListClientLoader from "helpers/router/loaders/createListClientLoader";

export const clientLoader = createListClientLoader(
  "__projectsHydrated", // Unique hydration key
  async (filters, pagination) => {
    const client = new ApiClient(null, { denormalize: true });
    const result = await client.call(projectsAPI.index(filters, pagination));
    return { projects: result ?? [], projectsMeta: result?.meta ?? null };
  },
  parseParams
);
```

Key behavior:

- **Initial hydration**: Uses `serverLoader()` to avoid duplicate fetch
- **Same URL (revalidation)**: Uses `serverLoader()` for fresh auth state (login/logout)
- **Different URL (filter change)**: Fast client-side fetch

**`useListSearchParams`** - Manages filter state via URL:

```javascript
import { useListSearchParams } from "hooks";

const { filters, setFilters } = useListSearchParams({
  defaultFilters: FILTER_RESET
});

// setFilters updates URL, which triggers clientLoader
```

#### 2. Created FrontendContext for Subjects

Subjects are fetched once in `_frontend.jsx` layout and provided via context:

```javascript
// app/contexts.js
export const FrontendContext = createReactContext({
  subjects: [],
  journalSubjects: [],
  frontendMode: {}
});

// app/routes/frontend/_frontend.jsx (layout)
export const loader = async ({ context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const [subjectsResult, journalSubjectsResult] = await Promise.allSettled([
    client.call(subjectsAPI.index({ used: true }, null, true)),
    client.call(subjectsAPI.index({ usedJournal: true }, null, true))
  ]);

  return { subjects: ..., journalSubjects: ... };
};
```

New hooks to access subjects:

| Hook                       | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `useSubjects()`            | Project subjects from FrontendContext          |
| `useJournalSubjects()`     | Journal subjects from FrontendContext          |
| `useFrontendModeContext()` | Frontend mode from FrontendContext (was Redux) |

#### 3. Routes Directory Organization

Organized routes into subdirectories using hybrid `flatRoutes` approach:

```
app/routes/
├── $.jsx                                    # Catch-all (root level)
└── frontend/                                # Frontend routes
    ├── _frontend.jsx                        # Layout with FrontendContext
    ├── _frontend._index.jsx                 # / (home)
    ├── _frontend.projects._index.jsx        # /projects
    ├── _frontend.journals._index.jsx        # /journals
    ├── _frontend.issues._index.jsx          # /issues
    └── _frontend.project-collections._index.jsx  # /project-collections
```

**`app/routes.js`**:

```javascript
import { flatRoutes } from "@react-router/fs-routes";

export default [
  // Frontend routes (auto-discovered)
  ...(await flatRoutes({ rootDirectory: "routes/frontend" })),
  // Root-level routes (catch-all)
  ...(await flatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: ["frontend/**"]
  }))
];
```

#### 4. Fixed Hydration Mismatches

Replaced `react-uid` with React 18's `useId()` in filter components:

| Component        | File                                                 |
| ---------------- | ---------------------------------------------------- |
| `Filters/Search` | `src/global/components/list/Filters/Search/index.js` |
| `Filters/Filter` | `src/global/components/list/Filters/Filter/index.js` |

#### 5. List Route Pattern

Each list route follows this pattern:

```javascript
// app/routes/frontend/_frontend.projects._index.jsx
import { useLoaderData } from "react-router";
import { ApiClient, projectsAPI } from "api";
import { routerContext } from "app/contexts";
import parseListParams from "helpers/router/loaders/parseListParams";
import createListClientLoader from "helpers/router/loaders/createListClientLoader";
import { useListFilters, useSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "helpers/router/shouldRevalidate";

const FILTER_RESET = { standaloneModeEnforced: "false" };
const parseParams = url =>
  parseListParams(url, { defaultFilters: FILTER_RESET });

// Server loader for SSR
export const loader = async ({ request, context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });
  const { filters, pagination } = parseParams(new URL(request.url));
  const result = await client.call(projectsAPI.index(filters, pagination));
  return { projects: result ?? [], projectsMeta: result?.meta ?? null };
};

// Client loader for filter/pagination changes
export const clientLoader = createListClientLoader(
  "__projectsHydrated",
  async (filters, pagination) => {
    const client = new ApiClient(null, { denormalize: true });
    const result = await client.call(projectsAPI.index(filters, pagination));
    return { projects: result ?? [], projectsMeta: result?.meta ?? null };
  },
  parseParams
);

export default function ProjectsRoute() {
  const { projects, projectsMeta } = useLoaderData();
  const subjects = useSubjects(); // From FrontendContext
  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET
  });

  const filterProps = useListFilters({
    onFilterChange: setFilters,
    initialState: filters,
    resetState: FILTER_RESET,
    options: { entityType: "project", sort: true, subjects, featured: true }
  });

  return (
    <EntityCollection.Projects
      projects={projects}
      meta={projectsMeta}
      filterProps={filterProps}
    />
  );
}
```

### Files Created

| File                                                           | Purpose                    |
| -------------------------------------------------------------- | -------------------------- |
| `src/helpers/router/loaders/parseListParams.js`                | URL → filters + pagination |
| `src/helpers/router/loaders/createListClientLoader.js`         | ClientLoader factory       |
| `src/hooks/useListSearchParams/index.js`                       | Filter state via URL       |
| `src/hooks/useSubjects/index.js`                               | Project subjects hook      |
| `src/hooks/useJournalSubjects/index.js`                        | Journal subjects hook      |
| `app/routes/frontend/_frontend.projects._index.jsx`            | Projects list route        |
| `app/routes/frontend/_frontend.journals._index.jsx`            | Journals list route        |
| `app/routes/frontend/_frontend.issues._index.jsx`              | Issues list route          |
| `app/routes/frontend/_frontend.project-collections._index.jsx` | Collections list route     |

### Files Modified

| File                                                 | Changes                                   |
| ---------------------------------------------------- | ----------------------------------------- |
| `app/contexts.js`                                    | Added `FrontendContext`                   |
| `app/routes/frontend/_frontend.jsx`                  | Subjects loader, provides FrontendContext |
| `src/hooks/index.js`                                 | Exports new hooks                         |
| `src/hooks/useFrontendModeContext/index.js`          | Reads from FrontendContext                |
| `src/global/components/list/Filters/Search/index.js` | `useUID` → `useId`                        |
| `src/global/components/list/Filters/Filter/index.js` | `useUID` → `useId`                        |
| `app/routes.js`                                      | Hybrid flatRoutes with subdirectories     |

### List Routes Migration Status

| Route               | Path                   | Status      |
| ------------------- | ---------------------- | ----------- |
| Projects            | `/projects`            | ✅ Complete |
| Journals            | `/journals`            | ✅ Complete |
| Issues              | `/issues`              | ✅ Complete |
| Project Collections | `/project-collections` | ✅ Complete |

---

## Phase 6: Reading Groups Migration (December 2024)

### Summary

Migrated all reading group routes (`/groups`, `/my/groups`, `/groups/:id/*`) to React Router v7 Framework Mode. Completed full migration of reading group components off Redux, replaced `withConfirmation` HOC with `useConfirmation` hook, and fixed hydration warnings by replacing `react-uid` with React's `useId`.

### What Was Done ✅

#### 1. Route Structure

**Index Routes Restriction**: React Router v7 index routes cannot have child routes. Restructured routes to make `edit` and `settings` siblings of the index route:

```
app/routes/frontend/
├── _frontend.groups.jsx                    # /groups (wrapper)
├── _frontend.groups._index.jsx             # /groups (list)
├── _frontend.groups.$id.jsx                # /groups/:id (wrapper)
├── _frontend.groups.$id._index.jsx         # /groups/:id (homepage)
├── _frontend.groups.$id.edit.jsx          # /groups/:id/edit (sibling, not child)
├── _frontend.groups.$id.settings.jsx      # /groups/:id/settings (sibling)
├── _frontend.groups.$id.edit.settings.jsx # /groups/:id/edit/settings (child of edit)
├── _frontend.groups.$id.annotations.jsx
├── _frontend.groups.$id.annotations.settings.jsx
├── _frontend.groups.$id.members.jsx
├── _frontend.groups.$id.members.settings.jsx
└── _frontend.groups.$id.members.$membershipId.jsx
```

#### 2. Redux Migration: Reading Group Components

Migrated all reading group components from Redux to React Router patterns:

| Component                   | Changes                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `JoinBox`                   | Redux → `useApiCallback`, `withConfirmation` → `useConfirmation` |
| `JoinGroup`                 | `withConfirmation` → `useConfirmation`                           |
| `ArchiveGroup`              | Removed `withConfirmation`, renders confirmation from hook       |
| `ReadingGroupSettings`      | Removed unnecessary `withConfirmation` HOC                       |
| `useArchiveOrActivateGroup` | Already migrated, uses `useApiCallback` + `useConfirmation`      |

**Pattern for API calls**:

```javascript
// Before (Redux)
const dispatch = useDispatch();
const fetch = request(apiCall, requestKey, options);
const result = dispatch(fetch);
result.promise.then(...);

// After (Framework Mode)
const apiCall = useApiCallback(readingGroupsAPI.show);
const result = await apiCall(params);
```

**Pattern for confirmations**:

```javascript
// Before (HOC)
import withConfirmation from "hoc/withConfirmation";
function Component({ confirm }) {
  confirm(heading, message, callback);
}
export default withConfirmation(Component);

// After (Hook)
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";
function Component() {
  const { confirm, confirmation } = useConfirmation();
  confirm({ heading, message, callback: closeDialog => {...} });
  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {/* component content */}
    </>
  );
}
```

#### 3. Removed Revalidate/Refresh Props

Components now use `useRevalidator` hook directly instead of receiving refresh callbacks:

```javascript
// Before
function Component({ refresh, onSuccess }) {
  // ...
  onSuccess(); // or refresh()
}

// After
import { useRevalidator } from "react-router";
function Component() {
  const { revalidate } = useRevalidator();
  // ...
  revalidate();
}
```

**Components updated**:

- `GroupAnnotations` - Uses `useRevalidator` directly
- `JoinBox` - Removed `onJoin` prop
- `JoinGroup` - Removed `onSuccess` prop
- `ArchiveGroup` - Removed `onArchive` prop (hook handles internally)
- `GroupsTable` - Removed `onArchive` prop
- `ReadingGroupsList` - Removed `onArchive` prop

#### 4. Fixed Hydration Warnings

Replaced `react-uid` with React's `useId` to fix server/client ID mismatches:

| Component         | File                                                                            | Change                                    |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------- |
| `Collapse`        | `src/global/components/Collapse/index.js`                                       | `useUIDSeed` → `useId`                    |
| `Collapse/Toggle` | `src/global/components/Collapse/Toggle.js`                                      | `React.isValidElement` → `isValidElement` |
| `GroupSummaryBox` | `src/frontend/components/reading-group/headings/Group/GroupSummaryBox/index.js` | `useUID` → `useId`                        |
| `DuplicatePanel`  | `src/frontend/components/reading-group/Settings/panels/composed/Duplicate.js`   | `useUIDSeed` → `useId`                    |

**Pattern**:

```javascript
// Before
import { useUIDSeed } from "react-uid";
const idSeed = useUIDSeed();
const id = idSeed("content");

// After
import { useId } from "react";
const baseId = useId();
const id = `${baseId}-content`;
```

#### 5. Removed React Imports

Removed unnecessary React imports from components (React 17+ doesn't require them for JSX):

```javascript
// Before
import React, { useState, useId } from "react";

// After
import { useState, useId } from "react";
```

#### 6. LinkHandler Replacement

Replaced `lh.link()` calls with direct React Router paths:

```javascript
// Before
import lh from "helpers/linkHandler";
<Link to={lh.link("frontendLogin")}>

// After
<Link to="/login">
```

#### 7. Shared Action for Settings

Created shared `readingGroupSettings` action for all settings routes:

**`app/routes/utility/actions/readingGroupSettings.js`**:

- Handles both `update` and `duplicate` intents
- Determines parent route from URL for redirects
- Uses `throw redirect()` for navigation (no client-side `useEffect` needed)

#### 8. Context-Based Data Sharing

Used router context to share `readingGroup` from parent to child loaders:

```javascript
// Parent route (_frontend.groups.$id.jsx)
export const loader = async ({ params, context }) => {
  const readingGroup = await fetchReadingGroup(params.id);
  context.set(readingGroupContext, readingGroup);
  return { readingGroup };
};

// Child route (_frontend.groups.$id.members.jsx)
export const loader = async ({ params, context }) => {
  let readingGroup;
  try {
    readingGroup = context.get(readingGroupContext);
  } catch {
    // Fallback: fetch directly if context not available
    const { auth } = context.get(routerContext) ?? {};
    const client = new ApiClient(auth?.authToken, { denormalize: true });
    readingGroup = await client.call(readingGroupsAPI.show(params.id));
  }
  // ...
};
```

### Files Created

| File                                                                 | Purpose                     |
| -------------------------------------------------------------------- | --------------------------- |
| `app/routes/frontend/_frontend.groups.jsx`                           | Public groups wrapper       |
| `app/routes/frontend/_frontend.groups._index.jsx`                    | Public groups list          |
| `app/routes/frontend/_frontend.groups.$id.jsx`                       | Group detail wrapper        |
| `app/routes/frontend/_frontend.groups.$id._index.jsx`                | Group homepage              |
| `app/routes/frontend/_frontend.groups.$id.edit.jsx`                  | Group homepage edit         |
| `app/routes/frontend/_frontend.groups.$id.settings.jsx`              | Homepage settings drawer    |
| `app/routes/frontend/_frontend.groups.$id.edit.settings.jsx`         | Edit settings drawer        |
| `app/routes/frontend/_frontend.groups.$id.annotations.jsx`           | Annotations route           |
| `app/routes/frontend/_frontend.groups.$id.annotations.settings.jsx`  | Annotations settings drawer |
| `app/routes/frontend/_frontend.groups.$id.members.jsx`               | Members route               |
| `app/routes/frontend/_frontend.groups.$id.members.settings.jsx`      | Members settings drawer     |
| `app/routes/frontend/_frontend.groups.$id.members.$membershipId.jsx` | Member edit drawer          |
| `app/routes/utility/actions/readingGroupSettings.js`                 | Shared settings action      |
| `app/routes/utility/loaders/authorize.js`                            | Authorization helper        |
| `app/routes/utility/loaders/loadList.js`                             | List loading helper         |
| `app/routes/utility/loaders/createListClientLoader.js`               | ClientLoader factory        |

### Files Modified

| File                                                                              | Changes                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------- |
| `src/frontend/components/reading-group/JoinBox/index.js`                          | Redux → `useApiCallback`, HOC → hook          |
| `src/frontend/components/reading-group/tables/Groups/actions/Join.js`             | HOC → hook, removed `onSuccess` prop          |
| `src/frontend/components/reading-group/tables/Groups/actions/Archive.js`          | Removed HOC, renders confirmation from hook   |
| `src/frontend/components/reading-group/tables/Groups/index.js`                    | Removed `onArchive` prop                      |
| `src/frontend/components/reading-group/Settings/index.js`                         | Removed unnecessary `withConfirmation` HOC    |
| `src/frontend/components/reading-group/hooks/useArchiveOrActivateGroup.js`        | Already migrated, uses hooks internally       |
| `src/global/components/entity/CollectionPlaceholder/patterns/AnnotationsGroup.js` | Replaced `lh.link` with `/login`              |
| `src/frontend/components/entity/Collection/patterns/GroupAnnotations.js`          | Uses `useRevalidator` directly                |
| `src/frontend/components/reading-group-list/List/index.js`                        | Removed `onArchive` and `onJoin` props        |
| `src/global/components/Collapse/index.js`                                         | `react-uid` → `useId`                         |
| `src/global/components/Collapse/Toggle.js`                                        | Removed React import, direct `isValidElement` |
| `src/global/components/Collapse/Content.js`                                       | Removed React import                          |
| `src/frontend/components/reading-group/headings/Group/GroupSummaryBox/index.js`   | `react-uid` → `useId`, removed React import   |
| `src/frontend/components/reading-group/Settings/panels/composed/Duplicate.js`     | `react-uid` → `useId`                         |

### Reading Groups Migration Status

| Route                   | Path                                | Status      |
| ----------------------- | ----------------------------------- | ----------- |
| Public Groups List      | `/groups`                           | ✅ Complete |
| My Groups List          | `/my/groups`                        | ✅ Complete |
| Group Detail (Homepage) | `/groups/:id`                       | ✅ Complete |
| Group Homepage Edit     | `/groups/:id/edit`                  | ✅ Complete |
| Group Annotations       | `/groups/:id/annotations`           | ✅ Complete |
| Group Members           | `/groups/:id/members`               | ✅ Complete |
| Member Edit             | `/groups/:id/members/:membershipId` | ✅ Complete |
| All Settings Drawers    | `*/settings`                        | ✅ Complete |

### Key Patterns Established

1. **Index routes cannot have children** - Make siblings instead
2. **Use `useRevalidator` directly** - Don't pass refresh props
3. **Replace `react-uid` with `useId`** - Fixes hydration warnings
4. **Remove React imports** - Not needed in React 17+
5. **Use router context for parent data** - Avoid re-fetching in child loaders
6. **Shared actions for similar routes** - DRY principle
7. **`useApiCallback` for client-side API calls** - Replaces Redux
8. **`useConfirmation` hook instead of HOC** - More flexible

---

## Phase 7: Simple Standalone Routes Migration (January 2025)

### Summary

Migrated 11 straightforward standalone frontend routes to React Router v7 Framework Mode. These routes are simple, single-component routes with minimal or no data fetching, making them ideal candidates for early migration.

### Routes Migrated ✅

| Route            | Path                     | Loader Required             | Action Required  | Auth Required |
| ---------------- | ------------------------ | --------------------------- | ---------------- | ------------- |
| Search           | `/search`                | ✅ (checkLibraryMode)       | ❌               | ❌            |
| Login            | `/login`                 | ❌                          | ❌               | ❌            |
| Sign Up          | `/signup`                | ❌                          | ❌               | ❌            |
| Contact          | `/contact`               | ❌                          | ✅ (form submit) | ❌            |
| Password Reset   | `/reset-password/:token` | ❌                          | ✅ (form submit) | ❌            |
| Page             | `/page/:slug`            | ✅ (fetch page)             | ❌               | ❌            |
| Subscriptions    | `/subscriptions`         | ✅ (requireLogin)           | ❌               | ✅            |
| Privacy Settings | `/privacy`               | ✅ (requireLogin)           | ❌               | ✅            |
| Data Use         | `/data-use`              | ✅ (get settings)           | ❌               | ❌            |
| Unsubscribe      | `/unsubscribe/:token`    | ✅ (unsubscribe + redirect) | ❌               | ❌            |
| API Docs         | `/docs/api`              | ✅ (fetch schema)           | ❌               | ❌            |

### Migration Patterns

#### 1. Simple Routes (No Loader/Action)

Routes that just render a component without data fetching or form submissions:

```javascript
// app/routes/frontend/_frontend.login.jsx
import LoginContainer from "frontend/containers/Login";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

export default function LoginRoute() {
  return <LoginContainer />;
}
```

#### 2. Routes with Library Mode Check

Routes that need to check if library mode is enabled:

```javascript
// app/routes/frontend/_frontend.search.jsx
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return null;
};

export default function SearchRoute() {
  return <SearchContainer />;
}
```

#### 3. Routes with Data Fetching

Routes that fetch data in the loader:

```javascript
// app/routes/frontend/_frontend.page.$slug.jsx
export const loader = async ({ params, context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  try {
    const page = await client.call(pagesAPI.show(params.slug));
    return { page };
  } catch (error) {
    return { page: null };
  }
};

export default function PageRoute({ loaderData }) {
  return <PageContainer page={loaderData?.page} />;
}
```

#### 4. Routes with Form Actions

Routes that handle form submissions:

```javascript
// app/routes/frontend/_frontend.contact.jsx
export async function action({ request, context }) {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });
  const formData = await request.formData();

  const contact = {
    email: formData.get("attributes[email]"),
    message: formData.get("attributes[message]"),
    fullName: formData.get("attributes[fullName]")
  };

  try {
    const result = await client.call(
      contactsAPI.create({ attributes: contact })
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/");
  } catch (error) {
    if (
      error instanceof Response &&
      error.status >= 300 &&
      error.status < 400
    ) {
      throw error;
    }
    return { errors: [{ detail: error.message || "Failed to send message" }] };
  }
}

export default function ContactRoute({ actionData }) {
  return <ContactContainer actionData={actionData} />;
}
```

#### 5. Routes with Auth Protection

Routes that require authentication:

```javascript
// app/routes/frontend/_frontend.subscriptions.jsx
import requireLogin from "app/routes/utility/loaders/requireLogin";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return null;
};

export default function SubscriptionsRoute() {
  return <SubscriptionsContainer />;
}
```

#### 6. Routes with Loader Redirects

Routes that perform an action and redirect:

```javascript
// app/routes/frontend/_frontend.unsubscribe.$token.jsx
export const loader = async ({ params, context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  try {
    await client.call(notificationPreferencesAPI.unsubscribe(params.token));
  } catch (error) {
    console.error("Failed to unsubscribe:", error);
  }

  throw redirect("/");
};
```

### Container Component Updates

#### Migrating from Redux to Form Actions

**Before (Redux)**:

```javascript
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";

export default function ContactContainer() {
  const dispatch = useDispatch();
  const response = useFromStore({
    path: `entityStore.responses.${requests.gContactForm}`
  });

  const sendMessage = event => {
    event.preventDefault();
    dispatch(
      request(
        contactsAPI.create({ attributes: contact }),
        requests.gContactForm
      )
    ).promise.then(() => navigate("/"));
  };

  const errors = get(response, "errors") || [];
  // ...
}
```

**After (Framework Mode)**:

```javascript
import { useSubmit } from "react-router";

export default function ContactContainer({ actionData }) {
  const submit = useSubmit();

  const sendMessage = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("attributes[email]", contact.email);
    formData.set("attributes[message]", contact.message);
    formData.set("attributes[fullName]", contact.fullName);
    submit(formData, { method: "post" });
  };

  const errors = actionData?.errors || [];
  // ...
}
```

#### Migrating from useFetch to Loader Props

**Before (useFetch hook)**:

```javascript
import { useFetch } from "hooks";
import { pagesAPI } from "api";

export default function PageContainer() {
  const { slug } = useParams();
  const { data: page } = useFetch({
    request: [pagesAPI.show, slug]
  });
  // ...
}
```

**After (Loader props)**:

```javascript
export default function PageContainer({ page }) {
  // page comes from loaderData
  // ...
}
```

#### Migrating from useFromStore to Loader Props

**Before (Redux store)**:

```javascript
import { useFromStore } from "hooks";

export default function DataUseContainer() {
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  // ...
}
```

**After (Loader props)**:

```javascript
export default function DataUseContainer({ settings }) {
  // settings comes from loaderData
  // ...
}
```

### Files Created

```
app/routes/frontend/
├── _frontend.search.jsx
├── _frontend.login.jsx
├── _frontend.signup.jsx
├── _frontend.contact.jsx
├── _frontend.reset-password.$resetToken.jsx
├── _frontend.page.$slug.jsx
├── _frontend.subscriptions.jsx
├── _frontend.privacy.jsx
├── _frontend.data-use.jsx
├── _frontend.unsubscribe.$token.jsx
└── _frontend.docs.api.jsx
```

### Files Modified

```
src/frontend/containers/
├── Contact/index.js          # Migrated to useSubmit + actionData
├── PasswordReset/index.js     # Migrated to useSubmit + actionData
├── Page/index.js              # Migrated to loader props
├── DataUse/index.js           # Migrated to loader props
├── Api/index.js               # Migrated to loader props
└── Login/index.js             # Updated imports (react-router-dom → react-router)
```

### Key Takeaways

1. **Simple routes are quick wins**: These 11 routes were migrated quickly because they follow straightforward patterns with minimal complexity.

2. **Form actions pattern**: Routes with forms benefit from server-side actions that handle validation and redirects, reducing client-side complexity.

3. **Loader props over hooks**: When data is fetched in loaders, pass it as props rather than using hooks like `useFetch` or `useFromStore`.

4. **Auth protection**: Use `requireLogin` loader utility for routes that need authentication.

5. **Library mode checks**: Use `checkLibraryMode` loader utility for routes that should only work when library mode is enabled.

---

## Next Steps: Migrating Additional Routes

### Route Migration Pattern

For list routes, use the established pattern with shared utilities:

1. **Create route file** in `app/routes/frontend/` following naming convention
2. **Export `shouldRevalidate`** from shared helper
3. **Create server `loader`** using `ApiClient` with `denormalize: true`
4. **Create `clientLoader`** using `createListClientLoader` factory
5. **Use `useListSearchParams`** for filter state management
6. **Use context hooks** (`useSubjects`, `useJournalSubjects`) for shared data

### Routes to Migrate (Priority Order)

| Route                   | Path                     | Complexity               | Status  |
| ----------------------- | ------------------------ | ------------------------ | ------- |
| ~~Projects List~~       | `/projects`              | Medium                   | ✅ Done |
| ~~Journals List~~       | `/journals`              | Medium                   | ✅ Done |
| ~~Issues List~~         | `/issues`                | Medium                   | ✅ Done |
| ~~Project Collections~~ | `/project-collections`   | Medium                   | ✅ Done |
| ~~Reading Groups~~      | `/groups`, `/my/groups`  | Medium                   | ✅ Done |
| ~~Simple Standalone~~   | `/search`, `/login`, etc | Low                      | ✅ Done |
| Project Detail          | `/projects/:slug`        | High (many child routes) | Pending |
| Journal Detail          | `/journals/:slug`        | High                     | Pending |
| Backend Routes          | `/backend/*`             | High (large subtree)     | Pending |
| Reader Routes           | `/read/*`                | High (specialized UI)    | Pending |

### Remaining Codebase Updates

1. **Replace `withSettings` HOC** in non-homepage components (~4 files remain)
2. **Replace `useFromStore` for auth/settings/pages** in non-homepage components (~40+ files)
3. **Replace remaining `react-uid`** with `useId()` (~50 files remain, ~4 fixed in reading groups)
4. **Remove Redux auth/settings reducers** once all components migrated
5. **Delete old SSR files** (`src/entry-ssr.js`, `src/servers/proxies/renderer.js`) and `ServerCookie` helper
6. **Replace `withConfirmation` HOC** with `useConfirmation` hook in remaining components
7. **Remove React imports** from components (React 17+ doesn't require them)

### Issues Resolved During POC ✅

1. **Font loading** - TypeKit fonts weren't loading because `root.jsx` didn't include the TypeKit `<link>` tags

   - **Fix**: Added TypeKit stylesheet links to `root.jsx` `<head>` section

2. **Hydration mismatches** - Redux state wasn't being passed from server to client

   - **Fix**: Inject `window.__INITIAL_STATE__` via Transform stream in `entry.server.jsx`

3. **Script tag hydration mismatch** - Rendering `<script>` in React caused server/client mismatch

   - **Fix**: Inject state script outside React tree using Node.js Transform stream

4. **SSR Cookie Authentication** - Server wasn't reading auth cookies from Fetch API Request

   - **Fix**: Bootstrap middleware reads cookies directly from Fetch API Request
   - **Fix**: `ServerCookie` simplified to Fetch API only (Express support removed)

5. **Sign-in overlay not closing** - `hideOverlay` was an empty function
   - **Fix**: Added `useDispatch` and proper `uiVisibilityActions.visibilityHide` action to `root.jsx`

### Breaking Changes Required

The following changes were needed to make the codebase Vite-compatible:

#### 1. ES Module Syntax Updates

- **`export X from "path"`** syntax (64 files) → `export { default as X } from "path"`
  - `src/api/index.js` (53 exports)
  - `src/helpers/contexts/index.js` (9 exports)
  - `src/utils/oauth/index.js` (1 export)
  - `src/config/app/locale/en-US/index.js` (1 export)
  - `src/backend/components/layout/PageHeader/utility/index.js` (1 export)

#### 2. Lodash Imports

- **`import { get } from "lodash"`** → `import get from "lodash/get"` (7 files)
- Consider switching to `lodash-es` for better tree-shaking

#### 3. CommonJS → ESM Conversions

- `src/utils/humps.js` - Converted IIFE pattern to ES modules
- `src/helpers/consoleHelpers.js` - Converted `require`/`module.exports` to ES modules
- `src/utils/string.js` - Converted `require` to `import`

#### 4. Global Variables

- `__BROWSER__` and `__SERVER__` webpack globals replaced with Vite plugin that transforms to `(typeof window !== 'undefined')` / `(typeof window === 'undefined')`

#### 5. LinkHandler

- Converted from route-extraction pattern to hardcoded helpers for framework mode compatibility
- Long-term: Should be modernized with type-safe generated helpers

### Files Created for POC

```
app/
├── root.jsx              # Root layout with HTML document structure
├── entry.server.jsx      # Server entry with store/i18n setup
├── entry.client.jsx      # Client entry with hydration
├── contexts.js           # routerContext + AppContext definitions
├── middleware/
│   ├── bootstrap.server.js  # Fetches settings, auth, pages
│   └── bootstrap.client.js  # No-op (revalidation uses server)
├── routes/
│   ├── _frontend.jsx        # Frontend layout route
│   ├── _frontend._index.jsx # Homepage with pure framework loader
│   └── $.jsx                # Catch-all for legacy routes
└── routes.js             # Route definitions

src/
├── hooks/usePages/index.js      # Hook for pages from AppContext
├── helpers/api/denormalize.js   # JSON:API relationship hydration
└── helpers/router/shouldRevalidate.js  # Shared revalidation logic

vite.config.js            # Vite config with custom plugins
react-router.config.js    # React Router framework config
```

### Vite Configuration Highlights

```javascript
// Custom plugins needed:
1. jsxInJsPlugin()        // Transform JSX in .js files (esbuild)
2. webpackGlobalsPlugin() // Replace __BROWSER__/__SERVER__
3. emotion-transform      // Babel plugin for Emotion component selectors

// Key settings:
- ssr.external: ["lodash", "redux-promise"]  // CommonJS packages
- server.proxy: { "/api": "http://localhost:13110" }  // API proxy
- define: { "process.env.*": ... }  // Environment variables
- assetsInclude: ["**/*.woff", "**/*.woff2"]  // Font assets
```

### Key Architecture Decisions

#### 1. Bootstrap in Root Loader (Not entry.server.jsx)

In React Router v7 framework mode, `getLoadContext` isn't automatically called by the Vite dev server. We solved this by running bootstrap in the root loader (`Manifold/loader.js`) instead:

```javascript
// src/global/containers/Manifold/loader.js
async function ensureBootstrap(request) {
  if (typeof window !== "undefined") return;

  let store = getStore();
  if (store?.getState()?.authentication?.authenticated) return;

  if (!store) {
    store = createStore();
    setStore(store);
  }

  const cookie = new ServerCookieHelper(request);
  const authToken = cookie.read("authToken");
  if (!authToken) return;

  await manifoldBootstrap(store.getState, store.dispatch, cookie);
}
```

This ensures bootstrap runs before any data fetching loaders execute.

#### 2. Redux State Serialization via Transform Stream

To avoid hydration mismatches, we inject `__INITIAL_STATE__` using a Node.js Transform stream rather than rendering a `<script>` tag in React:

```javascript
// app/entry.server.jsx
const injectState = new Transform({
  transform(chunk, encoding, callback) {
    const html = chunk.toString();
    if (!stateInjected && html.includes("</head>")) {
      stateInjected = true;
      const state = store.getState();
      const serialized = safeSerialize(state);
      const script = `<script>window.__INITIAL_STATE__=${serialized}</script>`;
      callback(null, html.replace("</head>", `${script}</head>`));
      return;
    }
    callback(null, chunk);
  }
});
```

#### 3. Fetch API Cookie Compatibility

The `ServerCookie` helper was simplified for Fetch API Request only (Express support removed since old SSR will be deleted):

```javascript
// src/helpers/cookie/Server.js
export default class ServerCookie {
  constructor(request) {
    this.request = request;
  }

  get parsed() {
    const cookieHeader = this.request.headers.get("cookie") || "";
    return cookie.parse(cookieHeader);
  }

  read(key) {
    return this.parsed[key];
  }
}
```

**Note**: The bootstrap middleware parses cookies directly without using `ServerCookie`. This class can be deleted when the old SSR files (`entry-ssr.js`, `renderer.js`) are removed.

### Development vs Production Build Differences

**Important**: Vite's dev server behavior is fundamentally different from Webpack:

| Aspect        | Webpack (current)             | Vite (framework mode)                  |
| ------------- | ----------------------------- | -------------------------------------- |
| Dev bundling  | Bundles all JS into one file  | No bundling - serves native ES modules |
| File requests | 1 large bundle request        | Many small file requests (normal!)     |
| Dev startup   | Slow (must bundle everything) | Fast (no bundling step)                |
| HMR           | Re-bundles changed modules    | Only reloads changed file              |
| Production    | Single optimized bundle       | Rollup-bundled optimized output        |

The many GET requests you see in dev mode are **expected**. Each `import` statement triggers a browser request for that module. This is how Vite achieves instant dev server startup.

**Production builds** (`yarn build:framework`) use Rollup to create optimized bundles similar to Webpack output.

### Recommendation

The POC is **fully successful**. SSR, hydration, authentication, and data loading all work correctly. **Migration is feasible** and can proceed incrementally.

**Next steps if proceeding:**

1. **Replace `react-uid`** with React 18's `useId()` across 59 files (medium effort, can be done incrementally)
2. **Test production build** (`yarn build:framework`) to verify Rollup bundling works
3. **Migrate remaining routes** incrementally, starting with simple ones
4. **Run both build systems in parallel** until migration is complete

**Decision factors:**

| Factor         | Proceed with Framework Mode  | Stay with Data Router    |
| -------------- | ---------------------------- | ------------------------ |
| Dev experience | Faster HMR, instant startup  | Works today, no changes  |
| Bundle size    | Better code splitting        | Already optimized        |
| Effort         | Medium (route-by-route)      | None                     |
| Risk           | Low (can rollback per-route) | None                     |
| Future-proof   | Yes (React Router direction) | May need migration later |

**Recommended approach:** Continue using both systems in parallel. Migrate routes incrementally when touching them for other reasons. No rush to complete migration.

---

## Objective: Homepage-Only Migration

Migrate **only the homepage route** to React Router v7 Framework mode as a proof of concept. This requires migrating the minimum route nesting to render the homepage:

```
/                    → root.tsx (Manifold wrapper)
  └── _index/
      └── _layout.tsx  → Frontend layout (header/footer)
          └── _index.tsx  → Home page content
```

All other routes will be temporarily removed from the router.

---

## Current State Analysis

### Route Nesting (Current)

```
createRouter.js
└── "/" path, element: <Manifold />, loader: manifoldLoader
    └── children: [...frontendRoutesV6, ...backendRoutesV6, ...readerRoutesV6]
        └── "" path, element: <Frontend />, loader: frontendLoader
            └── index: true, element: <Home />, loader: homeLoader
```

### Current Files Involved

| File                                         | Purpose                                           |
| -------------------------------------------- | ------------------------------------------------- |
| `src/routes/createRouter.js`                 | Creates route config object                       |
| `src/global/containers/App/index.js`         | Sets up `RouterProvider` / `StaticRouterProvider` |
| `src/entry-browser.js`                       | Client-side entry, runs bootstrap                 |
| `src/entry-ssr.js`                           | Server-side entry, runs bootstrap + render        |
| `src/global/containers/Manifold/index.js`    | Root wrapper (providers, overlays, auth handling) |
| `src/global/containers/Manifold/loader.js`   | Loads settings                                    |
| `src/frontend/containers/Frontend/index.js`  | Frontend layout (header, footer, main content)    |
| `src/frontend/containers/Frontend/loader.js` | Loads subjects                                    |
| `src/frontend/containers/Home/index.js`      | Homepage component                                |
| `src/frontend/containers/Home/loader.js`     | Loads homepage data                               |
| `src/frontend/containers/Home/Content.js`    | Homepage content                                  |

### Current Build System

- **Webpack** for bundling
- Custom SSR setup in `entry-ssr.js`
- Bootstrap process loads settings and authenticates user

### Current State Management

- **Redux store** passed via React context (`<Provider store={store}>`)
- Loaders access store via `context.store` (SSR) or `getStore()` (client)
- `dataLoader` utility dispatches actions to entity store

---

## Phase 1: Install Framework Mode Dependencies

### 1.1 Install Required Packages

```bash
npm install @react-router/dev @react-router/node @react-router/serve vite
```

### 1.2 Update package.json Scripts

Add new scripts alongside existing ones (don't remove webpack scripts yet):

```json
{
  "scripts": {
    "dev:framework": "react-router dev",
    "build:framework": "react-router build",
    "start:framework": "react-router-serve ./build/server/index.js"
  }
}
```

---

## Phase 2: Create Vite Configuration

### 2.1 Create `vite.config.ts` (Project Root)

```typescript
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      // Mirror webpack aliases from webpack/config/aliases.js
      global: path.resolve(__dirname, "src/global"),
      frontend: path.resolve(__dirname, "src/frontend"),
      backend: path.resolve(__dirname, "src/backend"),
      reader: path.resolve(__dirname, "src/reader"),
      helpers: path.resolve(__dirname, "src/helpers"),
      hooks: path.resolve(__dirname, "src/hooks"),
      hoc: path.resolve(__dirname, "src/hoc"),
      store: path.resolve(__dirname, "src/store"),
      actions: path.resolve(__dirname, "src/actions"),
      api: path.resolve(__dirname, "src/api"),
      utils: path.resolve(__dirname, "src/utils"),
      theme: path.resolve(__dirname, "src/theme"),
      config: path.resolve(__dirname, "src/config"),
      routes: path.resolve(__dirname, "src/routes")
    }
  }
});
```

---

## Phase 3: Create React Router Config

### 3.1 Create `react-router.config.ts` (Project Root)

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Use app directory for routes
  appDirectory: "app",
} satisfies Config;
```

---

## Phase 4: Create App Directory Structure

### 4.1 Directory Structure

```
app/
├── root.tsx              # Root layout (replaces Manifold)
├── entry.client.tsx      # Client entry (replaces entry-browser.js)
├── entry.server.tsx      # Server entry (replaces entry-ssr.js)
├── routes/
│   └── _index/
│       ├── _layout.tsx   # Frontend layout
│       └── _index.tsx    # Homepage
└── styles/
    └── (CSS imports)
```

### 4.2 Create `app/root.tsx`

This replaces `Manifold` as the root layout:

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Global as GlobalStyles } from "@emotion/react";
import { UIDReset } from "react-uid";
import styles from "theme/styles/globalStyles";
import "utils/i18n";

// Import existing Manifold internals
import Analytics from "hoc/analytics";
import Utility from "global/components/utility";
import ColorScheme from "global/components/ColorScheme";
import LoadingBar from "global/components/LoadingBar";
import SignInUp from "global/components/sign-in-up";
import CookiesBanner from "global/components/CookiesBanner";
import { NavigationBlockerProvider } from "global/components/router/NavigationBlockerContext";
import { FrontendModeContext } from "helpers/contexts";
import FatalErrorBoundary from "global/components/FatalError/Boundary";
import AppFatalError from "global/components/FatalError/AppWrapper";

// Store setup - CRITICAL: Need to figure out how to pass store
import { useFromStore } from "hooks";
import { requests } from "api";

// Loader - reuse existing logic
import manifoldLoaderFn from "global/containers/Manifold/loader";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  // Context will have store from server setup
  return manifoldLoaderFn({ request, context });
};

export default function Root() {
  // NOTE: Store access needs to be solved - see Phase 5
  const loaderData = useLoaderData<typeof loader>();

  // ... existing Manifold logic (simplified for POC)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="content" data-ssr-render="true">
          <Analytics>
            <div role="presentation" className="global-container">
              <Utility.SkipLink />
              <div id="global-notification-container" />
              <div id="global-overlay-container" />
              <FrontendModeContext.Provider value={{}}>
                <NavigationBlockerProvider>
                  <LoadingBar loading={false} />
                  <ColorScheme settings={null} />
                  <FatalErrorBoundary>
                    <Outlet />
                  </FatalErrorBoundary>
                  <CookiesBanner />
                </NavigationBlockerProvider>
              </FrontendModeContext.Provider>
            </div>
          </Analytics>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### 4.3 Create `app/routes/_index/_layout.tsx`

This replaces the `Frontend` component:

```tsx
import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import classNames from "classnames";
import Utility from "global/components/utility";
import Footers from "global/components/Footers";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";
import Layout from "frontend/components/layout";
import { useFromStore } from "hooks";
import { requests } from "api";
import get from "lodash/get";
import BodyClass from "hoc/BodyClass";
import AppFatalError from "global/components/FatalError/AppWrapper";
import { SearchProvider } from "hooks/useSearch/context";

// Reuse existing loader
import frontendLoaderFn from "frontend/containers/Frontend/loader";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return frontendLoaderFn({ request, context });
};

export default function FrontendLayout() {
  const fatalError = useFromStore({ path: "fatalError" });
  const settings = useFromStore({
    requestKey: requests.settings,
    action: "select",
  });
  const hasPressLogo = get(settings, "attributes.pressLogoStyles.small");

  return (
    <BodyClass className="browse">
      <BreadcrumbsProvider>
        <Utility.ScrollToTop />
        <SearchProvider>
          <Layout.Header />
          <main
            id="skip-to-main"
            tabIndex={-1}
            className={classNames({
              "main-content": true,
              "flex-viewport": true,
              "extra-top": hasPressLogo,
            })}
          >
            {fatalError.error ? (
              <AppFatalError fatalError={fatalError} />
            ) : (
              <Outlet />
            )}
          </main>
          <Footers.FrontendFooter />
        </SearchProvider>
      </BreadcrumbsProvider>
    </BodyClass>
  );
}
```

### 4.4 Create `app/routes/_index/_index.tsx`

This is the homepage:

```tsx
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import Content from "frontend/containers/Home/Content";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import HeadContent from "global/components/HeadContent";

// Reuse existing loader
import homeLoaderFn from "frontend/containers/Home/loader";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return homeLoaderFn({ request, context });
};

export default function Home() {
  return (
    <>
      <HeadContent />
      <EventTracker event={EVENTS.VIEW_LIBRARY} />
      <Content />
    </>
  );
}
```

---

## Phase 5: Handle Redux Store Integration

**CRITICAL CHALLENGE**: Framework mode manages its own data flow. We need to integrate our Redux store.

### 5.1 Option A: Server Context (Recommended for POC)

Create custom server entry that provides store in context:

**`app/entry.server.tsx`**:

```tsx
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { Provider } from "react-redux";
import createStore from "store/createStore";
import manifoldBootstrap from "bootstrap";
import CookieHelper from "helpers/cookie/Server";
import { setStore } from "store/storeInstance";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  // Create store for this request
  const store = createStore();
  setStore(store);

  // Run bootstrap (loads settings, authenticates user)
  const cookie = new CookieHelper(request);
  await manifoldBootstrap(store.getState, store.dispatch, cookie);

  // Render with store provider
  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <Provider store={store}>
        <ServerRouter context={routerContext} url={request.url} />
      </Provider>,
      {
        onShellReady() {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );
          pipe(body);
        },
        onShellError: reject,
      }
    );
  });
}
```

### 5.2 Create `app/entry.client.tsx`

```tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { Provider } from "react-redux";
import createStore from "store/createStore";
import manifoldBootstrap from "bootstrap";
import CookieHelper from "helpers/cookie/Browser";
import { setStore } from "store/storeInstance";
import has from "lodash/has";

async function hydrate() {
  // Get initial state from SSR
  const initialState = window.__INITIAL_STATE__ || {};
  const bootstrapped = has(window, "__INITIAL_STATE__");
  const store = createStore(initialState);
  setStore(store);

  // Bootstrap if not already done on server
  if (!bootstrapped) {
    const cookie = new CookieHelper();
    await manifoldBootstrap(store.getState, store.dispatch, cookie);
  }

  startTransition(() => {
    hydrateRoot(
      document.getElementById("content")!,
      <StrictMode>
        <Provider store={store}>
          <HydratedRouter />
        </Provider>
      </StrictMode>
    );
  });
}

hydrate();
```

### 5.3 Pass Store to Loaders via Context

Framework mode loaders receive a `context` parameter. We need to configure this:

**Update `vite.config.ts`** to pass store in loader context:

```typescript
// This may require custom server middleware
// Research: @react-router/dev getLoadContext option
```

---

## Phase 6: Update Loader Context Access

### 6.1 Modify Existing Loaders

Current loaders use `context?.store || getStore()`. This should continue to work if we:

1. Pass `store` in server context (SSR)
2. Use `getStore()` fallback (client-side)

**No changes needed to existing loaders** if store is properly set up.

---

## Phase 7: Handle CSS/Styles

### 7.1 Import Global Styles

In `app/root.tsx`:

```tsx
import "theme/styles/globalStyles"; // or however styles are currently loaded
```

### 7.2 Configure Vite for Emotion

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"]
  }
  // May need Emotion babel plugin configuration
});
```

---

## Phase 8: Temporarily Disable Other Routes

For the POC, we only want the homepage. Other routes should return 404.

### 8.1 Route Structure

With only these files in `app/routes/`:

- `_index/_layout.tsx` - Frontend layout
- `_index/_index.tsx` - Homepage

All other paths will automatically 404.

### 8.2 Add Catch-All 404 (Optional)

**`app/routes/$.tsx`**:

```tsx
export default function NotFound() {
  return <div>Route not migrated yet</div>;
}
```

---

## Phase 9: Testing Checklist

### 9.1 Server-Side Rendering

- [ ] Homepage renders on server
- [ ] Initial state is serialized correctly
- [ ] Store is available in loaders

### 9.2 Client-Side Hydration

- [ ] Page hydrates without errors
- [ ] No hydration mismatch warnings
- [ ] Store is rehydrated from SSR state

### 9.3 Data Loading

- [ ] `manifoldLoader` loads settings
- [ ] `frontendLoader` loads subjects
- [ ] `homeLoader` loads homepage content
- [ ] Data appears in components via `useFromStore`

### 9.4 User Experience

- [ ] Header/footer render correctly
- [ ] Homepage content displays
- [ ] No console errors

---

## Known Challenges & Solutions

### Challenge 1: Redux Store in Loader Context

**Problem**: Framework mode doesn't have built-in support for passing custom context to loaders.

**Solution**: Use `getLoadContext` option in server adapter or access store via `getStore()` singleton.

### Challenge 2: Bootstrap Process

**Problem**: Current bootstrap runs before rendering, loads settings and authenticates user.

**Solution**: Run bootstrap in `entry.server.tsx` before rendering, in `entry.client.tsx` before hydration.

### Challenge 3: Emotion CSS-in-JS

**Problem**: Current setup uses Emotion with SSR extraction.

**Solution**: Configure Vite for Emotion, may need `@emotion/babel-plugin` in Vite config.

### Challenge 4: Webpack Aliases

**Problem**: Extensive webpack aliases for clean imports.

**Solution**: Replicate in `vite.config.ts` `resolve.alias`.

### Challenge 5: `redirectIfLibraryDisabled` HOC

**Problem**: Frontend component uses this HOC for redirect logic.

**Solution**: Move redirect logic to loader (already have `checkLibraryMode`).

---

## Files Created ✅

| File                                                           | Purpose                                        |
| -------------------------------------------------------------- | ---------------------------------------------- |
| `vite.config.js`                                               | Vite configuration with aliases + plugins      |
| `react-router.config.js`                                       | Framework mode config                          |
| `app/root.jsx`                                                 | Root layout with AppContext provider           |
| `app/entry.server.jsx`                                         | Server entry with store setup                  |
| `app/entry.client.jsx`                                         | Client entry with hydration                    |
| `app/contexts.js`                                              | routerContext + AppContext + FrontendContext   |
| `app/middleware/bootstrap.server.js`                           | Fetches settings, auth, pages                  |
| `app/middleware/bootstrap.client.js`                           | No-op client middleware                        |
| `app/routes.js`                                                | Hybrid flatRoutes configuration                |
| `app/routes/$.jsx`                                             | Catch-all for legacy routes                    |
| `app/routes/frontend/_frontend.jsx`                            | Frontend layout with FrontendContext           |
| `app/routes/frontend/_frontend._index.jsx`                     | Homepage with pure framework loader            |
| `app/routes/frontend/_frontend.projects._index.jsx`            | Projects list route                            |
| `app/routes/frontend/_frontend.journals._index.jsx`            | Journals list route                            |
| `app/routes/frontend/_frontend.issues._index.jsx`              | Issues list route                              |
| `app/routes/frontend/_frontend.project-collections._index.jsx` | Collections list route                         |
| `src/hooks/usePages/index.js`                                  | Hook for pages from AppContext                 |
| `src/hooks/useSubjects/index.js`                               | Hook for subjects from FrontendContext         |
| `src/hooks/useJournalSubjects/index.js`                        | Hook for journal subjects from FrontendContext |
| `src/hooks/useListSearchParams/index.js`                       | Hook for filter state via URL                  |
| `src/helpers/api/denormalize.js`                               | JSON:API relationship hydration                |
| `src/helpers/router/shouldRevalidate.js`                       | Shared revalidation logic                      |
| `src/helpers/router/loaders/parseListParams.js`                | Parse URL into filters + pagination            |
| `src/helpers/router/loaders/createListClientLoader.js`         | ClientLoader factory with hydration            |

## Files Modified ✅

| File                                                 | Changes                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| `package.json`                                       | Added framework mode dependencies and scripts                        |
| `src/api/client.js`                                  | Added `authToken` param, `denormalize` option                        |
| `src/api/LowLevelApiClient.js`                       | Added `authToken` constructor param                                  |
| `src/hooks/index.js`                                 | Exports new hooks (usePages, useSubjects, useListSearchParams, etc.) |
| `src/hooks/useFrontendModeContext/index.js`          | Now reads from FrontendContext                                       |
| `src/helpers/cookie/Server.js`                       | Simplified to Fetch API only                                         |
| `src/global/components/list/Filters/Search/index.js` | `useUID` → `useId`                                                   |
| `src/global/components/list/Filters/Filter/index.js` | `useUID` → `useId`                                                   |
| ~20 components                                       | Migrated from Redux to context hooks                                 |

## Files Modified During POC (Originally Marked as "Reused")

| File                                                | Changes Required                                           |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `src/global/containers/Manifold/loader.js`          | Added `ensureBootstrap()` for SSR auth                     |
| `src/frontend/containers/Home/loader.js`            | Removed (logic moved to `app/routes/_frontend._index.jsx`) |
| `src/helpers/cookie/Server.js`                      | Simplified to Fetch API only (Express support removed)     |
| `src/global/components/sign-in-up/Overlay/index.js` | Replaced `react-uid` with React 18 `useId()`               |

## Additional Files Modified for Vite Compatibility

| File                            | Changes                                               |
| ------------------------------- | ----------------------------------------------------- |
| `src/utils/humps.js`            | Converted IIFE to ESM exports                         |
| `src/helpers/consoleHelpers.js` | Converted `require` to `import`                       |
| `src/utils/string.js`           | Converted `require` to `import`                       |
| `src/actions/entityStore.js`    | Changed `lodash` import to `lodash-es`                |
| `src/api/index.js`              | Fixed 53 `export X from` statements                   |
| `src/helpers/contexts/index.js` | Fixed 9 `export X from` statements                    |
| `src/helpers/linkHandler.js`    | Hardcoded route helpers (replaced dynamic extraction) |

## Files That Work Unchanged

| File                                         | Notes                                |
| -------------------------------------------- | ------------------------------------ |
| `src/store/*`                                | Redux store creation works unchanged |
| `src/helpers/router/loaders/dataLoader.js`   | Works unchanged                      |
| `src/bootstrap.js`                           | Works unchanged                      |
| `src/frontend/containers/Frontend/loader.js` | Works unchanged                      |

---

## Pre-Migration TODO: Modernize LinkHandler

The current `linkHandler.js` has route helpers hardcoded directly. Before full migration, consider:

1. **Type-safe route helpers** - Add TypeScript types or JSDoc for better DX
2. **Auto-generation** - Generate helpers from route definitions at build time
3. **Framework mode integration** - Use React Router's built-in navigation helpers
4. **Consolidation** - Many routes have both `frontendX` and `X` aliases; clean up duplicates

Current implementation works but is brittle - adding/changing routes requires manual updates to linkHandler.

---

## Pre-Migration TODO: Update Lodash Imports

**IMPORTANT**: Before migrating more routes, update all lodash imports to be Vite-compatible.

Vite SSR doesn't handle CommonJS named exports well. Change:

- `import { get } from "lodash"` → `import get from "lodash/get"` (individual imports)
- Or switch entirely to `lodash-es` (ESM version)

**Files to update** (search for `from "lodash"` or `from 'lodash'`):

```bash
grep -r "from ['\"]lodash['\"]" src/
```

**Recommended approach**: Install `lodash-es` and update all imports:

```bash
yarn add lodash-es
yarn add -D @types/lodash-es
```

Then change imports to: `import { get, has, isString } from "lodash-es"`

---

## Rollback Plan

If the POC fails:

1. Delete `app/` directory
2. Delete `vite.config.ts` and `react-router.config.ts`
3. Remove framework mode dependencies from `package.json`
4. Continue using existing webpack + data router setup

---

## Next Steps After POC

If successful:

1. Migrate more routes incrementally
2. Set up parallel running of webpack (existing routes) and Vite (migrated routes)
3. Create route manifest for `linkHandler` compatibility
4. Fully migrate all routes
5. Remove webpack configuration
