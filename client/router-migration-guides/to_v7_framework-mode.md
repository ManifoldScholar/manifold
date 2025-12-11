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

## Next Steps: Migrating Additional Routes

### Route Migration Pattern

For each new route, follow this pattern:

1. **Create route file** in `app/routes/` following naming convention
2. **Export `shouldRevalidate`** from shared helper
3. **Create loader** using `ApiClient` with `denormalize: true`
4. **Update components** to use context hooks instead of `useFromStore`

### Routes to Migrate (Priority Order)

| Route          | Path              | Complexity               |
| -------------- | ----------------- | ------------------------ |
| Projects List  | `/projects`       | Medium                   |
| Project Detail | `/projects/:slug` | High (many child routes) |
| Journals       | `/journals`       | Medium                   |
| Reading Groups | `/my/groups`      | Medium                   |
| Backend Routes | `/backend/*`      | High (large subtree)     |
| Reader Routes  | `/read/*`         | High (specialized UI)    |

### Remaining Codebase Updates

1. **Replace `withSettings` HOC** in non-homepage components (~4 files remain)
2. **Replace `useFromStore` for auth/settings/pages** in non-homepage components (~40+ files)
3. **Replace remaining `react-uid`** with `useId()` (~55 files)
4. **Remove Redux auth/settings reducers** once all components migrated
5. **Delete old SSR files** (`src/entry-ssr.js`, `src/servers/proxies/renderer.js`) and `ServerCookie` helper

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

| File                                     | Purpose                                   |
| ---------------------------------------- | ----------------------------------------- |
| `vite.config.js`                         | Vite configuration with aliases + plugins |
| `react-router.config.js`                 | Framework mode config                     |
| `app/root.jsx`                           | Root layout with AppContext provider      |
| `app/entry.server.jsx`                   | Server entry with store setup             |
| `app/entry.client.jsx`                   | Client entry with hydration               |
| `app/contexts.js`                        | routerContext + AppContext definitions    |
| `app/middleware/bootstrap.server.js`     | Fetches settings, auth, pages             |
| `app/middleware/bootstrap.client.js`     | No-op client middleware                   |
| `app/routes/_frontend.jsx`               | Frontend layout route                     |
| `app/routes/_frontend._index.jsx`        | Homepage with pure framework loader       |
| `app/routes/$.jsx`                       | Catch-all for legacy routes               |
| `app/routes.js`                          | Route definitions                         |
| `src/hooks/usePages/index.js`            | Hook for pages from AppContext            |
| `src/helpers/api/denormalize.js`         | JSON:API relationship hydration           |
| `src/helpers/router/shouldRevalidate.js` | Shared revalidation logic                 |

## Files Modified ✅

| File                           | Changes                                       |
| ------------------------------ | --------------------------------------------- |
| `package.json`                 | Added framework mode dependencies and scripts |
| `src/api/client.js`            | Added `authToken` param, `denormalize` option |
| `src/api/LowLevelApiClient.js` | Added `authToken` constructor param           |
| `src/hooks/index.js`           | Exports new hooks (usePages, etc.)            |
| `src/helpers/cookie/Server.js` | Simplified to Fetch API only                  |
| ~20 components                 | Migrated from Redux to context hooks          |

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
