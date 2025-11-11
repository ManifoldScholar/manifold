# React Router v6 Migration Plan

Note this initial plan is here for reference, the [to_v6](router-migration-guides/to_v6.md) guide contains more updated info on what was actually done.

## Overview

Migrate frontend routes from `react-router-config` to React Router v6 using `createBrowserRouter`. This will remove the dependency on `react-router-config` and modernize the routing setup while maintaining the existing route structure.

## Current State Analysis

### Key Files

- **Route definitions**: [`src/frontend/routes.js`](src/frontend/routes.js) - Object-based route definitions
- **Route hydration**: [`src/routes/hydrate.js`](src/routes/hydrate.js) - Converts string component names to components
- **Route containers**: [`src/frontend/containers/route-containers.js`](src/frontend/containers/route-containers.js) - Component registry
- **Main router setup**: [`src/global/containers/App/index.js`](src/global/containers/App/index.js) - Uses BrowserRouter/StaticRouter
- **Route rendering**:
  - [`src/global/containers/Manifold/index.js`](src/global/containers/Manifold/index.js) - Uses `renderRoutes(routes)`
  - [`src/frontend/containers/Frontend/index.js`](src/frontend/containers/Frontend/index.js) - Uses `renderRoutes(route.routes)`
  - [`src/frontend/containers/ProjectsWrapper/index.js`](src/frontend/containers/ProjectsWrapper/index.js) - Uses `renderRoutes(route.routes)`
  - [`src/frontend/containers/JournalsWrapper/index.js`](src/frontend/containers/JournalsWrapper/index.js) - Uses `renderRoutes(route.routes)`
- **Child routes helper**: [`src/helpers/router/childRoutes.js`](src/helpers/router/childRoutes.js) - Custom helper for nested routes with options

### Current Usage Patterns

1. `renderRoutes(route.routes)` - Renders child routes
2. `childRoutes(route, options)` - Renders child routes with custom options (drawer, switch, childProps)
3. Components receive `route` prop with route information
4. SSR uses `StaticRouter` with `staticContext`

## Migration Steps

### 1. Create New v6 Routes File (Static Conversion)

**File**: `src/frontend/routes-v6.js` (new file)

**Approach**: Create a new static routes file with v6-compatible route definitions. This is a static conversion (not runtime), making it explicit, reviewable, and easier to maintain.

**Conversion process** (choose one approach):

**Option A: Manual Conversion (Recommended)**

- Manually convert `src/frontend/routes.js` to v6 format
- Create `src/frontend/routes-v6.js` with:
  - Direct component imports from `src/frontend/containers/route-containers.js`
  - `element` prop with JSX instead of `component` string
  - `children` instead of `routes`
  - Route metadata (name, helper, isLibrary) stored in `handle` property
  - `exact: true` routes may need path adjustments or conversion to `index` routes
  - NotFound routes (no path) converted to `path: "*"`

**Option B: Conversion Script (Helper)**

- Create a one-time conversion script (`script/convert-routes-to-v6.js`) that:
  - Reads `src/frontend/routes.js`
  - Imports components from `src/frontend/containers/route-containers.js`
  - Converts route structure programmatically
  - Writes `src/frontend/routes-v6.js`
- Review and manually adjust the generated file as needed

**Example conversion**:

```javascript
// Before (src/frontend/routes.js)
{
  component: "Frontend",
  path: "/",
  routes: [...]
}

// After (src/frontend/routes-v6.js)
import Frontend from "frontend/containers/Frontend";
{
  element: <Frontend />,
  path: "/",
  children: [...],
  handle: { name: "frontend", isLibrary: true }
}
```

**Index Route Conversion Examples**:

When a child route has the same path as its parent and `exact: true`, convert it to an `index` route:

```javascript
// Before: Parent route with exact child
{
  component: "ProjectWrapper",
  path: "/projects/:id",
  routes: [
    {
      name: "frontendProjectDetail",
      exact: true,
      component: "ProjectDetail",
      path: "/projects/:id"  // Same path as parent
    },
    {
      name: "frontendProjectSearch",
      exact: true,
      component: "ProjectSearch",
      path: "/projects/:id/search"
    }
  ]
}

// After: Use index route
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  children: [
    {
      index: true,  // This matches when path exactly matches parent
      element: <ProjectDetail />,
      handle: { name: "frontendProjectDetail" }
    },
    {
      path: "search",  // Relative path - automatically resolves to /projects/:id/search
      element: <ProjectSearch />,
      handle: { name: "frontendProjectSearch" }
    }
  ]
}
```

**Route Ordering**:

- v6 matches routes in order, first match wins
- More specific routes should come before less specific ones
- Index routes should come before parameterized child routes
- NotFound (catch-all) routes should be last with `path: "*"`

**Example of proper ordering**:

```javascript
{
  path: "/projects/:id",
  children: [
    { index: true, element: <ProjectDetail /> },  // /projects/123
    { path: "search", element: <ProjectSearch /> },  // /projects/123/search
    { path: "resources", element: <ProjectResources /> },  // /projects/123/resources
    { path: "*", element: <NotFound /> }  // Catch-all for /projects/123/*
  ]
}
```

**Preserving Route Metadata**:
All route metadata (name, helper, helpers, isLibrary) should be moved to the `handle` property:

```javascript
// Before
{
  name: "frontendProject",
  helper: p => `/projects/${p}`,
  isLibrary: true,
  component: "ProjectWrapper",
  path: "/projects/:id"
}

// After
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  handle: {
    name: "frontendProject",
    helper: p => `/projects/${p}`,
    isLibrary: true
  }
}
```

### 2. Keep Original Routes File (Temporary)

**File**: `src/frontend/routes.js`

Keep the original file temporarily for reference during migration. Can be removed after migration is complete and tested.

### 3. Create Router Configuration

**File**: `src/routes/createRouter.js`

Create a function that:

- Imports the converted v6 routes from `src/frontend/routes-v6.js`
- Returns the routes array directly for `createBrowserRouter`
- No hydration needed since `routes-v6.js` already has components imported as JSX elements

### 4. Update App Component

**File**: `src/global/containers/App/index.js`

- Replace `BrowserRouter`/`StaticRouter` with `RouterProvider` for client-side
- For SSR, use `createStaticRouter` (v6.4+) instead of `StaticRouter`
- Remove `CompatRouter` wrapper (no longer needed with v6)
- Pass router instance to `RouterProvider`

### 5. Replace renderRoutes with Outlet

**Files to update**:

- [`src/global/containers/Manifold/index.js`](src/global/containers/Manifold/index.js)
- [`src/frontend/containers/Frontend/index.js`](src/frontend/containers/Frontend/index.js)
- [`src/frontend/containers/ProjectsWrapper/index.js`](src/frontend/containers/ProjectsWrapper/index.js)
- [`src/frontend/containers/JournalsWrapper/index.js`](src/frontend/containers/JournalsWrapper/index.js)

Replace `renderRoutes(route.routes)` with `<Outlet />` from `react-router-dom`.

### 6a. Create OutletWithDrawer Component (for drawer support)

**File**: `src/frontend/components/OutletWithDrawer.js` (new file)

Create a wrapper component to handle drawer functionality that was previously handled by `childRoutes`:

```javascript
import { Outlet, useMatches } from "react-router-dom";
import Drawer from "global/containers/drawer";

export default function OutletWithDrawer({
  drawerProps,
  context,
  ...outletProps
}) {
  const matches = useMatches();

  // In v6, matches array includes all matched routes from root to leaf
  // The last match is the deepest route, previous matches are parents
  const currentMatch = matches[matches.length - 1];
  const parentMatch = matches[matches.length - 2];

  // Drawer should be open if we have a child route match beyond the parent
  // This works because v6 matches are inclusive (parent + child both match)
  const hasChildMatch =
    matches.length > 1 && currentMatch.pathname !== parentMatch?.pathname;

  // Alternative: Check if current route has drawer: true in handle
  // This is more explicit and reliable if you mark drawer routes
  // const isDrawerRoute = currentMatch?.handle?.drawer === true;
  // const hasChildMatch = isDrawerRoute && matches.length > 1;

  if (!drawerProps) {
    return <Outlet context={context} {...outletProps} />;
  }

  // Note: v6 doesn't modify location.state the same way as v5
  // The noScroll state handling may need to be done differently
  // Consider using context or a different state management approach

  return (
    <Drawer.Wrapper open={hasChildMatch} {...drawerProps}>
      <Outlet context={context} {...outletProps} />
    </Drawer.Wrapper>
  );
}
```

**Note**: For more reliable drawer detection, mark drawer routes in route definitions with `handle: { drawer: true }` and check for that property instead of pathname comparison.

### 6b. Replace childRoutes Helper with Outlet (Detailed)

**Files to update** (frontend only):

- [`src/frontend/containers/ProjectWrapper/index.js`](src/frontend/containers/ProjectWrapper/index.js)
- [`src/frontend/containers/JournalWrapper/index.js`](src/frontend/containers/JournalWrapper/index.js)
- [`src/frontend/containers/ReadingGroup/index.js`](src/frontend/containers/ReadingGroup/index.js)
- [`src/frontend/containers/ReadingGroup/Homepage/Wrapper.js`](src/frontend/containers/ReadingGroup/Homepage/Wrapper.js)
- [`src/frontend/containers/ReadingGroup/Members/Wrapper.js`](src/frontend/containers/ReadingGroup/Members/Wrapper.js)
- [`src/frontend/containers/PublicReadingGroups/Wrapper.js`](src/frontend/containers/PublicReadingGroups/Wrapper.js)
- [`src/frontend/containers/MyReadingGroups/Wrapper.js`](src/frontend/containers/MyReadingGroups/Wrapper.js)
- [`src/frontend/containers/ReadingGroup/Homepage/Fetch.js`](src/frontend/containers/ReadingGroup/Homepage/Fetch.js)
- [`src/frontend/containers/PublicReadingGroups/List.js`](src/frontend/containers/PublicReadingGroups/List.js)
- [`src/frontend/containers/MyReadingGroups/List.js`](src/frontend/containers/MyReadingGroups/List.js)

**Challenges and Solutions**:

1. **childProps** (Easy) - Use `Outlet` context:

   ```javascript
   // Before
   {
     childRoutes(route, { childProps: { project, settings } });
   }

   // After
   <Outlet context={{ project, settings }} />;
   ```

   Child components access via `useOutletContext()` hook.

2. **drawer** (Complex) - Use `OutletWithDrawer` component:

   ```javascript
   // Before
   {
     childRoutes(route, {
       drawer: true,
       drawerProps: { context: "frontend", size: "wide" },
       childProps: { onSuccess: refresh }
     });
   }

   // After
   <OutletWithDrawer
     context={{ onSuccess: refresh }}
     drawerProps={{ context: "frontend", size: "wide" }}
   />;
   ```

3. **switch** (Not needed) - v6's `Outlet` already handles single-match routing. The `switch: false` option (Passthrough) isn't used in frontend routes.

4. **slot** (Not used) - No frontend routes use the slot option.

5. **factory** (Not used) - No frontend routes use the factory option.

6. **route prop** (Handle separately) - Components that need route metadata should use `useMatches()` hook instead of receiving `route` prop.

**Potential Issues**:

- **Drawer open state**: Need to determine when drawer should be open. Current `DrawerSwitch` uses `match` prop. May need to check route matches or use location state.
- **Location state modification**: `childRoutes` modifies `location.state.noScroll` for drawers. This may need to be handled differently in v6.
- **404 handling**: `ChildSwitch` renders `<NotFound />` when no match. v6 handles this via catch-all routes, but need to ensure it works correctly.
- **Mixed drawer/non-drawer routes**: If a component has both drawer and non-drawer child routes, see section 6c below.

### 6c. Handling Mixed Drawer and Non-Drawer Routes

If a component has both drawer and non-drawer child routes, you have two options:

**Option 1: Separate route groups** (Recommended if routes are clearly separated)

- Use route `handle` to mark which routes should be in drawers
- Conditionally render `OutletWithDrawer` or `Outlet` based on current route match
- Example: Check `useMatches()` to see if current route has `handle.drawer: true`

**Option 2: Always use OutletWithDrawer** (Simpler)

- Use `OutletWithDrawer` for all cases
- Pass `drawerProps={null}` or conditionally pass drawer props
- The component will fall back to regular `Outlet` when `drawerProps` is null/undefined

**Implementation pattern for Option 1**:

```javascript
import { useMatches } from "react-router-dom";
import OutletWithDrawer from "frontend/components/OutletWithDrawer";

function ComponentWithMixedRoutes({ childProps }) {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isDrawerRoute = currentMatch?.handle?.drawer === true;

  if (isDrawerRoute) {
    return (
      <OutletWithDrawer
        context={childProps}
        drawerProps={{ context: "frontend", size: "wide" }}
      />
    );
  }

  return <Outlet context={childProps} />;
}
```

**Note**: This requires marking drawer routes in the route definitions with `handle: { drawer: true }`.

### 7. Handle Route Props

Components currently receive a `route` prop. In v6:

- Route metadata can be accessed via `useMatches()` hook
- Route-specific data can be stored in route `handle` property
- Update components that use `route` prop to use `useMatches()` or remove dependency

**Migration Pattern**:

```javascript
// Before
function MyComponent({ route }) {
  const routeName = route.name;
  const isLibrary = route.isLibrary;
  const helper = route.helper;
  // ...
}

// After
import { useMatches } from "react-router-dom";

function MyComponent() {
  const matches = useMatches();
  // Get the current route match (last in array)
  const currentMatch = matches[matches.length - 1];
  const routeName = currentMatch.handle?.name;
  const isLibrary = currentMatch.handle?.isLibrary;
  const helper = currentMatch.handle?.helper;
  // ...
}
```

**Accessing Parent Route Metadata**:
If you need access to parent route metadata, use earlier matches in the array:

```javascript
function MyComponent() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const parentMatch = matches[matches.length - 2]; // Parent route
  const grandparentMatch = matches[matches.length - 3]; // Grandparent route

  // Access parent route name
  const parentRouteName = parentMatch?.handle?.name;
  // ...
}
```

**Files that may need updates**:

- Components that destructure `route` from props
- Components that access `route.name`, `route.helper`, `route.isLibrary`, etc.
- Components that pass `route` prop to child components

### 8. Update SSR Support

**File**: `src/entry-ssr.js`

**Current v5 Approach**:

- Uses `StaticRouter` with `staticContext` object
- Components set `staticContext.url` to trigger redirects
- SSR code checks `routingContext.url` after rendering and sends 302 response

**v6 Approach**:

- Use `createStaticRouter` instead of `StaticRouter`
- Use `StaticRouterProvider` instead of `StaticRouter` component
- Pass routes and request URL to `createStaticRouter`
- Handle redirects differently - v6 doesn't use `staticContext.url`

**Redirect Handling in v6 SSR**:

1. **Route-level redirects** (loaders/actions): Use `redirect()` utility from `react-router-dom`:

   ```javascript
   import { redirect } from "react-router-dom";

   export async function loader() {
     // Redirect logic
     throw redirect("/login");
   }
   ```

   The router will handle these automatically in SSR.

2. **Component-level redirects** (like Authorize): Need a different approach since v6 doesn't support `staticContext.url`:

   **Option A: Throw Response objects for SSR** (Recommended for immediate migration):

   ```javascript
   import { Navigate } from "react-router-dom";

   // In Authorize component
   if (!isAuthorized && failureRedirect) {
     const redirectPath = getRedirectPath(failureRedirect);
     if (__SERVER__) {
       // For SSR, throw a redirect Response
       throw new Response(null, {
         status: 302,
         headers: { Location: redirectPath }
       });
     }
     return <Navigate to={redirectPath} replace />;
   }
   ```

   **Option B: Use route loaders** (Better long-term):

   - Move authorization logic to route loaders
   - Use `redirect()` utility in loaders
   - This is the v6 recommended pattern

3. **Update SSR render function**:

   ```javascript
   import {
     createStaticRouter,
     StaticRouterProvider
   } from "react-router-dom/server";
   import { createRoutes } from "routes/createRouter";

   const render = async (req, res, store) => {
     const routes = createRoutes(); // Get v6 routes

     // Create static router
     const router = createStaticRouter(routes, {
       location: req.url
       // Pass any initial data/hydration state
     });

     // Handle redirects from router
     if (router.state.navigation.location) {
       // Router detected a redirect
       const redirectUrl =
         router.state.navigation.location.pathname +
         router.state.navigation.location.search;
       return respondWithRedirect(res, redirectUrl);
     }

     // Render with StaticRouterProvider
     // Wrap in try/catch to handle thrown Response objects
     let renderString = "";
     try {
       const appComponent = (
         <StaticRouterProvider router={router} context={routingContext} />
       );

       renderString = ReactDOM.renderToString(
         <HtmlBody component={appComponent} stats={stats} store={store} />
       );
     } catch (error) {
       // Catch redirect Response objects thrown by components
       if (
         error instanceof Response &&
         error.status >= 300 &&
         error.status < 400
       ) {
         const redirectUrl = error.headers.get("Location");
         return respondWithRedirect(res, redirectUrl);
       }
       // Re-throw other errors
       throw error;
     }

     // ... rest of render logic
   };
   ```

**Challenges**:

- `Authorize` component currently uses `navigate()` which is client-side only
- Need to handle SSR redirects differently (throw Response or use Navigate)
- `redirectIfLibraryDisabled` HOC also uses `staticContext.url` pattern - needs update
- May need to catch redirect responses during render and handle them
- Error handling: Need to catch thrown Response objects during render

**Files to update for redirects**:

- [`src/hoc/Authorize/index.js`](src/hoc/Authorize/index.js) - Handle SSR redirects (currently uses `navigate()` which is client-only)
- [`src/hoc/redirectIfLibraryDisabled/index.js`](src/hoc/redirectIfLibraryDisabled/index.js) - Update staticContext pattern
- [`src/frontend/components/utility/RedirectIfLibraryModeDisabled.js`](src/frontend/components/utility/RedirectIfLibraryModeDisabled.js) - Update staticContext pattern

**Implementation Notes**:

- Wrap render in try/catch to catch redirect Responses
- Check for Response objects with status 302/301/etc. and handle as redirects
- For component-level redirects during SSR, throw Response objects that can be caught and handled
- Client-side redirects continue to work with `Navigate` component or `useNavigate()` hook

### 9. Update Package Dependencies

**File**: `package.json`

- Upgrade `react-router` and `react-router-dom` to v6
- Remove `react-router-config` dependency
- Keep `react-router-dom-v5-compat` temporarily if needed for other routes (backend/reader)

### 10. Remove Unused Router Helpers

**Files to remove/deprecate** (frontend routes only):

- `src/helpers/router/childRoutes.js` - No longer needed (use Outlet)
- `src/helpers/router/ChildSwitch.js` - No longer needed (v6 handles this)
- `src/helpers/router/DrawerSwitch.js` - May need to keep if drawer functionality is still used
- `src/helpers/router/switchFactory.js` - No longer needed

**Note**: Keep these files for now since backend/reader routes still use them. Remove only after full migration.

### 11. Update Route Matching

**File**: `src/helpers/router/navigation.js` (if needed)

Update any route matching logic that relies on `react-router-config`'s `matchRoutes` to use v6's `matchRoutes` from `react-router-dom`.

### 12. Preserve Route Helper Functions

**File**: `src/frontend/routes-v6.js`

Route helpers (navigation functions) stored in `helper` and `helpers` properties need to be preserved in the `handle` property so they can be accessed by `LinkHandler` and other navigation utilities.

**Conversion Pattern**:

```javascript
// Before
{
  name: "frontendProject",
  helper: p => `/projects/${p}`,
  component: "ProjectWrapper",
  path: "/projects/:id"
}

// After
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  handle: {
    name: "frontendProject",
    helper: p => `/projects/${p}`
  }
}
```

**Multiple Helpers**:

```javascript
// Before
{
  name: "frontendProjectResource",
  helpers: {
    frontendProjectResource: (p, r) => `/projects/${p}/resource/${r}`,
    frontendProjectResourceRelative: r => `resource/${r}`
  },
  component: "ResourceDetail",
  path: "/projects/:id/resource/:resourceId"
}

// After
{
  element: <ResourceDetail />,
  path: "/projects/:id/resource/:resourceId",
  handle: {
    name: "frontendProjectResource",
    helpers: {
      frontendProjectResource: (p, r) => `/projects/${p}/resource/${r}`,
      frontendProjectResourceRelative: r => `resource/${r}`
    }
  }
}
```

**Update LinkHandler** (if needed):
The `LinkHandler` class in `src/helpers/linkHandler.js` extracts helpers from routes. It may need updates to extract helpers from `route.handle.helper` or `route.handle.helpers` for v6 routes. However, since route helpers are stored in the `handle` property, the extraction logic should work similarly - it just needs to check `handle.helper` and `handle.helpers` instead of top-level properties.

### 13. Testing Checklist

- [ ] All frontend routes render correctly
- [ ] Nested routes work (projects, journals, reading groups)
- [ ] Route parameters are accessible via `useParams()`
- [ ] Navigation works (links, programmatic navigation)
- [ ] Index routes work correctly (routes with same path as parent)
- [ ] Route ordering is correct (more specific routes before less specific)
- [ ] SSR works correctly
- [ ] SSR redirects work (Authorize, redirectIfLibraryDisabled)
- [ ] Component-level redirects work (both client and SSR)
- [ ] Route helpers (navigation functions) still work via LinkHandler
- [ ] Route metadata (name, helper, isLibrary) accessible via `useMatches()`
- [ ] 404 handling works (NotFound component with catch-all routes)
- [ ] Child props are passed correctly via Outlet context
- [ ] Drawer functionality works correctly
- [ ] Drawer open/close state detection works
- [ ] Mixed drawer/non-drawer routes work correctly
- [ ] Route matching logic works for navigation helpers

## Implementation Notes

### Route Structure Conversion

```javascript
// v5 format (current)
{
  component: "Frontend",
  path: "/",
  routes: [...]
}

// v6 format (target)
{
  element: <Frontend />,
  path: "/",
  children: [...]
}
```

### Handling childProps

The `childRoutes` helper accepts `childProps` option. In v6, pass these via `Outlet` context:

```javascript
// Before
{
  childRoutes(route, { childProps: { project, settings } });
}

// After
<Outlet context={{ project, settings }} />;
```

Components can access context via `useOutletContext()` hook.

### Exact Matching

v6 uses different route matching. Routes are matched more strictly by default. Key differences:

- Use `index` routes for routes that should match when the path exactly matches the parent
- Relative paths in `children` automatically resolve relative to parent path
- No `exact` prop needed - v6 matching is more intuitive
- Catch-all routes use `path: "*"` instead of no path

### Route Helpers

Route helper functions (navigation functions) are preserved in the `handle` property. The `LinkHandler` utility should continue to work, but may need minor updates to extract helpers from `handle.helper` and `handle.helpers` instead of top-level properties.

### SSR Considerations

v6 SSR uses `createStaticRouter` which requires:

- Routes array
- Request location
- Router state (if hydrating)

## Files to Create

1. `src/frontend/routes-v6.js` - New v6-compatible route definitions (static file with direct component imports)
2. `src/routes/createRouter.js` - Router creation function that imports routes-v6.js
3. `src/frontend/components/OutletWithDrawer.js` - Wrapper component for drawer support
4. `script/convert-routes-to-v6.js` (optional) - One-time conversion script to help generate routes-v6.js (if using Option B)

## Files to Modify

1. `src/global/containers/App/index.js` - Router setup
2. `src/global/containers/Manifold/index.js` - Replace renderRoutes
3. `src/frontend/containers/Frontend/index.js` - Replace renderRoutes
4. All wrapper components using `childRoutes` or `renderRoutes`
5. `src/entry-ssr.js` - SSR router setup and redirect handling (add try/catch for Response objects)
6. `src/hoc/Authorize/index.js` - Handle SSR redirects (throw Response objects)
7. `src/hoc/redirectIfLibraryDisabled/index.js` - Update staticContext pattern
8. `src/frontend/components/utility/RedirectIfLibraryModeDisabled.js` - Update staticContext pattern
9. Components that use `route` prop - Update to use `useMatches()` hook
10. `src/helpers/linkHandler.js` - Update to extract helpers from `handle` property (if needed)
11. `package.json` - Dependencies

## Files to Keep (for now)

- Router helper files (backend/reader still use them)
- Backend and reader route files (out of scope)
- `src/frontend/routes.js` - Keep temporarily for reference during migration
