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

**Migration from v5:**

v6 NavLink has breaking changes from v5:

1. **`exact` prop → `end` prop**: The `exact` prop is replaced with `end`. Both work the same way - when `true`, the link is only active when the path matches exactly.

```javascript
// v5
<NavLink to="/" exact>Home</NavLink>

// v6
<NavLink to="/" end>Home</NavLink>
```

2. **`activeClassName` prop → `className` function**: The `activeClassName` prop is removed. Use `className` as a function that receives `{ isActive }` instead.

```javascript
// v5
<NavLink
  to="/projects"
  className="nav-link"
  activeClassName="nav-link--active"
>
  Projects
</NavLink>

// v6
<NavLink
  to="/projects"
  className={({ isActive }) =>
    isActive ? "nav-link nav-link--active" : "nav-link"
  }
>
  Projects
</NavLink>
```

**With classNames utility:**

```javascript
import classNames from "classnames";

<NavLink
  to="/projects"
  className={({ isActive }) =>
    classNames("nav-link", {
      "nav-link--active": isActive
    })
  }
>
  Projects
</NavLink>;
```

**With Emotion Styled Components:**

When using Emotion styled components with NavLink, you cannot return Emotion CSS objects from the `className` function. Instead, add an `&.active` selector to your styled component and return the string `"active"` from the `className` function:

```javascript
// styles.js
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

export const Link = styled(NavLink)`
  color: var(--color-base-neutral80);
  background-color: var(--box-bg-color);

  &:hover {
    --box-bg-color: var(--color-base-neutral20);
    color: var(--strong-color);
  }

  &.active {
    --box-bg-color: var(--color-base-neutral10);
    color: var(--strong-color);
  }
`;

// Component
import { useLocation } from "react-router-dom";
import * as Styled from "./styles";

function Navigation({ links }) {
  const location = useLocation();

  return (
    <nav>
      {links.map(({ to, exact, isActive, text }) => (
        <Styled.Link
          key={text}
          to={to}
          end={exact}
          className={({ isActive: linkIsActive }) => {
            // Use custom isActive function if provided, otherwise use default
            const shouldBeActive = isActive
              ? isActive(null, location)
              : linkIsActive;
            return shouldBeActive ? "active" : undefined;
          }}
        >
          {text}
        </Styled.Link>
      ))}
    </nav>
  );
}
```

**Key points:**

- Add `&.active` selector to your styled component for active styles
- Return the string `"active"` from NavLink's `className` function (not an Emotion CSS object)
- Handle custom `isActive` logic by checking it separately and using it in the `className` function
- Use `useLocation()` hook if you need the location for custom `isActive` functions

**Important Notes:**

- `exact` prop will cause a warning in v6 - replace with `end`
- `activeClassName` prop will cause a warning in v6 - replace with `className` function
- The `className` function receives an object with `isActive` and `isPending` properties
- You can still use `isActive` prop for custom matching logic (this is separate from the `activeClassName` migration)

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

v6 uses `createStaticHandler`, `createStaticRouter`, and `StaticRouterProvider` for SSR instead of `StaticRouter`.

### Basic SSR Setup

v6 SSR requires two steps:

1. Create a static handler and query it to get the context
2. Create a static router from the context
3. Use `StaticRouterProvider` to render

```javascript
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from "react-router-dom/server";
import { createRoutes } from "./routes";

const render = async (req, res) => {
  const routes = createRoutes();

  // Step 1: Create handler and query to get context
  const handler = createStaticHandler(routes);
  const context = await handler.query(
    new Request(`http://localhost${req.url}`)
  );

  // Step 2: Handle redirects from route loaders/actions
  if (
    context instanceof Response &&
    context.status >= 300 &&
    context.status < 400
  ) {
    const redirectUrl = context.headers.get("Location");
    return res.redirect(redirectUrl);
  }

  // Step 3: Create static router with context
  const staticRouter = createStaticRouter(routes, context);

  // Step 4: Render with StaticRouterProvider
  const html = ReactDOM.renderToString(
    <StaticRouterProvider router={staticRouter} context={context} />
  );

  res.send(html);
};
```

**Important Notes:**

- `createStaticRouter` requires a `StaticHandlerContext` object (from `handler.query()`), not an options object
- The context includes matched routes, loader data, and other route information
- `StaticRouterProvider` does not accept children - it renders the matched route directly

### Handling Redirects in SSR

v6 handles redirects in two places:

**1. Route Loader/Action Redirects** (handled via context):

Route loaders/actions can throw `redirect()` which returns a Response object. This is caught when querying the handler:

```javascript
// In route loader
import { redirect } from "react-router-dom";

export async function loader() {
  if (!isAuthorized) {
    throw redirect("/login");
  }
  return data;
}

// In SSR render function
const context = await handler.query(new Request(`http://localhost${req.url}`));

// Context will be a Response object if loader redirected
if (
  context instanceof Response &&
  context.status >= 300 &&
  context.status < 400
) {
  const redirectUrl = context.headers.get("Location");
  return res.redirect(redirectUrl);
}
```

**2. Component-Level Redirects** (handled via try/catch):

Components can throw Response objects during render for SSR redirects:

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
  // Catch redirect Response objects thrown by components
  if (error instanceof Response && error.status >= 300 && error.status < 400) {
    const redirectUrl = error.headers.get("Location");
    return res.redirect(redirectUrl);
  }
  throw error;
}
```

**Component-Level Redirect Pattern:**

This pattern is used in several components that need to redirect based on component state or props:

- **EventList** - Redirects to project detail if `hideActivity` is enabled
- **ReadingGroup/Members/Wrapper** - Redirects non-members to reading group detail
- **ReadingGroup/Homepage/Wrapper** - Redirects to annotations if homepage shouldn't be shown
- **Authorize HOC** - Redirects unauthenticated users to login
- **redirectIfLibraryDisabled HOC** - Redirects when library mode is disabled

**Example Implementation:**

```javascript
// EventList/index.js
if (hideActivity) {
  const redirectUrl = lh.link("frontendProjectDetail", project.attributes.slug);

  if (__SERVER__) {
    throw new Response(null, {
      status: 302,
      headers: { Location: redirectUrl }
    });
  }

  return <Navigate to={redirectUrl} replace />;
}
```

**Key Points:**

- Always check `__SERVER__` before throwing Response (SSR only)
- Use `Navigate` component for client-side redirects
- Include `replace` prop on `Navigate` to replace history entry
- Redirect URL should be calculated before the conditional check
- This pattern works for both SSR and client-side navigation

**Why Two Places?**

- **Context check**: Handles redirects from route loaders/actions (data loading phase)
- **Catch block**: Handles redirects thrown by components during render (component rendering phase)

Both are necessary because they occur at different phases of the SSR lifecycle.

## Error Boundaries

React Router v6 supports error boundaries via the `errorElement` prop on routes. This catches errors from route loaders, actions, and component rendering.

### Route-Level Error Boundaries

Add an `errorElement` to your route configuration to catch errors at the route level:

```javascript
// routes/createRouter.js
import RouteError from "global/components/FatalError/RouteError";

const routes = [
  {
    element: <Manifold />,
    path: "/",
    errorElement: <RouteError />,
    children: frontendRoutesV6
  }
];
```

The error element component uses `useRouteError()` to access the error:

```javascript
// RouteError.js
import { useRouteError, useLocation } from "react-router-dom";
import { formatError } from "./Boundary";
import AppFatalError from "./AppWrapper";

export default function RouteError() {
  const error = useRouteError();
  const location = useLocation();

  return (
    <AppFatalError
      fatalError={formatError(error)}
      redirectPath={location.pathname}
    />
  );
}
```

### Component-Level Error Boundaries

For errors that occur outside the route tree (e.g., in global components), use a component-level error boundary:

```javascript
// Boundary.js
import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";
import AppFatalError from "./AppWrapper";

export function FatalErrorDisplay({ error, resetErrorBoundary }) {
  const location = useLocation();
  const fatalError = formatError(error);

  return (
    <AppFatalError
      dismiss={resetErrorBoundary}
      fatalError={fatalError}
      redirectPath={location.pathname}
    />
  );
}

export default function FatalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <FatalErrorDisplay
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

Usage in components:

```javascript
// Manifold.js
import FatalErrorBoundary from "global/components/FatalError/Boundary";

function Manifold() {
  return (
    <FatalErrorBoundary>
      <Outlet />
    </FatalErrorBoundary>
  );
}
```

### Error Formatting

The `formatError` function handles different error types:

```javascript
export const formatError = error => {
  // Handle Response objects (from route loaders/actions)
  if (error instanceof Response) {
    return {
      type: "HTTP_RESPONSE",
      error: {
        status: error.status || 500,
        heading: error.status === 404 ? "Not Found" : "Error",
        body: error.statusText || "An error occurred"
      }
    };
  }

  // Handle JavaScript Error objects
  if (error instanceof Error) {
    return {
      type: "JS_EXCEPTION",
      error: {
        status: 500,
        heading: "Client Javascript Exception",
        body:
          error.name === "Error"
            ? `"${error.message}"`
            : `"${error.name}: ${error.message}"`,
        clientTrace: error.stack,
        clientTraceTruncate: 5
      }
    };
  }

  // Handle other error types (fallback)
  return {
    type: "UNKNOWN_ERROR",
    error: {
      status: 500,
      heading: "Error",
      body: String(error)
    }
  };
};
```

### Key Points

- **Route errors**: Use `errorElement` prop on routes, accessed via `useRouteError()` hook
- **Component errors**: Use `react-error-boundary`'s `ErrorBoundary` component
- **Error types**: Handle both `Error` objects and `Response` objects (from loaders/actions)
- **Location**: Components use `useLocation()` hook directly (no need to pass as prop)
- **Reset**: Route errors reset automatically on location change (v6 behavior), component errors use `resetErrorBoundary` callback

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

### LinkHandler Registration Pattern

To avoid circular dependencies, routes are registered with `LinkHandler` after they're created, not during module evaluation:

```javascript
// createRouter.js
import frontendRoutesV6 from "frontend/routes-v6";
import linkHandler from "helpers/linkHandler";

export default function createRouter() {
  const routes = [
    {
      element: <Manifold />,
      path: "/",
      children: frontendRoutesV6
    }
  ];

  // Register routes with linkHandler after they're created
  // This breaks the circular dependency since routes are already loaded
  // when this function is called, so there's no import cycle
  linkHandler.registerRoutes(frontendRoutesV6);

  return routes;
}
```

**Why this pattern?**

- `LinkHandler` needs access to routes to extract helper functions
- Components in routes may import `LinkHandler` (creating a cycle)
- Registering routes after creation breaks the static import cycle
- Routes are registered at runtime when `createRouter()` is called

## Navigation Blocking

v6 handles navigation blocking differently than v5. Instead of requiring router-level configuration, blocking is handled at the component level using the `useBlocker` hook.

### Key Differences from v5

**v5 Approach:**

- Required `getUserConfirmation` prop on `BrowserRouter`
- Router handled the confirmation flow globally
- `Prompt` component triggered the router's confirmation

**v6 Approach:**

- No router-level configuration needed
- Components use `useBlocker` hook directly
- Each component manages its own blocking logic

### Using useBlocker

The `useBlocker` hook blocks navigation based on a condition:

```javascript
import { useBlocker } from "react-router-dom";

function MyComponent() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const blocker = useBlocker(
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
- **Stable API**: `useBlocker` is the stable API in React Router v6.4+ (previously `unstable_useBlocker`)

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

10. **SSR Migration** (`src/entry-ssr.js`, `src/global/containers/App/index.js`)

- Migrated SSR to use `createStaticHandler` and `createStaticRouter`
- Updated App component to use `StaticRouterProvider` for SSR
- Implemented redirect handling for route loaders/actions (via context) and component-level redirects (via try/catch)
- Removed temporary SSR disable code
- SSR now fully functional with v6 router

11. **Error Boundaries** (`src/global/components/FatalError/Boundary.js`, `src/global/components/FatalError/RouteError.js`)

- Refactored `FatalErrorBoundary` from class component to functional components
- Created `RouteError` component for route-level errors using `errorElement` prop
- Created `FatalErrorBoundary` wrapper for component-level errors using `react-error-boundary`
- Added `errorElement: <RouteError />` to root route in `createRouter.js`
- Both error boundaries use shared `formatError` function to handle Error objects and Response objects
- Components use `useLocation()` hook directly (no location prop needed)

12. **NavLink Migration** (`src/global/components/navigation/Mobile.js`, `src/frontend/components/reading-group/headings/parts/Navigation/index.js`)

- Updated all NavLink components to use v6 API
- Replaced `exact` prop with `end` prop
- Replaced `activeClassName` prop with `className` function
- Updated Emotion styled NavLinks to use `&.active` selector pattern
- All navigation components now v6 compatible

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

- SSR has been migrated to v6's `createStaticHandler` and `createStaticRouter`
- App component updated to use `StaticRouterProvider` for SSR
- Redirect handling implemented for both route loaders/actions and component-level redirects
- See `src/entry-ssr.js` for implementation

### Pending

- Migrate backend routes to v6
- Migrate reader routes to v6
- Remove `react-router-config` dependency after full migration
- Remove unused router helpers (childRoutes, ChildSwitch, etc.) after backend/reader routes migrate

## Migration Checklist for Backend/Reader Routes

When migrating backend or reader routes, follow this checklist:

### 1. Create v6 Routes File

- [ ] Create new routes file (e.g., `src/backend/routes-v6.js` or `src/reader/routes-v6.js`)
- [ ] Convert all routes from `component: "Name"` to `element: <Name />`
- [ ] Convert `routes` arrays to `children`
- [ ] Convert `exact: true` routes with same path as parent to `index: true`
- [ ] Move route metadata (`name`, `helper`, `helpers`, `isLibrary`) to `handle` property
- [ ] Convert NotFound routes to `path: "*"` (place last in array)
- [ ] Use relative paths for nested routes
- [ ] Remove unnecessary optional parameters (use query params or index routes instead)

### 2. Update Router Creation

- [ ] Create or update router creation function (e.g., `src/routes/createRouter.js`)
- [ ] Import new v6 routes
- [ ] Wrap routes with root layout component (if needed)
- [ ] Register routes with `linkHandler.registerRoutes()` after creation
- [ ] Export router creation function

### 3. Update App Component

- [ ] Ensure App component uses `createBrowserRouter` for client-side
- [ ] Ensure App component uses `StaticRouterProvider` for SSR
- [ ] Pass `staticRouter` prop from SSR entry point
- [ ] Use `useMemo` to create router only once on client

### 4. Update Components

- [ ] Replace `renderRoutes(route.routes)` with `<Outlet />`
- [ ] Replace `childRoutes()` with `<Outlet context={{ ... }} />` or `OutletWithDrawer`
- [ ] Update child components to use `useOutletContext()` instead of props
- [ ] Remove `route` prop from component signatures and PropTypes
- [ ] Replace `useHistory` with `useNavigate`
- [ ] Replace `useRouteMatch` with `useMatch` or `useMatches`
- [ ] Replace `Prompt` with `NavigationBlocker` (if needed)
- [ ] Update navigation components to use `useMatches()` for route matching

### 5. Update SSR Entry Point

- [ ] Import `createStaticHandler` and `createStaticRouter` from `react-router-dom/server`
- [ ] Import router creation function
- [ ] Create handler with `createStaticHandler(routes)`
- [ ] Query handler with `await handler.query(new Request(...))`
- [ ] Handle redirects from context (Response objects)
- [ ] Create static router with `createStaticRouter(routes, context)`
- [ ] Pass `staticRouter` to App component
- [ ] Handle component-level redirects in try/catch block

### 6. Update Redirect Components

- [ ] Update `Authorize` HOC to throw Response objects for SSR redirects
- [ ] Update `redirectIfLibraryDisabled` to use `useMatches()` instead of importing routes
- [ ] Update any other redirect components to throw Response objects for SSR

### 7. Test

- [ ] Client-side navigation works
- [ ] SSR works correctly
- [ ] SSR redirects work (Authorize, redirectIfLibraryDisabled)
- [ ] Component-level redirects work (both client and SSR)
- [ ] Route helpers (navigation functions) still work via LinkHandler
- [ ] Route metadata accessible via `useMatches()`
- [ ] 404 handling works (NotFound component with catch-all routes)
- [ ] Context passing works (Outlet context)
- [ ] Drawer functionality works (if applicable)
- [ ] Route matching logic works for navigation helpers

### 8. Cleanup

- [ ] Remove old v5 routes file (after confirming v6 works)
- [ ] Remove `react-router-config` dependency (after all routes migrated)
- [ ] Remove unused router helpers (childRoutes, ChildSwitch, etc.)
- [ ] Update any remaining `react-router-dom-v5-compat` imports to `react-router-dom`

## Common Patterns and Examples

### App Component Pattern

The App component handles both client-side and SSR routing:

```javascript
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StaticRouterProvider } from "react-router-dom/server";
import createRouter from "routes/createRouter";

export default function App({
  store,
  staticContext,
  staticRequest,
  helmetContext = {},
  staticRouter
}) {
  // Create v6 router for client-side (only if not SSR)
  const browserRouter = useMemo(() => {
    if (!staticRequest) {
      const routes = createRouter();
      return createBrowserRouter(routes, {
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      });
    }
    return null;
  }, [staticRequest]);

  // Router provider - SSR uses StaticRouterProvider, client uses RouterProvider
  const routerProvider =
    staticRequest && staticRouter ? (
      <StaticRouterProvider router={staticRouter} context={staticContext} />
    ) : (
      <RouterProvider router={browserRouter} />
    );

  return (
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>{routerProvider}</HelmetProvider>
    </Provider>
  );
}
```

**Key points:**

- Use `useMemo` to create router only once on client
- Conditionally render `StaticRouterProvider` (SSR) or `RouterProvider` (client)
- Both providers render the matched route directly (no children)

### SSR Entry Point Pattern

```javascript
import {
  createStaticHandler,
  createStaticRouter
} from "react-router-dom/server";
import createRouter from "./routes/createRouter";

const render = async (req, res, store) => {
  // Create routes
  const routes = createRouter();

  // Create handler and query to get context
  const handler = createStaticHandler(routes);
  const context = await handler.query(
    new Request(`http://localhost${req.url}`)
  );

  // Handle redirects from route loaders/actions
  if (
    context instanceof Response &&
    context.status >= 300 &&
    context.status < 400
  ) {
    const redirectUrl = context.headers.get("Location");
    return res.redirect(redirectUrl);
  }

  // Create static router with context
  const staticRouter = createStaticRouter(routes, context);

  // Render app with static router
  const appComponent = (
    <App
      staticContext={routingContext}
      staticRequest={req}
      staticRouter={staticRouter}
      store={store}
    />
  );

  try {
    const html = ReactDOM.renderToString(appComponent);
    res.send(html);
  } catch (error) {
    // Handle component-level redirects
    if (
      error instanceof Response &&
      error.status >= 300 &&
      error.status < 400
    ) {
      const redirectUrl = error.headers.get("Location");
      return res.redirect(redirectUrl);
    }
    throw error;
  }
};
```

### Route Simplification Examples

**Before (v5):**

```javascript
{
  component: "Events",
  path: "/projects/:id/events/:page?",
  helper: (id, page) => `/projects/${id}/events${page ? `/${page}` : ""}`
}
```

**After (v6):**

```javascript
{
  element: <Events />,
  path: "events",  // Relative path, no page param
  handle: {
    name: "frontendProjectEvents",
    helper: (id, params = {}) => {
      const query = queryString.stringify(params);
      return `/projects/${id}/events${query ? `?${query}` : ""}`;
    }
  }
}
```

**Rationale:** If the component uses query parameters for pagination, don't include them in the path. Use query strings instead.

**Before (v5):**

```javascript
{
  component: "ReadingGroupMembers",
  path: "/reading-groups/:id/members/:membershipId?",
  routes: [
    {
      component: "ReadingGroupMembers.List",
      path: "/reading-groups/:id/members"
    }
  ]
}
```

**After (v6):**

```javascript
{
  element: <ReadingGroupMembers.Wrapper />,
  path: "members",
  children: [
    {
      index: true,  // Matches /reading-groups/:id/members exactly
      element: <ReadingGroupMembers.List />
    },
    {
      element: <ReadingGroupMembers.MemberEdit />,
      path: ":membershipId"
    }
  ]
}
```

**Rationale:** Remove optional parameters from parent routes. Use index routes for list views.

## Troubleshooting

### Circular Dependency Errors

**Problem:** `LinkHandler` imports routes, but routes import components that use `LinkHandler`.

**Solution:** Use the registration pattern:

1. Don't import routes in `LinkHandler`
2. Create routes in a function (e.g., `createRouter()`)
3. Call `linkHandler.registerRoutes(routes)` after routes are created
4. This breaks the static import cycle

### SSR Redirects Not Working

**Problem:** Redirects work on client but not during SSR.

**Solution:** Ensure redirects throw Response objects:

```javascript
if (needsRedirect) {
  if (__SERVER__) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/redirect-path" }
    });
  }
  return <Navigate to="/redirect-path" replace />;
}
```

### Index Route Errors

**Problem:** "Cannot specify children on an index route" error.

**Solution:** Index routes cannot have children. Use `path: ""` for layout wrappers:

```javascript
// ❌ Invalid
{
  element: <Wrapper />,
  index: true,
  children: [...]
}

// ✅ Valid
{
  element: <Wrapper />,
  path: "",
  children: [
    {
      index: true,
      element: <Content />
    }
  ]
}
```

### Route Metadata Not Accessible

**Problem:** `useMatches()` returns undefined or missing handle data.

**Solution:** Ensure route metadata is in `handle` property, not top-level:

```javascript
// ❌ Wrong
{
  element: <Component />,
  path: "/path",
  name: "myRoute"  // Wrong location
}

// ✅ Correct
{
  element: <Component />,
  path: "/path",
  handle: {
    name: "myRoute"  // Correct location
  }
}
```

### Outlet Context Undefined

**Problem:** `useOutletContext()` returns undefined.

**Solution:** Always use optional chaining and provide fallback:

```javascript
const { project, settings } = useOutletContext() || {};
```

Also ensure parent component passes context:

```javascript
<Outlet context={{ project, settings }} />
```

## Additional Resources

- [React Router v6 Documentation](https://reactrouter.com/)
- [React Router v6 Migration Guide](https://reactrouter.com/en/main/upgrading/v5)
- [REACT_ROUTER_V6_MIGRATION_PLAN.md](./REACT_ROUTER_V6_MIGRATION_PLAN.md) - Full migration plan for this project
