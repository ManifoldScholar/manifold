# React Router v6 API Guide

This guide covers React Router v6 APIs and patterns. For migrating from v5 to v6 using the compat package, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md). For the full migration plan, see [REACT_ROUTER_V6_MIGRATION_PLAN.md](./REACT_ROUTER_V6_MIGRATION_PLAN.md).

## Router Setup

v6 uses `createBrowserRouter` and `RouterProvider` instead of `BrowserRouter` for client-side routing.

### Basic Setup

```javascript
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}
```

**Important**: `RouterProvider` does not accept children. It renders the matched route directly based on the router configuration.

### Creating Routes

Routes are typically defined in a separate file and imported:

```javascript
// routes.js
import Home from "./containers/Home";
import About from "./containers/About";

export const routes = [
  {
    element: <Home />,
    path: "/"
  },
  {
    element: <About />,
    path: "/about"
  }
];
```

### Root Route Pattern

For applications with global UI (notifications, overlays, etc.), use a root route element that wraps all other routes:

```javascript
// createRouter.js
import frontendRoutes from "./frontend/routes";
import Manifold from "./global/containers/Manifold";

export default function createRouter() {
  return [
    {
      element: <Manifold />, // Root wrapper component
      path: "/",
      children: frontendRoutes // All other routes as children
    }
  ];
}

// App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import createRouter from "./routes/createRouter";

const router = createBrowserRouter(createRouter());

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
```

The root component (e.g., `Manifold`) should render an `<Outlet />` to display child routes:

```javascript
// Manifold.js
import { Outlet } from "react-router-dom";

function Manifold() {
  return (
    <div className="global-container">
      <GlobalNotifications />
      <GlobalOverlays />
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

### Router Options

`createBrowserRouter` accepts options for future flags and basename:

```javascript
const router = createBrowserRouter(routes, {
  basename: "/app", // Base URL for all routes
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
```

## Route Structure

React Router v6 uses a different route structure than v5. Routes are defined as an array of route objects with JSX elements.

### Basic Route Definition

```javascript
// v6 route structure
const routes = [
  {
    element: <App />,
    path: "/",
    children: [
      {
        element: <Home />,
        index: true // Matches when path exactly matches parent
      },
      {
        element: <About />,
        path: "about"
      }
    ]
  }
];
```

### Key Differences from v5

- **`element`** instead of `component` - Routes use JSX elements directly
- **`children`** instead of `routes` - Nested routes are in `children` array
- **`index` routes** - Use `index: true` for routes that match the parent path exactly
- **Relative paths** - Child route paths are relative to parent by default
- **Array format** - Routes are defined as an array, not a single object

### Index Routes

Index routes match when the path exactly matches the parent route:

```javascript
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  children: [
    {
      index: true,  // Matches /projects/123 exactly
      element: <ProjectDetail />
    },
    {
      path: "search",  // Matches /projects/123/search
      element: <ProjectSearch />
    }
  ]
}
```

### Catch-All Routes

Use `path: "*"` for 404/NotFound routes:

```javascript
{
  element: <NotFound />,
  path: "*"  // Matches any unmatched path
}
```

**Important**: Catch-all routes should be placed last in the route array, as v6 matches routes in order.

## Route Metadata

In React Router v6, route metadata (name, helper functions, custom properties) is stored in the `handle` property. This is separate from the route's structural properties (`path`, `element`, `children`).

### Route Handle Structure

```javascript
const route = {
  element: <MyComponent />,
  path: "/my-path",
  handle: {
    name: "myRoute",
    helper: (id) => `/my-path/${id}`,
    helpers: {
      myRoute: (id) => `/my-path/${id}`,
      myRouteRelative: (id) => `my-path/${id}`
    },
    isLibrary: true,
    // Any custom metadata
    customProperty: "value"
  },
  children: [...] // Nested routes are on the route object, not in handle
};
```

### Accessing Route Metadata

**In Components** - Use `useMatches()` hook:

```javascript
import { useMatches } from "react-router-dom";

function MyComponent() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  const routeName = currentMatch.handle?.name;
  const helper = currentMatch.handle?.helper;
  const isLibrary = currentMatch.handle?.isLibrary;

  // Access parent route metadata
  const parentMatch = matches[matches.length - 2];
  const parentRouteName = parentMatch?.handle?.name;
}
```

**In Route Utilities** - Destructure from `handle`:

```javascript
// Prefer destructuring over enumerating each property
const handle = route?.handle || {};
const { name, helper, helpers } = handle;

// Note: children is a property of the route object itself, not handle
const childRoutes = route.children;
```

**Convention**: When extracting route metadata, always destructure from `route.handle`. The `children` array for nested routes is a property of the route object itself, not part of `handle`.

## Navigation and Links

### useNavigate Hook

```javascript
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  // Navigate to a path
  navigate("/projects/123");

  // Navigate with state
  navigate("/projects/123", { state: { from: "home" } });

  // Replace current history entry
  navigate("/projects/123", { replace: true });

  // Navigate relative
  navigate("../other-route");

  // Navigate back/forward
  navigate(-1); // Go back
  navigate(1); // Go forward
}
```

### Link Component

```javascript
import { Link } from "react-router-dom";

// Basic link
<Link to="/projects/123">View Project</Link>

// Link with state
<Link to="/projects/123" state={{ from: "home" }}>
  View Project
</Link>

// Relative link
<Link to="../other-route">Other Route</Link>
```

### NavLink Component

```javascript
import { NavLink } from "react-router-dom";

// Active link styling
<NavLink
  to="/projects"
  className={({ isActive }) => isActive ? "active" : ""}
>
  Projects
</NavLink>

// Or use the style prop
<NavLink
  to="/projects"
  style={({ isActive }) => ({
    color: isActive ? "red" : "blue"
  })}
>
  Projects
</NavLink>
```

### Navigate Component

Use for declarative redirects:

```javascript
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

## Nested Routes and Outlets

v6 uses `<Outlet />` to render child routes instead of `renderRoutes()`.

### Basic Outlet Usage

```javascript
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
}
```

### Outlet with Context

Pass data to child routes via context:

```javascript
function ProjectWrapper({ project, settings }) {
  return (
    <div>
      <ProjectHeader project={project} />
      <Outlet context={{ project, settings }} />
    </div>
  );
}

// Child component accesses context
import { useOutletContext } from "react-router-dom";

function ProjectDetail() {
  const { project, settings } = useOutletContext();
  return <div>{project.name}</div>;
}
```

### useMatches Hook

Get all matched routes from root to current:

```javascript
import { useMatches } from "react-router-dom";

function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav>
      {matches.map((match, index) => (
        <span key={match.pathname}>
          {match.handle?.name || match.pathname}
          {index < matches.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
}
```

## Route Parameters

### useParams Hook

Access route parameters:

```javascript
import { useParams } from "react-router-dom";

// Route: /projects/:id
function ProjectDetail() {
  const { id } = useParams();
  // id will be the value from the URL
}
```

### useSearchParams Hook

Access and update URL search parameters:

```javascript
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  const updateQuery = newQuery => {
    setSearchParams({ q: newQuery });
  };
}
```

### useLocation Hook

Access current location:

```javascript
import { useLocation } from "react-router-dom";

function MyComponent() {
  const location = useLocation();

  // location.pathname - current path
  // location.search - query string
  // location.hash - hash fragment
  // location.state - state passed via navigate()
}
```

## SSR with v6

v6 uses `createStaticRouter` and `StaticRouterProvider` for SSR instead of `StaticRouter`.

### Basic SSR Setup

```javascript
import {
  createStaticRouter,
  StaticRouterProvider
} from "react-router-dom/server";
import { createRoutes } from "./routes";

const render = async (req, res) => {
  const routes = createRoutes();

  const router = createStaticRouter(routes, {
    location: req.url
  });

  const html = ReactDOM.renderToString(
    <StaticRouterProvider router={router} />
  );

  res.send(html);
};
```

### Handling Redirects in SSR

v6 handles redirects differently than v5. For component-level redirects during SSR:

```javascript
// In component
if (needsRedirect) {
  if (__SERVER__) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/redirect-path" }
    });
  }
  return <Navigate to="/redirect-path" replace />;
}

// In SSR render function
try {
  const html = ReactDOM.renderToString(app);
} catch (error) {
  if (error instanceof Response && error.status >= 300 && error.status < 400) {
    const redirectUrl = error.headers.get("Location");
    return res.redirect(redirectUrl);
  }
  throw error;
}
```

## Route Helpers

Route helper functions (navigation functions) are stored in `route.handle.helper` or `route.handle.helpers`. These are used by `LinkHandler` to generate URLs programmatically.

### Helper Function Structure

```javascript
{
  element: <ProjectDetail />,
  path: "/projects/:id",
  handle: {
    name: "frontendProject",
    helper: (id) => `/projects/${id}`
  }
}

// Multiple helpers
{
  element: <ResourceDetail />,
  path: "/projects/:id/resource/:resourceId",
  handle: {
    name: "frontendProjectResource",
    helpers: {
      frontendProjectResource: (projectId, resourceId) =>
        `/projects/${projectId}/resource/${resourceId}`,
      frontendProjectResourceRelative: (resourceId) =>
        `resource/${resourceId}`
    }
  }
}
```

### Using Route Helpers

Route helpers are accessed via `LinkHandler`:

```javascript
import lh from "helpers/linkHandler";

// Single helper
const url = lh.link("frontendProject", projectId);

// Multiple helpers (use the helper name as the route name)
const url = lh.link("frontendProjectResource", projectId, resourceId);
const relativeUrl = lh.link("frontendProjectResourceRelative", resourceId);
```

### Helper Functions with Query Strings

```javascript
{
  element: <Projects />,
  path: "all",
  handle: {
    name: "frontendProjectsAll",
    helper: (params = {}) => {
      const query = queryString.stringify(params);
      if (!query) return "/projects/all";
      return `/projects/all?${query}`;
    }
  }
}

// Usage
lh.link("frontendProjectsAll", { page: 2, sort: "name" });
// → "/projects/all?page=2&sort=name"
```

## Navigation Blocking

v6 handles navigation blocking differently than v5. Instead of requiring router-level configuration, blocking is handled at the component level using the `unstable_useBlocker` hook.

### Key Differences from v5

**v5 Approach:**

- Required `getUserConfirmation` prop on `BrowserRouter`
- Router handled the confirmation flow globally
- `Prompt` component triggered the router's confirmation

**v6 Approach:**

- No router-level configuration needed
- Components use `unstable_useBlocker` hook directly
- Each component manages its own blocking logic

### Using unstable_useBlocker

The `unstable_useBlocker` hook blocks navigation based on a condition:

```javascript
import { unstable_useBlocker } from "react-router-dom";

function MyComponent() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const blocker = unstable_useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  // Handle blocked navigation
  useEffect(() => {
    if (blocker.state === "blocked") {
      // Show confirmation dialog
      const proceed = confirm("You have unsaved changes. Leave anyway?");
      if (proceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);
}
```

### NavigationBlocker Component

For a reusable solution, use the `NavigationBlocker` component (available at `global/components/router/NavigationBlocker`):

```javascript
import NavigationBlocker from "global/components/router/NavigationBlocker";

function FormComponent() {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <>
      <NavigationBlocker
        when={isDirty}
        message="You have unsaved changes. Are you sure you want to leave?"
      />
      <form>{/* form content */}</form>
    </>
  );
}
```

### Migration from Prompt

**Before (v5):**

```javascript
import { Prompt } from "react-router-dom";

<Prompt when={this.isBlocking()} message="You have unsaved changes." />;
```

**After (v6):**

```javascript
import NavigationBlocker from "global/components/router/NavigationBlocker";

<NavigationBlocker
  when={this.isBlocking()}
  message="You have unsaved changes."
/>;
```

The API is identical - just replace `Prompt` with `NavigationBlocker`.

### Important Notes

- **No router configuration**: Unlike v5, you don't need to pass `getUserConfirmation` to `RouterProvider` or `createBrowserRouter`
- **Component-level**: Each component that needs blocking manages it independently
- **Blocker state**: The blocker object has a `state` property that can be `"unblocked"` or `"blocked"`
- **Actions**: Call `blocker.proceed()` to allow navigation, or `blocker.reset()` to cancel it
- **Unstable API**: The `unstable_` prefix indicates this API may change in future versions

## Implementation Status

### Completed (Client-Side)

The frontend routes have been successfully migrated to React Router v6:

1. **Route Structure** (`src/frontend/routes-v6.js`)

   - All routes converted to v6 format with `element`, `children`, and `handle` properties
   - Index routes properly configured (no children on index routes)
   - Route metadata stored in `handle` property

2. **Router Setup** (`src/routes/createRouter.js`, `src/global/containers/App/index.js`)

   - Client-side uses `createBrowserRouter` and `RouterProvider`
   - Routes wrapped with Manifold as root route
   - Future flags enabled for v7 compatibility

3. **Outlet Migration**

   - All `renderRoutes()` calls replaced with `<Outlet />`
   - All `childRoutes()` calls replaced with `<Outlet />` or `OutletWithDrawer`
   - Components updated to use `useOutletContext()` for accessing parent data

4. **Drawer Support** (`src/global/components/router/OutletWithDrawer/index.js`)

   - Created `OutletWithDrawer` component for routes that need drawer functionality
   - Automatically detects child route matches to open/close drawers

5. **Component Updates**

   - Wrapper components (ProjectsWrapper, JournalsWrapper, ProjectWrapper, etc.) use `<Outlet />`
   - Child components use `useOutletContext()` to access props previously passed via `childProps`
   - All route prop dependencies removed

6. **Removed v5-compat Dependencies (Homepage)**

   - Homepage route components updated to use native v6 hooks
   - `CollectionNavigation`, `ScrollToTop`, `Analytics`, `redirectIfLibraryDisabled`, and `CheckFrontendMode` now use `react-router-dom` instead of `react-router-dom-v5-compat`
   - Homepage route is fully on native v6 APIs

7. **Fixed Circular Dependencies**

   - Updated `redirectIfLibraryDisabled` to use `useMatches()` instead of importing routes
   - Eliminated circular dependency: `Frontend` → `redirectIfLibraryDisabled` → `routes-v6` → `Frontend`
   - Uses router context to access route metadata at runtime

8. **Navigation Component Route Matching**

   - Updated `Mobile.js` and `Breadcrumb.js` to use `useMatches()` for route matching
   - Replaced `matchPath()` calls that were trying to match route objects (v5 pattern)
   - Navigation components now check route activation by route name from `handle.name`

9. **Nested Route Container Migration**
   - Updated all nested route containers to use `useOutletContext()` instead of props
   - Migrated 9 components: ProjectSearch, ProjectResources, ResourceDetail, ProjectResourceCollections, ResourceCollectionDetail, EventList, JournalIssuesList, JournalVolumesList, VolumeDetail
   - Removed PropTypes definitions for props that are now accessed via context
   - All child components now consistently use `useOutletContext()` to access parent route data

### Key Lessons Learned

**Index Routes Cannot Have Children**

- In v6, routes with `index: true` cannot have `children`
- Use `path: ""` (empty string) for layout wrappers that need children
- Only use `index: true` for leaf routes (routes with no children)

**Example:**

```javascript
// ❌ Invalid - index route with children
{
  element: <Wrapper />,
  index: true,
  children: [...] // Error: Cannot specify children on an index route
}

// ✅ Valid - empty path for layout wrapper
{
  element: <Wrapper />,
  path: "",
  children: [
    {
      index: true, // Leaf route - no children
      element: <Content />
    }
  ]
}
```

**Route Structure Pattern**

- Root route: `path: "/"` (Manifold)
- Layout wrappers: `path: ""` (matches parent exactly, can have children)
- Index routes: `index: true` (matches parent exactly, no children)
- Child routes: `path: "relative-path"` (relative to parent)

**Context Passing**

- Use `<Outlet context={{ ... }} />` to pass data to child routes
- Child components use `useOutletContext()` to access the context
- Replaces the `childProps` pattern from `childRoutes()`

**Migration Pattern:**

When migrating nested route containers from props to context:

1. **Remove props from function signature:**

   ```javascript
   // Before
   export default function ProjectResourcesContainer({ project, journalBreadcrumbs }) {

   // After
   export default function ProjectResourcesContainer() {
     const { project, journalBreadcrumbs } = useOutletContext() || {};
   ```

2. **Add useOutletContext import:**

   ```javascript
   import { useOutletContext } from "react-router-dom";
   ```

3. **Remove PropTypes:**

   ```javascript
   // Remove these
   ProjectResourcesContainer.propTypes = {
     project: PropTypes.object,
     journalBreadcrumbs: PropTypes.array
   };
   ```

4. **Use optional chaining:**
   - Always use `|| {}` fallback: `useOutletContext() || {}`
   - This prevents errors if context is undefined (e.g., during SSR or before parent renders)

**Components that pass context:**

- `ProjectWrapper` passes: `project`, `response`, `settings`, `journalBreadcrumbs`
- `JournalWrapper` passes: `journal`, `response`
- `ReadingGroupHomepage.Fetch` passes: `readingGroup`, `categories`, `responses`, `navigate`, `refresh`
- `ReadingGroupMembers.Wrapper` passes: `readingGroup`, plus any props from parent

**Drawer Routes with Persistent List Content**

When you need to render a list that stays visible while drawer routes open on top of it (e.g., a list page with a "new" form in a drawer), use this pattern:

**Route Structure:**

```javascript
{
  element: <MyReadingGroups.Wrapper />,
  path: "my/groups",
  children: [
    {
      index: true,
      element: null  // Index route renders nothing - list is always visible from wrapper
    },
    {
      element: <MyReadingGroups.New />,
      path: "new",
      handle: {
        name: "frontendMyReadingGroupsNew",
        helper: () => "/my/groups/new",
        drawer: true  // Mark as drawer route
      }
    }
  ]
}
```

**Wrapper Component Pattern:**

The wrapper component renders the list directly (not as a route) and includes `OutletWithDrawer` to render drawer routes. Note that `OutletWithDrawer` handles the `<Outlet />` internally, so you don't need to pass it as a child:

```javascript
import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import List from "./List";

export default function MyReadingGroupsContainer() {
  const navigate = useNavigate();
  const refreshRef = useRef(null);

  const handleNewGroupSuccess = useCallback(() => {
    navigate(lh.link("frontendMyReadingGroups"));
    if (refreshRef.current?.refresh) {
      refreshRef.current.refresh();
    }
  }, [navigate]);

  return (
    <>
      <List ref={refreshRef} />
      <OutletWithDrawer
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl: lh.link("frontendMyReadingGroups")
        }}
        context={{
          onSuccess: handleNewGroupSuccess
        }}
      />
    </>
  );
}
```

**List Component Pattern:**

The list component uses `forwardRef` and `useImperativeHandle` to expose a `refresh` function to the parent wrapper:

```javascript
import { useImperativeHandle, forwardRef, useMemo } from "react";

const MyReadingGroupsListContainer = forwardRef((props, ref) => {
  const { data: readingGroups, meta, refresh } = useFetch({
    request: [meAPI.readingGroups, filters, pagination]
  });

  // Expose refresh function to parent via ref
  useImperativeHandle(ref, () => ({
    refresh
  }));

  return (
    // ... list content
  );
});
```

**How It Works:**

- On `/my/groups`: The wrapper renders the List component, and the index route renders nothing (element: null). The list is visible.
- On `/my/groups/new`: The wrapper still renders the List component (always visible), and the New component renders inside the drawer via `<Outlet />` in `OutletWithDrawer`. The drawer opens because the route has `drawer: true` in its handle.

**Key Points:**

- The list is rendered directly in the wrapper, not as a route element
- The index route uses `element: null` so nothing additional renders
- Drawer routes are marked with `drawer: true` in their handle
- `OutletWithDrawer` handles the `<Outlet />` internally - you don't need to pass it as a child
- Use refs to expose refresh functions from list to wrapper for post-action updates

**Removing v5-compat Dependencies**

- As routes are migrated, update components to use native v6 hooks from `react-router-dom`
- Replace `react-router-dom-v5-compat` imports with `react-router-dom` for:
  - `useLocation` → `react-router-dom`
  - `useNavigate` → `react-router-dom`
  - `NavLink` → `react-router-dom`
  - `Link` → `react-router-dom`
  - `useRouteMatch` → `useMatch` from `react-router-dom`
- Start with homepage route components and work outward
- The compat package can remain for routes that haven't been migrated yet

**useRouteMatch → useMatch Migration:**

In v5, `useRouteMatch()` was used to check if the current route matches a pattern. In v6, this is replaced with `useMatch()`.

```javascript
// v5
import { useRouteMatch } from "react-router-dom";

function MyComponent() {
  const isSignUp = useRouteMatch("/signup");
  // isSignUp is a match object or null
  if (isSignUp) {
    // Route matches
  }
}

// v6
import { useMatch } from "react-router-dom";

function MyComponent() {
  const isSignUp = useMatch("/signup");
  // isSignUp is a match object or null
  if (isSignUp) {
    // Route matches
  }
}
```

**Key differences:**

- `useMatch(pattern)` takes a pattern string (e.g., `"/signup"` or `"/projects/:id"`)
- Returns a match object if the current location matches the pattern, or `null` otherwise
- The match object contains `params`, `pathname`, `pathnameBase`, and `pattern`
- For boolean checks, the truthiness of the return value works the same way (match object is truthy, `null` is falsy)

**Avoiding Circular Dependencies with Route Metadata**

- **Problem**: Importing route files in components that are used by those routes creates circular dependencies
- **Solution**: Use `useMatches()` hook instead of importing routes directly
- `useMatches()` provides route metadata at runtime from the router context, avoiding import cycles

**Example:**

```javascript
// ❌ Creates circular dependency
import frontendRoutes from "frontend/routes-v6";
import { matchRoutes } from "react-router-dom";

function MyComponent() {
  const matches = matchRoutes(frontendRoutes, location.pathname);
  // ...
}

// ✅ No circular dependency - uses router context
import { useMatches } from "react-router-dom";

function MyComponent() {
  const matches = useMatches();
  // matches contains all matched routes with their handle metadata
  const isLibrary = matches.every(match => match.handle?.isLibrary === true);
  // ...
}
```

**When to use `useMatches()` vs `matchRoutes()`:**

- **`useMatches()`**: Use in components that are part of the route tree (avoids circular dependencies)
- **`matchRoutes()`**: Use in utilities/helpers that are not part of the route tree (e.g., link handlers, route utilities)

**Route Matching in Navigation Components**

When building navigation components (menus, breadcrumbs, etc.) that need to check if a route is active, use `useMatches()` instead of `matchPath()` with route objects.

**Problem with `matchPath()` in v6:**

- In v5, `matchPath(pathname, route)` accepted a route object
- In v6, `matchPath()` only accepts a pattern string: `matchPath({ path: "/pattern" }, pathname)`
- Route objects from `LinkHandler.routeFromName()` are v6 route objects with `path`, `element`, `handle`, etc.

**Solution: Use `useMatches()`**

```javascript
// ❌ Doesn't work - matchPath needs a pattern string, not a route object
import { matchPath } from "react-router-dom";
const route = lh.routeFromName(link.route);
const match = matchPath(location.pathname, route); // route is an object, not a string

// ✅ Works - useMatches() provides route metadata from router context
import { useMatches } from "react-router-dom";

function NavigationComponent() {
  const matches = useMatches();

  const isRouteActive = routeName => {
    return matches.some(match => match.handle?.name === routeName);
  };

  // Check if a link's route is active
  links.forEach(link => {
    const routeMatch = matches.find(m => m.handle?.name === link.route);
    if (routeMatch) {
      // Route is active
    }
  });
}
```

**Benefits:**

- No need to extract paths from route objects
- Works with route names stored in `handle.name`
- Avoids circular dependencies
- More performant (uses router context directly)

**SSR Status**

- SSR is temporarily disabled to allow testing client-side v6 router
- SSR migration to `createStaticRouter` is pending
- See `src/entry-ssr.js` for temporary SSR disable code

### Pending

- SSR migration to `createStaticRouter` and `StaticRouterProvider`
- Update redirect handling in SSR (Authorize, redirectIfLibraryDisabled)
- Remove `react-router-config` dependency after full migration
- Remove unused router helpers (childRoutes, ChildSwitch, etc.) after backend/reader routes migrate

## Additional Resources

- [React Router v6 Documentation](https://reactrouter.com/)
- [React Router v6 Migration Guide](https://reactrouter.com/en/main/upgrading/v5)
- [REACT_ROUTER_V6_MIGRATION_PLAN.md](./REACT_ROUTER_V6_MIGRATION_PLAN.md) - Full migration plan for this project
