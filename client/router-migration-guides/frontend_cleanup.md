# Frontend Routes Migration Review & Remaining Work

## Context

The frontend routes have been migrated from React Router v7 data mode + Redux to v7 framework mode. Data fetching now uses `ApiClient` in loaders, global state (settings, auth, pages) flows through middleware + `AppContext`, and frontend-specific data (subjects) flows through `FrontendContext`. Redux is retained only for client-only UI state (overlays, navigation, frontendMode, notifications). This review identifies what must be done before moving to reader/backend routes.

---

## Overall Assessment

The migration is in strong shape. The route layer is clean: zero Redux in any `app/routes/frontend/` file, consistent use of shared loader utilities (`loadEntity`, `loadList`, `loadParallelLists`, `queryApi`), a well-structured middleware + context architecture, and proper auth/authorization patterns. The work below is cleanup and bug fixes, not structural.

---

## Tasks

### 1. Fix frontend ErrorBoundary to handle all error statuses

**Problem**: `app/routes/frontend/_frontend/ErrorBoundary.jsx:31` only catches `error.status === 500`, so 404s and 403s bubble to the root ErrorBoundary which renders without header/footer.

**Fix**: Render all route error responses (404, 401, 403, 500) within the frontend layout. Only re-throw non-route errors (runtime exceptions without a status). Also fix the conditional `useMemo` (line 33) which violates React's rules of hooks -- move it before the conditional or extract into a child component.

**File**: `app/routes/frontend/_frontend/ErrorBoundary.jsx`

- Remove the `error.status === 500` guard; instead check `isRouteErrorResponse(error)` or `!!error.status`
- Move `useMemo` before the conditional branch
- Remove `console.log` statements (lines 26-28, 32)
- Clean up the emotion cache workaround code (was for HMR testing, no longer needed)

### 2. Clean up RootErrorBoundary

**File**: `app/RootErrorBoundary.jsx`

- Remove `console.log({ cache })` (line 54)
- Remove `<div>Root Error Boundary</div>` debug marker (line 85)
- Remove the emotion cache workaround (`useMemo` creating `createEmotionCache` + `CacheProvider` wrapper) -- this was for the HMR testing. The root error boundary should use the same cache as the main app, or just render without the CacheProvider wrapper since it already has `GlobalStyles`.

### 3. Remove all debug logging from emotion-stream.js

**File**: `app/utils/emotion-stream.js`

- Remove all `console.log("[EmotionStyleExtractor]..."` statements (~25 lines throughout `createEmotionStyleExtractorStream`)
- Remove `debug` logging from `createEmotionStyleFixerStream` -- change the `console.log` on line 277 and `console.warn` on line 287 to only log on actual errors (keep `console.error` for real errors, remove debug trace logs)
- Keep the actual error handling (`console.error` for caught exceptions is fine)

### 4. Fix catch-all route to throw proper 404

**File**: `app/routes/$.jsx`

- Currently renders bare unstyled HTML. Replace with `throw data(null, { status: 404 })` in a loader so it triggers the error boundary chain.

```js
import { data } from "react-router";

export const loader = () => {
	throw data(null, { status: 404 });
};

export default function CatchAll() {
	return null;
}
```

### 5. Replace `react-uid` with `useId` in shared global components used by frontend

These cause SSR hydration mismatches on frontend pages. 5 files in `src/global/`:

| File                                                                                   | Pattern                          |
| -------------------------------------------------------------------------------------- | -------------------------------- |
| `src/global/components/Overlay/index.js`                                               | `useUID`/`useUIDSeed` -> `useId` |
| `src/global/components/dialog/Confirm/index.js`                                        | `useUID`/`useUIDSeed` -> `useId` |
| `src/global/components/atomic/form/Select/index.js`                                    | `useUID`/`useUIDSeed` -> `useId` |
| `src/global/components/atomic/Tooltip/index.js`                                        | `useUID`/`useUIDSeed` -> `useId` |
| `src/global/components/form/ContentEditor/components/controls/buttons/insert/Modal.js` | `useUID`/`useUIDSeed` -> `useId` |

**Pattern** (established in Phase 6 of migration guide):

```js
// Before
import { useUIDSeed } from "react-uid";
const seed = useUIDSeed();
const id = seed("content");

// After
import { useId } from "react";
const baseId = useId();
const id = `${baseId}-content`;
```

---

## Things That Are Fine / Can Defer

### Remaining Redux in `src/global/` components

The `useDispatch` + `commonActions` pattern in footers and navigation is client-only UI state. The `useFromStore` calls for notifications and OAuth are also client-only. These will be cleaned up in the "remove Redux entirely" final pass and are not blockers.

### `shouldRevalidate` on more routes

The default revalidation behavior (refetch on navigation) is acceptable. The existing `shouldRevalidate` on the layout route (`= false` for subjects) and homepage is correct. No need to add to other routes.

### `useFromStore` in 3 frontend component files

- `src/frontend/components/login/index.js` -- reads notifications (client-only UI)
- `src/frontend/components/resource/Preview/EditorActions/index.js` -- backend editor component
- `src/frontend/components/resource-collection/Preview/EditorActions/index.js` -- same

These are either client-only state or backend-facing components. Defer to final Redux pass.

### `useFromStore` for frontendMode in `_frontend/route.jsx`

Line 45 reads `ui.transitory.frontendMode` from Redux. This is a client-only UI flag set by the backend. Defer to final Redux pass.

### `react-uid` in `src/backend/` and `src/reader/` components

17 files in backend/reader still use `react-uid`. These will be fixed when those routes are migrated.

### Meta/head management

Still using `react-helmet-async`. Works fine, not a blocker. Can migrate to React Router's `meta` export later.

---

## Verification

After implementing the changes:

1. `yarn dev:framework` -- app starts without errors
2. Navigate to homepage `/` -- renders with SSR, no hydration warnings in console
3. Navigate to `/projects/nonexistent-slug` -- shows 404 **within frontend layout** (header + footer visible)
4. Navigate to a protected route while logged out -- shows login redirect or 403 within layout
5. Navigate to `/some/random/path` -- catch-all triggers 404 within error boundary (not bare HTML)
6. Check browser console -- no debug `console.log` output from emotion-stream, error boundaries
7. Check server console -- no `[EmotionStyleExtractor]` trace logs (errors should still log)
8. Test login/logout -- revalidation works, auth state updates
9. Open components using `Overlay`, `Dialog.Confirm`, `Select`, `Tooltip` -- no hydration mismatch warnings
