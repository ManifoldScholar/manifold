<!-- 4ef28179-0da9-4b03-a40f-6e2a091b3690 724087da-ec38-45b2-a57a-b8b034beb522 -->
# Plan: Moving Data Fetching and Auth Checks to Router Loaders

## Overview

Migrate data fetching and authentication/authorization checks from component-level implementation (using `useFetch` hooks and `Authorize` HOC) to React Router v6 loaders. This provides:

- **Better performance**: Data loads before components render
- **Improved SSR**: Loaders run during SSR, providing data in initial HTML
- **Centralized auth**: Authentication/authorization checks happen at route level
- **Better UX**: Loading states handled by router, not individual components
- **Type safety**: Loader data available via `useLoaderData()` hook

## Current State Analysis

### Data Fetching Patterns

1. **Wrapper Components** (e.g., `ProjectWrapper`, `JournalWrapper`):

            - Use `useFetch` hook to fetch data (project, journal, etc.)
            - Pass data to child routes via `<Outlet context={{ ... }} />`
            - Child components access via `useOutletContext()`

2. **Component-Level Fetching**:

            - Many components use `useFetch` directly
            - Data stored in Redux entity store
            - Components handle loading states

3. **Existing Loaders**:

            - `requireAuth` - Authentication check utility (used in some routes)
            - `checkLibraryMode` - Library mode check utility
            - Some routes already use these loaders (subscriptions, privacy, home)

### Authentication/Authorization Patterns

1. **Authorize HOC** (`src/hoc/Authorize/index.js`):

            - Wraps components to check authentication/authorization
            - Uses `Authorization` helper class
            - Redirects unauthenticated users to login
            - Shows access denied for unauthorized users
            - Handles SSR redirects by throwing Response objects

2. **Authorization Logic**:

            - Checks `authentication.currentUser` from Redux store
            - Uses `authorization.authorize()` with `ability`, `kind`, `entity` props
            - Supports `failureRedirect` prop for redirects

## Migration Strategy

### Phase 1: Create Loader Utilities

**Files to create/modify**:

1. **`src/helpers/router/loaders/dataLoader.js`** (new)

            - Utility function to fetch data in loaders
            - Handles API calls, error handling, and store integration
            - Returns data that can be used by `useLoaderData()`

2. **`src/helpers/router/loaders/authorizeLoader.js`** (new)

            - Utility function to check authorization in loaders
            - Reuses `Authorization` class logic
            - Throws redirect Response for unauthorized access
            - Returns authorization result if authorized

3. **Update `src/helpers/router/requireAuth.js`** (existing)

            - Already exists and works well
            - May need minor updates for consistency

### Phase 2: Migrate Wrapper Component Data Fetching

**Pattern**: Move `useFetch` calls from wrapper components to route loaders.

**Example Migration**:

```javascript
// Before: ProjectWrapper/index.js
export default function ProjectWrapper() {
  const { id } = useParams();
  const { data: project } = useFetch({
    request: [projectsAPI.show, id],
    condition: id !== "all"
  });
  // ...
  return <Outlet context={{ project }} />;
}

// After: routes-v6.js
{
  element: <ProjectWrapper />,
  path: "projects/:id",
  loader: async ({ params, context }) => {
    if (params.id === "all") return null;
    return dataLoader({
      request: [projectsAPI.show, params.id],
      context,
      requestKey: requests.gProject
    });
  },
  children: [...]
}

// After: ProjectWrapper/index.js
export default function ProjectWrapper() {
  const project = useLoaderData();
  const { id } = useParams();
  
  if (id === "all") return <Navigate to={lh.link("frontendProjectsAll")} />;
  
  return <Outlet context={{ project }} />;
}
```

**Components to migrate** (priority order):

1. `ProjectWrapper` - Fetches project data
2. `JournalWrapper` - Fetches journal data
3. `ReadingGroupHomepage.Fetch` - Fetches reading group data and collections
4. `ResourceDetail` - Fetches resource data
5. Other wrapper components with data fetching

### Phase 3: Migrate Authentication Checks

**Pattern**: Move `Authorize` HOC checks to route loaders.

**Example Migration**:

```javascript
// Before: Component wrapped with Authorize
<Authorize ability="update" entity={project}>
  <ProjectDetail project={project} />
</Authorize>

// After: routes-v6.js
{
  element: <ProjectDetail />,
  path: "projects/:id",
  loader: async ({ params, context }) => {
    const project = await dataLoader({
      request: [projectsAPI.show, params.id],
      context,
      requestKey: requests.gProject
    });
    
    // Check authorization
    await authorizeLoader({
      context,
      ability: "update",
      entity: project
    });
    
    return { project };
  }
}

// After: ProjectDetail component
export default function ProjectDetail() {
  const { project } = useLoaderData();
  // No Authorize wrapper needed - already checked in loader
  return <div>{project.attributes.title}</div>;
}
```

**Migration approach**:

1. Identify routes using `Authorize` HOC
2. Extract authorization props (`ability`, `kind`, `entity`, `failureRedirect`)
3. Add loader to route that:

            - Fetches entity data if needed
            - Calls `authorizeLoader` with authorization props
            - Returns data if authorized
            - Throws redirect if unauthorized

### Phase 4: Update Components to Use Loader Data

**Pattern**: Replace `useFetch` and `useOutletContext` with `useLoaderData()` where appropriate.

**Changes needed**:

1. **Wrapper components**:

            - Remove `useFetch` calls
            - Use `useLoaderData()` to get data from loader
            - Continue passing data via `<Outlet context={{ ... }} />` for child routes

2. **Child components**:

            - Prefer `useLoaderData()` if data comes from route loader
            - Keep `useOutletContext()` for data from parent wrappers
            - Remove `useFetch` if data is provided by loader

3. **Loading states**:

            - Router handles loading states automatically
            - Use `useNavigation()` hook for pending states if needed
            - Remove manual loading state management

### Phase 5: Handle SSR Integration

**Current SSR setup** (`src/entry-ssr.js`):

- Already supports loaders via `createStaticHandler`
- Store passed in context: `context: { store }`
- Loader redirects handled via context Response check

**Updates needed**:

1. Ensure all loaders use `context.store` for SSR
2. Verify loader data is serialized correctly for SSR
3. Test that loader redirects work in SSR
4. Ensure error boundaries handle loader errors

### Phase 6: Update Route Definitions

**Files to modify**:

1. **`src/frontend/routes-v6.js`**:

            - Add loaders to wrapper routes (ProjectWrapper, JournalWrapper, etc.)
            - Add loaders to routes using Authorize HOC
            - Add loaders to routes that fetch data

2. **`src/backend/routes-v6.js`**:

            - Add loaders to backend wrapper routes
            - Add loaders to backend routes using Authorize HOC

3. **`src/reader/routes-v6.js`**:

            - Add loaders to reader routes if needed

## Implementation Details

### Data Loader Utility

**File**: `src/helpers/router/loaders/dataLoader.js`

```javascript
import { getStore } from "store/storeInstance";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";

/**
 * Fetches data in a route loader.
 * Integrates with Redux entity store for consistency with useFetch.
 * 
 * @param {Object} options
 * @param {Array} options.request - [apiFunction, ...args]
 * @param {Object} options.context - Loader context (contains context.store for SSR)
 * @param {string} options.requestKey - Request key for entity store
 * @returns {Promise<Object>} Fetched entity data
 */
export default async function dataLoader({ request, context, requestKey }) {
  const store = context?.store || getStore();
  const [apiFunction, ...args] = request;
  
  // Check if data already exists in store
  const state = store.getState();
  const existingData = select(requestKey, state.entityStore);
  if (existingData) {
    return existingData;
  }
  
  // Fetch data
  const apiCall = apiFunction(...args);
  const action = entityStoreActions.request(apiCall, requestKey);
  const { promise } = store.dispatch(action);
  const response = await promise;
  
  // Return selected data from store
  const newState = store.getState();
  return select(requestKey, newState.entityStore);
}
```

### Authorization Loader Utility

**File**: `src/helpers/router/loaders/authorizeLoader.js`

```javascript
import { redirect } from "react-router-dom";
import { getStore } from "store/storeInstance";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";

const authorization = new Authorization();

/**
 * Checks authorization in a route loader.
 * Throws redirect if unauthorized.
 * 
 * @param {Object} options
 * @param {Object} options.context - Loader context
 * @param {string|Array} options.ability - Ability to check
 * @param {string|Array} options.kind - Kind to check
 * @param {Object|string|Array} options.entity - Entity to check
 * @param {string|boolean} options.failureRedirect - Redirect path if unauthorized
 * @param {string} options.currentPath - Current pathname for redirect_uri
 * @returns {Promise<null>} Returns null if authorized
 * @throws {Response} Throws redirect Response if unauthorized
 */
export default async function authorizeLoader({
  context,
  ability,
  kind,
  entity,
  failureRedirect,
  currentPath
}) {
  const store = context?.store || getStore();
  const state = store.getState();
  const authentication = state.authentication;
  
  const isAuthorized = authorization.authorize({
    authentication,
    ability,
    kind,
    entity
  });
  
  if (!isAuthorized && failureRedirect) {
    const redirectPath = getRedirectPath(failureRedirect, currentPath);
    const loginPath = lh.link("frontendLogin");
    const redirectUrl = currentPath
      ? `${loginPath}?redirect_uri=${encodeURIComponent(currentPath)}`
      : loginPath;
    
    throw redirect(redirectUrl);
  }
  
  if (!isAuthorized) {
    // No redirect specified, throw 403 error
    throw new Response(null, {
      status: 403,
      statusText: "Forbidden"
    });
  }
  
  return null;
}
```

## Migration Checklist

### Phase 1: Create Loader Utilities

- [ ] Create `src/helpers/router/loaders/dataLoader.js`
- [ ] Create `src/helpers/router/loaders/authorizeLoader.js`
- [ ] Test utilities with existing loader patterns
- [ ] Update `requireAuth` if needed for consistency

### Phase 2: Migrate Wrapper Components

- [ ] Migrate `ProjectWrapper` data fetching to loader
- [ ] Migrate `JournalWrapper` data fetching to loader
- [ ] Migrate `ReadingGroupHomepage.Fetch` data fetching to loader
- [ ] Migrate `ResourceDetail` data fetching to loader
- [ ] Update components to use `useLoaderData()`
- [ ] Test data flow to child routes

### Phase 3: Migrate Authentication Checks

- [ ] Identify all routes using `Authorize` HOC
- [ ] Create loader utilities for authorization checks
- [ ] Migrate routes one by one
- [ ] Remove `Authorize` HOC wrappers from migrated routes
- [ ] Test authentication/authorization flows

### Phase 4: Update Components

- [ ] Replace `useFetch` with `useLoaderData()` where appropriate
- [ ] Update child components to use loader data
- [ ] Remove manual loading state management
- [ ] Test component rendering with loader data

### Phase 5: SSR Integration

- [ ] Verify loaders work in SSR context
- [ ] Test loader redirects in SSR
- [ ] Ensure loader data serialization works
- [ ] Test error handling in SSR

### Phase 6: Route Updates

- [ ] Add loaders to `frontend/routes-v6.js`
- [ ] Add loaders to `backend/routes-v6.js`
- [ ] Add loaders to `reader/routes-v6.js` if needed
- [ ] Test all routes with loaders

## Testing Strategy

1. **Unit Tests**:

            - Test loader utilities (`dataLoader`, `authorizeLoader`)
            - Test error handling
            - Test SSR context handling

2. **Integration Tests**:

            - Test routes with loaders
            - Test data flow from loaders to components
            - Test authentication/authorization flows
            - Test SSR rendering with loaders

3. **Manual Testing**:

            - Test all migrated routes
            - Test authentication redirects
            - Test authorization checks
            - Test SSR rendering
            - Test loading states

## Key Considerations

1. **Backward Compatibility**:

            - Keep `useFetch` hook working for components that still need it
            - Gradually migrate, don't break existing functionality
            - Some components may still need `useFetch` for dynamic data

2. **Data Store Integration**:

            - Loaders should integrate with Redux entity store
            - Reuse existing request keys for consistency
            - Ensure data is available via both `useLoaderData()` and entity store

3. **Error Handling**:

            - Loaders can throw Response objects for redirects
            - Loaders can throw Error objects for error boundaries
            - Ensure error boundaries handle loader errors

4. **Performance**:

            - Loaders run in parallel for nested routes
            - Consider caching strategies for frequently accessed data
            - Minimize duplicate data fetching

5. **Incremental Migration**:

            - Migrate routes incrementally
            - Start with high-traffic routes
            - Test thoroughly after each migration

## Files to Create

1. `src/helpers/router/loaders/dataLoader.js` - Data fetching utility
2. `src/helpers/router/loaders/authorizeLoader.js` - Authorization utility

## Files to Modify

1. `src/frontend/routes-v6.js` - Add loaders to routes
2. `src/backend/routes-v6.js` - Add loaders to routes
3. `src/reader/routes-v6.js` - Add loaders if needed
4. Wrapper components (ProjectWrapper, JournalWrapper, etc.) - Use `useLoaderData()`
5. Components using `Authorize` HOC - Remove HOC, use loader data
6. `src/entry-ssr.js` - Verify SSR loader support (likely already works)

## Benefits

1. **Performance**: Data loads before render, reducing loading states
2. **SSR**: Better SSR support with data in initial HTML
3. **Security**: Auth checks happen before component render
4. **Maintainability**: Centralized data and auth logic
5. **Type Safety**: Loader data available via `useLoaderData()` hook
6. **UX**: Router handles loading states automatically

### To-dos

- [ ] Create loader utility functions: dataLoader.js and authorizeLoader.js
- [ ] Migrate wrapper component data fetching (ProjectWrapper, JournalWrapper, etc.) to route loaders
- [ ] Migrate Authorize HOC checks to route loaders
- [ ] Update components to use useLoaderData() instead of useFetch where appropriate
- [ ] Verify and test SSR integration with loaders
- [ ] Add loaders to route definitions in routes-v6.js files