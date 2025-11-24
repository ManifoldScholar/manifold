# React Router v5 to v6 Migration Guide

This guide documents the migration patterns for converting components from React Router v5 to v6 using `react-router-dom-v5-compat`, and modernizing React class components to functional components with hooks.

## Table of Contents

1. [Functional Component Migration](#functional-component-migration)
2. [Class Component Migration](#class-component-migration)
3. [Router API Replacements](#router-api-replacements)
4. [Redux Migration](#redux-migration)
5. [Translation Migration](#translation-migration)
6. [React 18 Updates](#react-18-updates)

## Functional Component Migration

### Router Hooks Migration

#### useHistory → useNavigate

**Before (v5):**

```javascript
import { useHistory } from "react-router-dom";

function MyComponent() {
  const history = useHistory();
  history.push("/path");
  history.push("/path", state);
  history.replace("/path");
}
```

**After (v6-compat):**

```javascript
import { useNavigate } from "react-router-dom-v5-compat";

function MyComponent() {
  const navigate = useNavigate();
  navigate("/path");
  navigate("/path", { state });
  navigate("/path", { replace: true });
}
```

#### useRouteMatch → useLocation or useMatch

**Before (v5):**

```javascript
import { useRouteMatch } from "react-router-dom";

function MyComponent() {
  const { path } = useRouteMatch();
  const match = useRouteMatch("/specific-path");
}
```

**After (v6-compat):**

```javascript
import { useLocation, useMatch } from "react-router-dom";

function MyComponent() {
  const location = useLocation();
  const path = location.pathname; // For pathname access

  // For pattern matching, use useMatch (but note: not available in v5, use useRouteMatch for now)
  const match = useRouteMatch("/specific-path"); // Keep until full v6 migration
}
```

**Note:** `useMatch` is a v6 hook and not available in v5. During the compat migration, continue using `useRouteMatch` for pattern matching, or use `useLocation().pathname` for simple pathname checks.

#### useParams and useLocation

These hooks work the same in both v5 and v6:

```javascript
import { useParams, useLocation } from "react-router-dom";

function MyComponent() {
  const { id } = useParams();
  const location = useLocation();
}
```

#### Router Components (NavLink, Link, etc.)

Components like `NavLink`, `Link`, and other router components can be imported from `react-router-dom-v5-compat` to prepare for v6 migration while maintaining v5 API compatibility:

**Before (v5):**

```javascript
import { NavLink, Link } from "react-router-dom";
```

**After (v6-compat):**

```javascript
import { NavLink, Link } from "react-router-dom-v5-compat";
```

**Note:** The compat package provides v5-compatible APIs for these components, allowing you to use them with the existing v5 API while preparing for v6. This enables incremental migration without breaking changes.

#### Redirect → Navigate (Future Migration)

**Note:** `Navigate` is not available in v5. Keep using `Redirect` until full v6 migration:

**Current (v5):**

```javascript
import { Redirect } from "react-router-dom";

if (condition) return <Redirect to="/path" />;
```

**Future (v6):**

```javascript
import { Navigate } from "react-router-dom";

if (condition) return <Navigate to="/path" replace />;
```

## Class Component Migration

### Step-by-Step Conversion Pattern

1. **Convert class to function**
2. **Replace state with useState**
3. **Replace lifecycle methods with useEffect**
4. **Replace router props with hooks**
5. **Replace Redux connect with hooks**
6. **Replace withTranslation with hook**
7. **Remove React import (React 18)**
8. **Remove HOC wrappers**

### Example: Complete Class to Functional Conversion

**Before (Class Component):**

```javascript
import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";

class MyComponent extends Component {
  static mapStateToProps = state => ({
    data: state.someData
  });

  static propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.state = { value: "" };
  }

  componentDidMount() {
    // Setup
  }

  componentWillUnmount() {
    this.props.dispatch(cleanup());
  }

  handleClick = () => {
    this.props.history.push("/path");
  };

  render() {
    const { data, t } = this.props;
    return (
      <div>
        <button onClick={this.handleClick}>{t("button.label")}</button>
        <div>{data.value}</div>
      </div>
    );
  }
}

export default connect(MyComponent.mapStateToProps)(
  withRouter(withTranslation()(MyComponent))
);
```

**After (Functional Component):**

```javascript
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom-v5-compat";

export default function MyComponent() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); // If needed
  const data = useSelector(state => state.someData);
  const [value, setValue] = useState("");

  useEffect(() => {
    // Setup (componentDidMount equivalent)
    return () => {
      // Cleanup (componentWillUnmount equivalent)
      dispatch(cleanup());
    };
  }, [dispatch]);

  const handleClick = () => {
    navigate("/path");
  };

  return (
    <div>
      <button onClick={handleClick}>{t("button.label")}</button>
      <div>{data.value}</div>
    </div>
  );
}
```

## Router API Replacements

### Props to Hooks Mapping

| v5 (Props/HOC)   | v6 (Hook)                     | Import Source                |
| ---------------- | ----------------------------- | ---------------------------- |
| `props.history`  | `useNavigate()`               | `react-router-dom-v5-compat` |
| `props.location` | `useLocation()`               | `react-router-dom`           |
| `props.match`    | `useParams()` or `useMatch()` | `react-router-dom`           |
| `withRouter` HOC | Direct hook usage             | N/A                          |

### Navigation Methods

| v5                             | v6                                     |
| ------------------------------ | -------------------------------------- |
| `history.push("/path")`        | `navigate("/path")`                    |
| `history.push("/path", state)` | `navigate("/path", { state })`         |
| `history.replace("/path")`     | `navigate("/path", { replace: true })` |
| `history.goBack()`             | `navigate(-1)`                         |
| `history.goForward()`          | `navigate(1)`                          |

### Route Matching

| v5                       | v6 Compat (Current)      | Notes                        |
| ------------------------ | ------------------------ | ---------------------------- |
| `useRouteMatch()`        | `useLocation().pathname` | For pathname access          |
| `useRouteMatch("/path")` | `useRouteMatch("/path")` | Keep until full v6 migration |
| `props.match.params`     | `useParams()`            | Extract params directly      |

## Redux Migration

### Removing connectAndFetch Wrapper

If your component uses `connectAndFetch`, this utility wraps components with both `connect` and `withRouter`. When converting to functional components:

**Before:**

```javascript
export class MyComponent extends Component {
  static mapStateToProps = state => ({ ... });
  static fetchData = (getState, dispatch, location, match) => {
    // Data fetching logic
    const action = request(someAPI.show(match.params.id), requests.gSomeEntity);
    return dispatch(action).promise;
  };
  // ...
}

export default connectAndFetch(MyComponent);
// or
export default withTranslation()(connectAndFetch(MyComponent));
```

**After:**

```javascript
import { useFetch } from "hooks";
import { someAPI, requests } from "api";

export default function MyComponent() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Replace static fetchData with useFetch hook
  const { data, response, meta } = useFetch({
    request: [someAPI.show, id],
    options: { requestKey: requests.gSomeEntity }
  });

  // Use hooks directly, no wrapper needed
}
```

**Note:** The `oneTime` option from the original `request()` call should **not** be passed to `useFetch`. The `oneTime` option doesn't work with `useFetch` and will cause the hook to fail to return data. If you need to prevent refetching, use the `condition` option or manage dependencies appropriately.

**Important:** All data fetching should be handled with the `useFetch` hook, not `static fetchData` methods. The `useFetch` hook:

- Handles API requests automatically
- Manages loading states
- Provides data, meta, and response objects
- Supports refresh functionality
- Works with the entity store

**useFetch Options:**

- `request` - Array with API function and arguments: `[apiFunction, ...args]`
- `options.requestKey` - Optional request key for entity store
- `dependencies` - Array of dependencies to refetch when changed
- `refetchOnLogin` - Boolean to refetch when user logs in
- `condition` - Boolean condition to control when fetching occurs
- `afterFetch` - Callback function to run after fetch completes

**Important: Memoize Object Arguments**

When passing objects or arrays as arguments to the API function in the `request` array, you **must** memoize them using `useMemo`. Otherwise, they will be recreated on every render, causing the `request` array to change, which triggers infinite fetch loops.

**Problem:**

```javascript
// This creates a new object on every render, causing infinite loops!
useFetch({
  request: [subjectsAPI.index, { used: true }, null, true],
  options: { requestKey: requests.feSubjects }
});
```

**Solution:**

```javascript
// Memoize the filter object
const subjectsFilters = useMemo(() => ({ used: true }), []);

useFetch({
  request: [subjectsAPI.index, subjectsFilters, null, true],
  options: { requestKey: requests.feSubjects }
});
```

**When to memoize:**

- Objects/arrays that depend on props/state: `{ userId, status }` → `useMemo(() => ({ userId, status }), [userId, status])`
- Complex objects that depend on props/state: `{ filter: { used: true }, sort: sortBy }` → `useMemo(() => ({ filter: { used: true }, sort: sortBy }), [sortBy])`

**When NOT to memoize (use constants instead):**

- **Static objects/arrays (never change)**: Define as constants outside the component

  ```javascript
  // ✅ Good - constant outside component has stable reference automatically
  const FILTER_RESET = { standaloneModeEnforced: "false" };
  const ANNOTATION_FILTERS = {
    formats: ["annotation"],
    order: "created_at DESC"
  };

  export default function MyComponent() {
    // Stable reference automatically - perfect for useFetch
    const { data } = useFetch({
      request: [api.index, ANNOTATION_FILTERS, pagination]
    });
  }
  ```

- Primitive values: strings, numbers, booleans, null, undefined
- Variables that already change when you want to refetch (these should be in `dependencies` instead)

**Key Distinction:**

- **Static objects (never change)**: Define as constants outside component → stable reference automatically, no `useMemo` needed
- **Objects that depend on props/state**: Use `useMemo` with proper dependencies → stable reference that updates when needed

**Important: The `oneTime` Option**

The `oneTime` option from the original `request()` call should **not** be passed to `useFetch`. The `oneTime` option doesn't work with `useFetch` and will cause the hook to fail to return data. Remove it when migrating:

**Before:**

```javascript
const pages = request(pagesAPI.index(), requests.gPages, {
  oneTime: true
});
```

**After:**

```javascript
const { data: pages } = useFetch({
  request: [pagesAPI.index],
  options: { requestKey: requests.gPages }
  // Do NOT include oneTime: true
});
```

If you need to prevent refetching, use the `condition` option or manage dependencies appropriately.

**Returns:**

- `data` - The fetched entity data
- `meta` - Metadata (pagination, etc.)
- `loaded` - Boolean indicating if data is loaded
- `response` - Full response object
- `uid` - Unique identifier for the fetch
- `refresh` - Function to manually trigger refetch

**Note:** When using `useFetch`, you typically don't need a separate `useFromStore` call for the same data. The `useFetch` hook automatically stores the data in the entity store and returns it via the `data` property. Only use `useFromStore` if you need to access data that was fetched elsewhere or if you're not fetching it in the current component.

### Simplifying API Calls with useApiCallback

For API calls triggered by user actions (like delete, create, update), use the `useApiCallback` hook instead of manually dispatching `request` actions. This simplifies the code and enables async/await syntax.

**Before:**

```javascript
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { annotationsAPI, requests } from "api";

const { request } = entityStoreActions;

function MyComponent({ annotation, refresh }) {
  const dispatch = useDispatch();

  const deleteHandler = useCallback(() => {
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = dispatch(request(call, requests.rAnnotationDestroy, options));
    res.promise.then(() => {
      if (refresh) refresh();
    });
  }, [annotation.id, dispatch, refresh]);

  // ...
}
```

**After:**

```javascript
import { useCallback } from "react";
import useApiCallback from "hooks/api/useApiCallback";
import { annotationsAPI, requests } from "api";

function MyComponent({ annotation, refresh }) {
  const deleteAnnotation = useApiCallback(annotationsAPI.destroy, {
    requestKey: requests.rAnnotationDestroy,
    removes: { type: "annotations", id: annotation.id }
  });

  const deleteHandler = useCallback(async () => {
    await deleteAnnotation(annotation.id);
    if (refresh) refresh();
  }, [annotation.id, deleteAnnotation, refresh]);

  // ...
}
```

**Benefits:**

- Cleaner, more readable code
- Enables async/await syntax for better error handling
- Removes need for `useDispatch` and `entityStoreActions` imports
- Automatically handles request key generation
- Supports all `request` options (removes, adds, clears, refreshes, etc.)

**useApiCallback Options:**

The second parameter accepts the same options as `entityStoreActions.request`:

- `requestKey` - Request key for entity store tracking
- `removes` - Object with `type` and `id` to remove from store after success
- `adds` - Target response key to add entity to after success
- `clears` - Array of request keys to flush from store after success
- `refreshes` - Request key to replay after success

**Note:** If options depend on props or state (like `removes.id`), the callback will be recreated when those values change. This is expected behavior and ensures the options are always up-to-date.

**Async/Await Pattern:**

When using `useApiCallback`, prefer async/await syntax for cleaner code:

```javascript
// ✅ Good - async/await
const handleDelete = useCallback(async () => {
  try {
    await deleteAnnotation(annotation.id);
    if (refresh) refresh();
  } catch (error) {
    // Handle error
  }
}, [annotation.id, deleteAnnotation, refresh]);

// ❌ Avoid - promise chains
const handleDelete = useCallback(() => {
  deleteAnnotation(annotation.id).then(() => {
    if (refresh) refresh();
  });
}, [annotation.id, deleteAnnotation, refresh]);
```

### connect HOC → Hooks

**Before:**

```javascript
import { connect } from "react-redux";

class MyComponent extends Component {
  static mapStateToProps = state => ({
    items: state.items,
    user: state.user
  });

  render() {
    const { dispatch, items, user } = this.props;
    // ...
  }
}

export default connect(MyComponent.mapStateToProps)(MyComponent);
```

**After:**

```javascript
import { useDispatch, useSelector } from "react-redux";

export default function MyComponent() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.items);
  const user = useSelector(state => state.user);
  // ...
}
```

### Multiple Selectors

For multiple selectors, you can either:

1. Use multiple `useSelector` calls (recommended)
2. Use a single `useSelector` with an object

```javascript
// Option 1: Multiple selectors (recommended)
const items = useSelector(state => state.items);
const user = useSelector(state => state.user);

// Option 2: Single selector with object
const { items, user } = useSelector(state => ({
  items: state.items,
  user: state.user
}));
```

**Note:** Option 2 may cause unnecessary re-renders. Use Option 1 unless you need the values together.

### Using useFromStore Hook

For accessing entity store data (entities, responses, metadata), prefer the `useFromStore` hook instead of `useSelector`. This hook provides a consistent API for accessing the entity store.

**Before (with useSelector):**

```javascript
import { useSelector } from "react-redux";
import { requests } from "api";

const response = useSelector(
  state => state.entityStore.responses[requests.gContactForm]
);
const entity = useSelector(state => state.entityStore.entities[entityType][id]);
```

**After (with useFromStore):**

```javascript
import { useFromStore } from "hooks";
import { requests } from "api";

// For responses
const response = useFromStore({
  path: `entityStore.responses.${requests.gContactForm}`
});

// For entities using action: "select"
const settings = useFromStore({
  requestKey: "settings",
  action: "select"
});

// For entities using action: "meta"
const meta = useFromStore({
  requestKey: requests.gPages,
  action: "meta"
});

// For entities using action: "grab"
const entity = useFromStore({
  entityType: "projects",
  id: projectId,
  action: "grab"
});

// For arbitrary paths
const data = useFromStore({
  path: "entityStore.entities.projects.123"
});
```

**useFromStore Options:**

- `path` - Direct path to state using lodash `get` syntax (e.g., `"entityStore.responses.gContactForm"`)
- `requestKey` + `action: "select"` - Select entity from entityStore using the `select` utility
- `requestKey` + `action: "meta"` - Get metadata for a request using the `meta` utility
- `entityType` + `id` + `action: "grab"` - Grab a specific entity by type and ID
- `path` - Access any nested state path

**When to use useFromStore vs useSelector:**

- Use `useFromStore` for entity store data (entities, responses, metadata)
- Use `useSelector` for other Redux state (authentication, UI state, etc.)

**Replacing Props with useFromStore:**

When converting components, you can replace props that come from Redux state (especially those passed down from parent components) with `useFromStore` hooks. This reduces prop drilling and makes components more self-contained.

**Before (receiving props from parent):**

```javascript
function MyComponent({ authentication, settings, ...props }) {
  return (
    <div>
      {authentication.currentUser?.name}
      {settings.attributes.general.siteName}
    </div>
  );
}
```

**After (using useFromStore hooks):**

```javascript
import { useFromStore } from "hooks";

function MyComponent({ ...props }) {
  const authentication = useFromStore({ path: "authentication" });
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });

  return (
    <div>
      {authentication.currentUser?.name}
      {settings.attributes.general.siteName}
    </div>
  );
}
```

**Benefits:**

- Reduces prop drilling through component trees
- Makes components more self-contained and easier to understand
- Components can access store data directly without relying on parent components
- Simplifies component APIs by removing Redux-related props

**Note:** Make sure to remove the props from `propTypes` and update parent components to stop passing them down.

### Replacing useSelector with useFromStore

When refactoring components, prefer `useFromStore` over `useSelector` for accessing Redux state, especially for entity data. This provides a consistent API and handles paths safely.

**Before:**

```javascript
const authentication = useSelector(state => state.authentication);
const visibility = useSelector(state => state.ui.transitory.visibility);
```

**After:**

```javascript
const authentication = useFromStore({ path: "authentication" });
const visibility = useFromStore({ path: "ui.transitory.visibility" });
```

### Reducing Prop Drilling

When migrating container components (like `BackendContainer` or `FrontendContainer`) and their children (like Headers and Footers), avoid passing data props down the tree if the child components can fetch the data themselves using hooks.

**Pattern:**

1.  **Identify props** passed from parent to child that come from the store or API.
2.  **Remove props** from the parent's render method.
3.  **Update child component** to use hooks (`useFromStore`, `useFetch`, `useDispatch`) to get the data or actions it needs directly.
4.  **Remove props** from the child component's arguments and `propTypes`.

**Example:**

**Before (Parent passes props):**

```javascript
// Parent
function Parent() {
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  return <Child settings={settings} />;
}

// Child
function Child({ settings }) {
  return <div>{settings.siteName}</div>;
}
```

**After (Child fetches data):**

```javascript
// Parent
function Parent() {
  return <Child />;
}

// Child
function Child() {
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  return <div>{settings.siteName}</div>;
}
```

This makes components more self-contained and easier to refactor or move.


## Translation Migration

### withTranslation HOC → useTranslation Hook

**Before:**

```javascript
import { withTranslation } from "react-i18next";

class MyComponent extends Component {
  render() {
    const { t } = this.props;
    return <div>{t("key")}</div>;
  }
}

export default withTranslation()(MyComponent);
```

**After:**

```javascript
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();
  return <div>{t("key")}</div>;
}
```

## React 18 Updates

### Remove React Import

In React 18, you no longer need to import React for JSX:

**Before:**

```javascript
import React, { useState } from "react";
```

**After:**

```javascript
import { useState } from "react";
```

## Migration Checklist

When converting a class component, follow this checklist:

- [ ] Convert `class Component extends Component` to `function Component()`
- [ ] Replace `this.state` with `useState` hook
- [ ] Replace lifecycle methods (`componentDidMount`, `componentWillUnmount`, etc.) with `useEffect`
- [ ] Replace `this.props.history` with `useNavigate()` hook
- [ ] Replace `this.props.location` with `useLocation()` hook
- [ ] Replace `this.props.match.params` with `useParams()` hook
- [ ] Ensure `navigate()` is called in `useEffect`, not during render (see Common Pitfalls)
- [ ] Remove `withRouter` HOC from export
- [ ] Remove `connectAndFetch` wrapper if present (replaces both `connect` and `withRouter`)
- [ ] Replace `connect(mapStateToProps)` with `useSelector`/`useFromStore` and `useDispatch` hooks
- [ ] Use `useFromStore` for entity store data instead of `useSelector` where appropriate
- [ ] Replace manual API calls (`dispatch(request(...))`) with `useApiCallback` hook where appropriate
- [ ] Use async/await syntax with `useApiCallback` instead of promise chains
- [ ] Replace `withTranslation()` with `useTranslation()` hook
- [ ] Watch for variable naming conflicts (e.g., `response` from hook vs callback parameter)
- [ ] Remove `React` import (React 18)
- [ ] Remove `PropTypes` for props that are now hooks
- [ ] Remove HOC wrappers from export (except HOCs that don't use router/Redux APIs like `withConfirmation`, which can be kept)
- [ ] Remove unused imports (e.g., `select` from entityUtils, `request` from entityStoreActions if using `useFetch`)
- [ ] Remove unused props from mapStateToProps (only include what's actually used in the component)
- [ ] Convert arrow function methods to regular const functions
- [ ] Update all `this.props` references to direct variable usage
- [ ] Replace `defaultProps` with default parameters in function signature
- [ ] Move `displayName` and `propTypes` to the end of the file (after the function definition)
- [ ] Ensure `import * as Styled from "./styles"` comes last in the import list
- [ ] Use ALL_CAPS_SNAKE_CASE for constants moved outside components
- [ ] Prefer destructuring over enumerating each property where possible
- [ ] Test navigation, routing, and state management

## Common Pitfalls

### Variable Naming Conflicts

When converting class components, watch for variable name conflicts between hook results and callback parameters:

**Problem:**

```javascript
const response = useFromStore({ path: "..." });

dispatch(action).promise.then(response => {
  // Error: 'response' is already declared
  postUpdate(response.data);
});
```

**Solution:**

```javascript
const response = useFromStore({ path: "..." });

dispatch(action).promise.then(res => {
  // Use different name for callback parameter
  postUpdate(res.data);
});
```

### Calling navigate() During Render

React Router v6 (and the compat package) will warn if `navigate()` is called during render. Always call `navigate()` inside a `useEffect` hook, not directly in the component body or during render.

**Problem:**

```javascript
function MyComponent() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  // ❌ BAD: Called during render
  if (!isAuthorized) {
    navigate("/login");
    return null;
  }

  return <div>Content</div>;
}
```

**Solution:**

```javascript
function MyComponent() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  if (!isAuthorized) return null;

  return <div>Content</div>;
}
```

**For SSR Redirects:**

If you need to support SSR redirects (using `react-router-config`), use the `Route` render prop pattern with `staticContext`:

```javascript
import { Route } from "react-router-dom";

function MyComponent() {
  const { isAuthorized } = useAuth();

  if (!isAuthorized) {
    const loginPath = "/login";
    return (
      <Route
        render={({ staticContext }) => {
          if (__SERVER__) {
            staticContext.url = loginPath;
          } else {
            window.location = loginPath;
          }
          return null;
        }}
      />
    );
  }

  return <div>Content</div>;
}
```

This pattern works for both SSR (sets `staticContext.url`) and client-side (uses `window.location`) redirects.

### Multiple State Fields

When converting `this.state` with multiple fields, you can either:

**Option 1: Separate useState calls (recommended for independent fields)**

```javascript
const [password, setPassword] = useState("");
const [passwordConfirmation, setPasswordConfirmation] = useState("");
```

**Option 2: Single useState with object (for related fields)**

```javascript
const [formData, setFormData] = useState({
  password: "",
  passwordConfirmation: ""
});
```

Use Option 1 when fields are independent and have separate handlers. Use Option 2 when fields are related and often updated together.

### Component Definition Order

When converting class components to functional components, follow this order:

1. **Imports** - All import statements at the top
   - Standard library imports first (React, hooks, etc.)
   - Third-party library imports
   - Internal imports (utils, components, etc.)
   - **Styled imports last** - `import * as Styled from "./styles"` should always come last in the import list
2. **Component Function** - The main component function definition
3. **displayName and propTypes** - At the end of the file, after the function

**Before (Class Component):**

```javascript
export class MyComponent extends Component {
  static displayName = "My.Component";
  static propTypes = {
    /* ... */
  };
  static defaultProps = {
    /* ... */
  };
  // ...
}
```

**After (Functional Component):**

```javascript
export default function MyComponent({ prop1 = "default", prop2 = 0 }) {
  // Component logic
  return <div>...</div>;
}

MyComponent.displayName = "My.Component";

MyComponent.propTypes = {
  prop1: PropTypes.string,
  prop2: PropTypes.number
};
```

**Key Changes:**

- Use default parameters in the function signature instead of `defaultProps`
- Remove `defaultProps` entirely - it's not needed for functional components
- Keep `displayName` and `propTypes` at the end of the file
- **Use inline `export default`** - When there are no HOCs, use `export default function ComponentName()` directly instead of a separate export statement

**Export Convention:**

When a component has no HOC wrappers, use inline `export default`:

```javascript
// ✅ Good - inline export when no HOCs
export default function MyComponent() {
  // ...
}

MyComponent.displayName = "My.Component";
MyComponent.propTypes = {
  /* ... */
};
```

When a component has HOC wrappers, use a separate export:

```javascript
// ✅ Good - separate export when HOCs are present
function MyComponent() {
  // ...
}

MyComponent.displayName = "My.Component";
MyComponent.propTypes = {
  /* ... */
};

export default withPluginReplacement(MyComponent);
```

This convention keeps the component logic at the top and metadata at the bottom, making the code easier to read and maintain. Default parameters are more idiomatic for functional components and make the defaults visible directly in the function signature.

### Constants and Helper Functions

When moving constants or helper functions outside of the component (which is often done when converting from class components), follow these conventions:

**Constants:**

- Use **ALL_CAPS_SNAKE_CASE** for constants moved outside components
- Place constants before helper functions, after imports

**Helper Functions:**

- Use camelCase for helper functions
- Place helper functions after constants, before the component

**Example:**

```javascript
import { useState, useEffect } from "react";

// ✅ Good - ALL_CAPS_SNAKE_CASE for constants
const API_DOCS_URL = `${config.services.api}/api/static/docs/v1/swagger.json`;

// ✅ Good - camelCase for helper functions
const adjustedSchema = schema => {
  const newSchema = { ...schema };
  delete newSchema.host;
  return newSchema;
};

const getEndpointCounts = schema => {
  if (!schema) return 0;
  let count = 0;
  Object.keys(schema.paths).forEach(path => {
    count += Object.keys(schema.paths[path]).length;
  });
  return count;
};

export default function Api() {
  // Component logic
}
```

**Before (Class Component):**

```javascript
class Api extends Component {
  get url() {
    return `${config.services.api}/api/static/docs/v1/swagger.json`;
  }

  adjustedSchema(schema) {
    delete schema.host;
    return schema;
  }
}
```

**After (Functional Component):**

```javascript
const API_DOCS_URL = `${config.services.api}/api/static/docs/v1/swagger.json`;

const adjustedSchema = schema => {
  const newSchema = { ...schema };
  delete newSchema.host;
  return newSchema;
};

export default function Api() {
  // Use API_DOCS_URL and adjustedSchema here
}
```

### Cleaning Up Unused Code

When converting from class components, you may find unused code that can be removed:

**Unused Imports:**

- Remove `select` from `utils/entityUtils` if you're using `useFetch` (it handles selection automatically)
- Remove `request` from `entityStoreActions` if you're using `useFetch` or `useApiCallback` (these hooks handle requests automatically)
- Remove `useDispatch` and `entityStoreActions` imports if you're using `useApiCallback` for all API calls
- Remove any other imports that are no longer needed

**Unused Props:**

- Review `mapStateToProps` and only include props that are actually used in the component
- If a prop was selected but never used in `render()`, remove it from `mapStateToProps`
- Example: If `loading` and `settings` were in `mapStateToProps` but never used, remove them

**Before:**

```javascript
static mapStateToProps = state => ({
  loading: state.ui.transitory.loading.active,  // Never used
  settings: select(requests.settings, state.entityStore),  // Never used
  page: select(requests.gPage, state.entityStore)  // Actually used
});
```

**After:**

```javascript
// Just use useFetch - it handles the data fetching and selection
const { data: page } = useFetch({
  request: [pagesAPI.show, slug],
  options: { requestKey: requests.gPage }
});
```

## When to Use useMemo

`useMemo` should only be used when necessary. Overusing it can make code harder to read and maintain without providing performance benefits.

### When to Use useMemo

✅ **Expensive calculations** - Complex transformations, filtering large arrays, or other computationally expensive operations

```javascript
const sortedItems = useMemo(() => {
  return largeArray.sort(complexSortFunction).filter(complexFilter);
}, [largeArray]);
```

✅ **Memoizing objects/arrays passed to hooks that need stable references** - When passing objects/arrays to hooks like `useFetch` that depend on props/state

```javascript
const filters = useMemo(
  () => ({ userId, status, order: "created_at DESC" }),
  [userId, status] // Updates when userId or status changes
);
```

✅ **Preventing unnecessary re-renders of memoized child components** - When passing computed values to components wrapped with `React.memo`

```javascript
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
return <MemoizedChild value={expensiveValue} />;
```

### When NOT to Use useMemo

❌ **Static objects/arrays** - Define as constants outside the component instead

```javascript
// ❌ Bad
const filterReset = useMemo(() => ({ standaloneModeEnforced: "false" }), []);

// ✅ Good
const FILTER_RESET = { standaloneModeEnforced: "false" };
```

❌ **Simple calculations** - React is already optimized for these

```javascript
// ❌ Bad
const total = useMemo(() => items.length, [items.length]);

// ✅ Good
const total = items.length;
```

❌ **Simple array/object construction** - Not expensive enough to warrant memoization

```javascript
// ❌ Bad
const breadcrumbs = useMemo(() => [{ to: link, label: title }], [link, title]);

// ✅ Good
const breadcrumbs = [{ to: link, label: title }];
```

❌ **Primitive values** - Never needed

```javascript
// ❌ Bad
const count = useMemo(() => 5, []);

// ✅ Good
const count = 5;
```

## When to Use useCallback

`useCallback` should only be used when the function needs a stable reference. Overusing it can make code harder to read and maintain without providing performance benefits.

### When to Use useCallback

✅ **Function is passed as prop to a memoized child component** - When the child is wrapped with `React.memo` and you want to prevent unnecessary re-renders

```javascript
const MemoizedChild = React.memo(ChildComponent);

function Parent() {
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);

  return <MemoizedChild onClick={handleClick} />;
}
```

✅ **Function is used as a dependency in other hooks** - When the function is in the dependency array of `useEffect`, `useMemo`, or another `useCallback`

```javascript
const fetchData = useCallback(() => {
  // fetch logic
}, [userId]);

useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData needs stable reference
```

✅ **Function is expensive to recreate** - Rare, usually only for complex closures with many dependencies

### When NOT to Use useCallback

❌ **Function is only called directly in the component** - No need for stable reference

```javascript
// ❌ Bad
const handleClick = useCallback(() => {
  navigate("/path");
}, [navigate]);

return <button onClick={handleClick}>Click</button>;

// ✅ Good
const handleClick = () => {
  navigate("/path");
};

return <button onClick={handleClick}>Click</button>;
```

❌ **Function is passed to non-memoized components** - `useCallback` doesn't help if the component isn't memoized

```javascript
// ❌ Bad - component is not memoized
const handleEditSuccess = useCallback(() => {
  navigate(membersRoute);
}, [navigate, membersRoute]);

return <NonMemoizedChild onSuccess={handleEditSuccess} />;

// ✅ Good
const handleEditSuccess = () => {
  navigate(membersRoute);
};

return <NonMemoizedChild onSuccess={handleEditSuccess} />;
```

❌ **Simple wrapper functions** - Not expensive to recreate

```javascript
// ❌ Bad
const createSubject = useCallback(
  name => createSubject({ type: "subject", attributes: { name } }),
  [createSubject]
);

// ✅ Good
const createSubject = name => {
  return createSubject({ type: "subject", attributes: { name } });
};
```

❌ **"Just in case" memoization** - React handles function recreation efficiently, don't optimize prematurely

## Common Patterns

### Form Component Pattern

```javascript
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom-v5-compat";
import { useFromStore } from "hooks";
import { requests } from "api";

export default function FormComponent() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const response = useFromStore({
    path: `entityStore.responses.${requests.gContactForm}`
  });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    return () => {
      dispatch(cleanup());
    };
  }, [dispatch]);

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(submitAction(formData)).then(() => {
      navigate("/success");
    });
  };

  // ... rest of component
}
```

### Container Component Pattern

```javascript
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";

export default function ContainerComponent() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });

  useEffect(() => {
    dispatch(fetchData(id));
  }, [dispatch, id]);

  // ... rest of component
}
```

## Important Notes

1. **v5 Compatibility:** We're using `react-router-dom-v5-compat` which provides v6 hooks and v5-compatible components (like `NavLink`, `Link`) but still works with v5 router. Some v6 features (like `Navigate` component) are not available until full v6 migration. Components imported from the compat package maintain v5 API compatibility while preparing for v6.

2. **useMatch Limitation:** `useMatch` is a v6 hook. During compat migration, continue using `useRouteMatch` for pattern matching, or use `useLocation().pathname` for simple checks.

3. **Redirect vs Navigate:** Keep using `Redirect` from v5 until full v6 migration. `Navigate` is not available in v5.

4. **HOC Removal:** After converting to hooks, remove all HOC wrappers (`withRouter`, `connect`, `withTranslation`) from the export statement. **Note:** Some HOCs like `withConfirmation` don't use router or Redux APIs that need migration, so they can be kept if desired.

5. **PropTypes:** Remove PropTypes for props that are now provided by hooks (dispatch, history, location, match, t).

6. **Testing:** Always test navigation, route parameters, and state management after migration.

## Component Organization

### Directory Structure

When creating new components, follow this directory structure convention:

**Component Location:**

- Place components in the appropriate section based on their usage:
  - `src/frontend/` - Frontend/library route components
  - `src/backend/` - Backend/admin route components
  - `src/reader/` - Reader route components
  - `src/global/` - Shared components used across multiple sections

**Directory Pattern:**

- Each component should be in its own directory with an `index.js` file
- The component file should be named `index.js` and placed in a directory named after the component

**Example Structure:**

```
src/
  global/
    components/
      router/
        OutletWithDrawer/
          index.js
        NavigationBlocker.js  (single file is also acceptable for simple components)
  frontend/
    components/
      reading-group/
        tables/
          Groups/
            index.js
          Members/
            index.js
  backend/
    components/
      layout/
        DrawerHeader/
          index.js
```

**Benefits:**

- Consistent organization across the codebase
- Easy to locate components by their usage context
- Supports future expansion (can add styles, tests, etc. in the same directory)
- Clear separation between frontend, backend, reader, and global components

**Import Pattern:**

```javascript
// Import from component directory (index.js is implied)
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
```

## File Structure After Migration

**Before:**

```javascript
// Class component with HOCs
export class MyComponent extends Component { ... }
export default connect(...)(withRouter(withTranslation()(MyComponent)));
```

**After:**

```javascript
// Functional component with hooks
export default function MyComponent() { ... }
// No HOC wrappers needed
```
