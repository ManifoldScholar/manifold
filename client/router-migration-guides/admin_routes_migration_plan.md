<!-- f7bb0b8f-660c-46e8-8e60-1eb35210feeb 0bca181e-51c0-4b91-a92a-ad3265636474 -->

# Plan: Backend Routes React Router v6 Migration

## Overview

Migrate backend routes from `react-router-config` (v5) format to React Router v6 using `createBrowserRouter`, following the same patterns established in the frontend migration.

## Current State

- **Route definitions**: `src/backend/routes.js` - Object-based route definitions with string component names
- **Route containers**: `src/backend/containers/route-containers.js` - Component registry
- **Main container**: `src/backend/containers/Backend/index.js` - Class component using `childRoutes()`
- **Wrapper components**: Multiple class components using `childRoutes()` and `renderRoutes()`
- **Route integration**: Currently hydrated via `src/routes/index.js` and `src/routes/hydrate.js`
- **Router setup**: `src/routes/createRouter.js` currently only includes frontend routes

## Migration Strategy

Follow the same incremental approach used for frontend:

1. Create v6 routes file alongside existing routes
2. Migrate Backend container to functional component with Outlet
3. Update wrapper components incrementally
4. Integrate backend routes into createRouter
5. Test and verify functionality
6. Remove old route system once stable

## Phase 1: Create Backend v6 Routes File

**File**: `src/backend/routes-v6.js` (new file)

**Approach**: Manual conversion following frontend pattern

**Key conversions**:

- Convert `component: "ComponentName"` → `element: <ComponentName />` with direct imports
- Convert `routes` → `children` array
- Convert `exact: true` with same path as parent → `index: true`
- Move route metadata (`name`, `helper`) to `handle` property
- Convert NotFound route (no path) → `path: "*"`
- Convert absolute paths to relative paths where appropriate
- Import components from `src/backend/containers/route-containers.js`

**Example conversion**:

```javascript
// Before (v5)
{
  name: "backendProjects",
  exact: false,
  component: "ProjectsWrapper",
  path: "/backend/projects",
  helper: () => "/backend/projects",
  routes: [
    {
      name: "backendProjectsAll",
      exact: true,
      component: "ProjectsList",
      path: "/backend/projects/all",
      helper: () => "/backend/projects/all"
    }
  ]
}

// After (v6)
{
  element: <ProjectsWrapper />,
  path: "projects",
  handle: {
    name: "backendProjects",
    helper: () => "/backend/projects"
  },
  children: [
    {
      element: <ProjectsList />,
      path: "all",
      handle: {
        name: "backendProjectsAll",
        helper: () => "/backend/projects/all"
      }
    }
  ]
}
```

**Path adjustments**:

- Root backend route: `path: "/backend"` → `path: "/backend"` (absolute, top-level)
- Child routes: Remove `/backend` prefix, use relative paths
- Index routes: Use `index: true` when child path matches parent exactly

**Nested Route Parameter Naming**:

When migrating nested routes, ensure parameter names are unique to avoid conflicts. If a parent route uses `:id`, nested routes should use descriptive names like `:calloutId`, `:blockId`, `:textId`, etc.

**Problem**: If nested routes use the same parameter name (e.g., `:id`), `useParams()` in parent components will return the last matching parameter, causing bugs:

```javascript
// ❌ Problem: Both use :id
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  children: [
    {
      element: <ActionCalloutEdit />,
      path: "layout/action-callout/:id"  // Parent wrapper gets callout id, not project id!
    }
  ]
}
```

**Solution**: Use unique parameter names for nested routes:

```javascript
// ✅ Solution: Unique parameter names
{
  element: <ProjectWrapper />,
  path: "/projects/:id",
  children: [
    {
      element: <ActionCalloutEdit />,
      path: "layout/action-callout/:calloutId"  // Unique name
    },
    {
      element: <ContentBlockEdit />,
      path: "layout/content-blocks/:blockId"  // Unique name
    }
  ]
}
```

**Naming Pattern**: Use `:entityTypeId` format (e.g., `:calloutId`, `:blockId`, `:textId`, `:resourceId`)

**Migration Steps**:

1. Identify nested routes with `:id` parameters
2. Rename to descriptive names in route definitions
3. Update components to use new parameter names in `useParams()`
4. Update helper functions if needed
5. Test that parent components still access correct parent parameters

**Refinements**:

- **Dashboard**: Use `path: "dashboard"` for the Dashboard component and add an `index` route with `<Navigate to="dashboard" replace />` to preserve existing URL structure (`/backend/dashboard`).
- **Redirects**: Where `RedirectToFirstMatch` was used (e.g. `ProjectsWrapper`), prefer adding an `index` route with `<Navigate to="first-child" replace />` directly in the route config.

**useRedirectToFirstMatch Hook - When to Remove:**

The `useRedirectToFirstMatch` hook is often redundant when migrating to v6 route structure. Remove it if:

1. **Route structure already handles redirect**: If you've added an index route with `<Navigate to="..." replace />`, the redirect happens before the component renders
2. **Single authorization level**: If all child routes are protected by the same `Authorize` HOC on the parent wrapper
3. **Single candidate route**: If there's only one active candidate route (others are commented out or not yet implemented)

**Example - ProjectsWrapper:**

- Route structure has: `{ index: true, element: <Navigate to="all" replace /> }`
- All routes protected by: `<Authorize ability="update" entity={["project"]}>`
- Only one active candidate: `backendProjectsAll` (collections route commented out)
- **Result**: Hook removed - route structure handles redirect, Authorize handles authorization

**Keep the hook if:**

- Multiple child routes with different authorization requirements
- Need dynamic redirect based on user permissions across multiple routes
- Authorization logic is more complex than parent-level `Authorize` HOC

**Tasks**:

- [ ] Create `src/backend/routes-v6.js`
- [ ] Import all components from route-containers
- [ ] Convert all route definitions to v6 format
- [ ] Preserve all route names and helpers in `handle`
- [ ] Handle nested routes (projects, text, resource, settings, etc.)
- [ ] Convert NotFound route to catch-all

## Phase 2: Migrate Backend Container

**File**: `src/backend/containers/Backend/index.js`

**Current state**: Class component using `childRoutes(this.props.route)`

**Migration steps**:

1. Convert class component to functional component
2. Replace `childRoutes()` with `<Outlet />`
3. Replace router props (`match`, `location`) with hooks (`useParams`, `useLocation`)
4. Replace Redux `connect` with hooks (`useDispatch`, `useSelector`, `useFromStore`)
5. Replace `connectAndFetch` with `useFetch` hooks
6. Replace `static fetchData` with route loaders (if needed) or `useFetch`
7. Update `RedirectToFirstMatch` usage for v6
8. Remove HOC wrappers from export

**Key changes**:

- `childRoutes(this.props.route, { childProps })` → `<Outlet context={{ dispatch }} />`
- `this.props.match` → `useParams()` or `useMatches()`
- `this.props.location` → `useLocation()`
- `this.props.route` → `useMatches()` for route metadata
- `connectAndFetch` → Remove, use hooks directly

**Tasks**:

- [ ] Convert BackendContainer class to functional component
- [ ] Replace childRoutes with Outlet
- [ ] Migrate Redux connect to hooks
- [ ] Migrate fetchData to useFetch or loaders
- [ ] Update RedirectToFirstMatch for v6
- [ ] Test Backend container renders correctly

## Phase 3: Migrate Wrapper Components

**Strategy**: Migrate incrementally, starting with simpler wrappers

**Components to migrate** (in order of complexity):

1. Simple wrappers (fewer dependencies)
2. Wrappers with child routes
3. Complex wrappers with multiple nested routes

**Key wrapper components**:

- `ProjectsWrapper` - Projects section wrapper
- `ResourceWrapper` - Resource detail wrapper
- `ResourceCollectionWrapper` - Resource collection wrapper
- `ProjectWrapper` - Project detail wrapper
- `TextWrapper` - Text detail wrapper
- `SettingsWrapper` - Settings section wrapper
- `JournalWrapper` - Journal wrapper
- `ReadingGroupWrapper` - Reading group wrapper
- **List Wrappers** (Components that render lists but also handle child routes for drawers/modals):
  - `SettingsSubjectsList`
  - `ExportTargetsList`
  - `TextCollaborators`
  - `TextSections`
  - `TextTOC`
  - `TextAssets`
  - `ProjectAccessWrapper`
  - `ProjectCollaborators`
- Others as needed

**Migration pattern for each wrapper**:

1. Convert class → functional (if class component)
2. Replace `childRoutes(this.props.route, { childProps })` → `<Outlet context={{ ...data }} />`
3. Replace router props with hooks
4. Replace Redux connect with hooks
5. Replace fetchData with useFetch
6. Update any route-dependent logic

**Tasks**:

- [ ] Identify all wrapper components using childRoutes
- [ ] Create migration order (simple → complex)
- [ ] Migrate each wrapper incrementally
- [ ] Test each wrapper after migration
- [ ] Update child components to use `useOutletContext()` where needed

## Phase 4: Integrate Backend Routes into Router

**File**: `src/routes/createRouter.js`

**Current state**: Only includes frontend routes

**Changes needed**:

1. Import backend routes-v6
2. Add backend routes as sibling to frontend routes (or as separate top-level route)
3. Register backend routes with LinkHandler
4. Update route structure if needed

**Route structure options**:

**Option A: Sibling routes** (Recommended)

```javascript
{
  element: <Manifold />,
  path: "/",
  children: [
    ...frontendRoutesV6,
    {
      element: <Backend />,
      path: "/backend",
      children: backendRoutesV6
    }
  ]
}
```

**Option B: Separate top-level routes**

```javascript
[
  {
    element: <Manifold />,
    path: "/",
    children: frontendRoutesV6
  },
  {
    element: <Backend />,
    path: "/backend",
    children: backendRoutesV6
  }
];
```

**Tasks**:

- [ ] Update `createRouter.js` to import backend routes
- [ ] Add backend routes to router structure
- [ ] Register backend routes with LinkHandler
- [ ] Test route navigation works
- [ ] Verify SSR still works

## Phase 5: Update Route-Dependent Components

**Components that access route props**:

- Components using `this.props.route`, `this.props.match`, `this.props.location`
- Components using route metadata (name, helper)
- Components using `RedirectToFirstMatch`

**Migration patterns**:

- `this.props.route` → `useMatches()` hook
- `this.props.match.params` → `useParams()` hook
- `this.props.location` → `useLocation()` hook
- Route metadata → `useMatches()[index].handle`
- `RedirectToFirstMatch` → Prefer declarative `index` routes with `<Navigate to="..." />` in `routes-v6.js`. Use `Navigate` component in code only if dynamic logic is required.
- **Remove `useRedirectToFirstMatch` hook** if route structure already has index redirect and authorization is uniform (see "useRedirectToFirstMatch Hook - When to Remove" section above)

**Tasks**:

- [ ] Audit components using route props
- [ ] Update to use hooks
- [ ] Update RedirectToFirstMatch usage
- [ ] Test route-dependent functionality

## Phase 6: Handle SSR

**Files**: SSR setup files (check where StaticRouter is configured)

**Changes needed**:

1. Ensure backend routes are included in SSR route creation
2. Test SSR rendering works with backend routes
3. Verify redirects work in SSR context

**Tasks**:

- [ ] Verify SSR includes backend routes
- [ ] Test SSR rendering
- [ ] Test SSR redirects
- [ ] Handle any SSR-specific issues

## Phase 7: Testing and Cleanup

**Testing checklist**:

- [ ] All backend routes navigate correctly
- [ ] Nested routes render correctly
- [ ] Route parameters work
- [ ] Route helpers (LinkHandler) work
- [ ] Breadcrumbs work (if route-dependent)
- [ ] Redirects work
- [ ] SSR works
- [ ] Authentication/authorization still works
- [ ] Verify `NotFound` route catches unmatched paths within `/backend` scope
- [ ] No console errors or warnings

**Cleanup tasks**:

- [ ] Remove old `src/backend/routes.js` (after migration verified)
- [ ] Remove `childRoutes` and `renderRoutes` usage
- [ ] Remove route hydration code for backend
- [ ] Update documentation
- [ ] Remove unused imports

## Implementation Order

1. **Phase 1**: Create routes-v6.js file (can be done in parallel with other work)
2. **Phase 2**: Migrate Backend container (blocking for route integration)
3. **Phase 3**: Migrate wrapper components (can be done incrementally)
4. **Phase 4**: Integrate routes into createRouter (after Phase 2)
5. **Phase 5**: Update route-dependent components (ongoing)
6. **Phase 6**: Handle SSR (after Phase 4)
7. **Phase 7**: Testing and cleanup (final phase)

## Key Files to Modify

**New files**:

- `src/backend/routes-v6.js`

**Modified files**:

- `src/backend/containers/Backend/index.js`
- `src/backend/containers/projects/Wrapper.js`
- `src/backend/containers/resource/Wrapper.js`
- `src/backend/containers/resource-collection/Wrapper.js`
- `src/backend/containers/project/Wrapper.js`
- `src/backend/containers/text/Wrapper.js`
- `src/backend/containers/settings/Wrapper.js`
- `src/backend/containers/journal/Wrapper.js`
- `src/backend/containers/reading-group/Wrapper.js`
- Other wrapper components as needed
- `src/routes/createRouter.js`
- SSR setup files (if separate)

## Notes

- Follow the same patterns established in frontend migration
- Keep old routes.js file until migration is fully verified
- Test incrementally after each phase
- Backend has many class components - migrate to functional as needed
- Some components may need `useOutletContext()` to access parent data
- Route loaders can be added later if needed (start with useFetch)
- LinkHandler registration happens after route creation to avoid circular dependencies
