<!-- 80d3496e-2c4c-4785-8780-316e9946db93 1762fa5b-8e1c-4aa3-a448-73b66c76f140 -->
# Add Authentication Loaders to Protected Routes

## Problem

Routes using `<Navigate>` for authentication redirects cause SSR warnings because `<Navigate>` shouldn't be used on initial render in `<StaticRouter>`. We need to move authentication checks to route loaders.

## Solution

Use React Router v6 loaders to check authentication before components render. Loaders can access the Redux store via context and throw `redirect()` to handle redirects properly in both SSR and client-side.

## Implementation Steps

### 1. Create Authentication Loader Utility

- **File**: `src/helpers/router/requireAuth.js`
- Create a reusable loader function that:
  - Accepts a `redirectPath` parameter (default: `/login`)
  - Checks `store.getState().authentication.currentUser`
  - Throws `redirect()` if no user is authenticated
  - Returns `null` if authenticated (loaders can return null)
  - Accepts store from loader context

### 2. Update SSR to Pass Store to Loaders

- **File**: `src/entry-ssr.js`
- Modify the `render` function to:
  - Create store and bootstrap authentication BEFORE creating the handler
  - Pass store in context to `createStaticHandler`:
    ```javascript
    const handler = createStaticHandler(routes, {
      basename: "/",
      context: { store }
    });
    ```

  - Ensure bootstrap completes before calling `handler.query()`

### 3. Update Client-Side Router to Pass Store

- **File**: `src/routes/createRouter.js` or `src/global/containers/App/index.js`
- For client-side, we need to make store available to loaders
- Options:
  - Pass store via `createBrowserRouter` context (if supported)
  - Or access store via a global/singleton pattern
  - Or use React context provider for store access in loaders

### 5. Add Loaders to Protected Routes

- **File**: `src/frontend/routes-v6.js`
- Add `loader` property to routes that need authentication:
  - `PrivacySettings` route (`/privacy`)
  - `MyReadingGroups.Wrapper` route (`/my/groups`)
  - `MyStarred` route (`/my/starred`)
  - `Subscriptions` route (`/subscriptions`)
  - `MyAnnotations` route (`/my/notes`) - may need auth check too

- Each loader should:
  ```javascript
  import { redirect } from "react-router-dom";
  import requireAuth from "helpers/router/requireAuth";
  
  export async function loader({ context }) {
    return requireAuth(context.store, "/privacy"); // or appropriate redirect path
  }
  ```


### 5. Remove Navigate Components from Protected Routes

- **Files to update**:
  - `src/frontend/containers/PrivacySettings/index.js` - Remove Navigate, remove `useCurrentUser` check
  - `src/frontend/containers/MyReadingGroups/Wrapper.js` - Remove Navigate, remove `useCurrentUser` check
  - `src/frontend/containers/MyStarred/index.js` - Remove Navigate, remove `useCurrentUser` check
  - `src/frontend/containers/Subscriptions/index.js` - Remove Navigate, remove `useCurrentUser` check
  - `src/frontend/containers/MyAnnotations/index.js` - Add auth check if needed

### 6. Handle Redirect Query Parameters

- Update `requireAuth` utility to:
  - Accept current URL pathname to include as `redirect_uri` query param
  - Format redirect as: `/login?redirect_uri=/privacy`
  - Use `URLSearchParams` or `queryString` to build query string

### 7. Update Route Definitions

- **File**: `src/frontend/routes-v6.js`
- For each protected route, add:
  ```javascript
  {
    element: <PrivacySettings />,
    path: "privacy",
    loader: async ({ context, request }) => {
      const url = new URL(request.url);
      return requireAuth(context.store, url.pathname);
    },
    handle: { ... }
  }
  ```


## Considerations

1. **Store Access in Loaders**: Loaders receive `context` which we'll populate with the store. This works for SSR. For client-side, we may need to access store differently (via singleton or React context).

2. **Bootstrap Timing**: Ensure authentication bootstrap completes before loaders run in SSR.

3. **Redirect URI**: Preserve the current path in `redirect_uri` query param so users can return after login.

4. **ReadingGroup Members**: This route has a different check (`userIsGroupMember` vs just `currentUser`). May need a separate loader utility or extend `requireAuth` to accept a custom check function.

## Testing

- Verify SSR redirects work correctly
- Verify client-side redirects work correctly
- Verify redirect_uri is preserved
- Verify no SSR warnings appear
- Test with authenticated and unauthenticated users

### To-dos

- [ ] Create requireAuth helper utility in src/helpers/router/requireAuth.js that checks authentication and throws redirect()
- [ ] Update src/entry-ssr.js to pass store in context to createStaticHandler and ensure bootstrap completes first
- [ ] Update client-side router setup to make store available to loaders (may need global access pattern)
- [ ] Add loader functions to protected routes in src/frontend/routes-v6.js (PrivacySettings, MyReadingGroups, MyStarred, Subscriptions, MyAnnotations)
- [ ] Remove Navigate components and useCurrentUser checks from PrivacySettings, MyReadingGroups, MyStarred, and Subscriptions containers
- [ ] Test SSR redirects work correctly without warnings