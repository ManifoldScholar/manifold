# Backend Routes Migration: Data Fetching & State Patterns

## 1. Architecture Overview

Data flows through four layers:

1. **Middleware** (`app/middleware/bootstrap.server.js`) runs on every request. It loads settings, current user (auth), pages, and reading groups into `routerContext`, making them available to all loaders and components.

2. **Loaders** run before render (server + client). They fetch route-specific data using shared utilities in `app/routes/utility/loaders/`. All API calls go through `queryApi`, which reads the auth token from `routerContext` (server) or cookies (client).

3. **Components** receive data via the `loaderData` prop (route components) or `useOutletContext()` (children of layout routes).

4. **Mutations** use either route `action` exports (form submissions / CRUD that navigates after) or `useApiCallback` (imperative API calls). After mutating, call `useRevalidator().revalidate()` to refresh loader data.

---

## 2. Loader Utilities

All utilities live in `app/routes/utility/loaders/`.

### `loadEntity({ context, fetchFn, request })`

Fetches a single entity. Returns `entity.data` or throws 404. Handles 401 by calling `requireLogin`.

**Default export** from `loadEntity.js`.

```js
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
};
```

### `loadList({ request, context, fetchFn, options })`

Fetches a paginated/filtered list. Parses URL search params automatically via `parseListParams`. Returns `{ data: [], meta: null }`.

`options` is passed to `parseListParams` and supports `defaultFilters`, `defaultPagination`, `arrayKeys`, etc.

**Default export** from `loadList.js`.

```js
import loadList from "app/routes/utility/loaders/loadList";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: { defaultFilters: { standaloneModeEnforced: "false" } }
  });
};
```

### `loadParallelLists({ context, fetchFns })`

Loads multiple lists in parallel via `Promise.allSettled`. Failed requests return `undefined` (logged but not thrown).

`fetchFns` is an object mapping keys to thunks.

**Default export** from `loadParallelLists.js`.

```js
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";

const results = await loadParallelLists({
  context,
  fetchFns: {
    resources: () => resourcesAPI.forSection(sectionId, textId),
    annotations: () => annotationsAPI.forSection(sectionId, textId)
  }
});
return {
  resources: results.resources ?? [],
  annotations: results.annotations ?? []
};
```

### `authorize({ request, context, ability, kind, entity, failureMessage })`

Checks authorization in a loader. Calls `requireLogin` first, then uses the `Authorization` class. Throws 403 with message if unauthorized.

`ability`, `kind`, and `entity` each accept a single value or an array.

**Important:** Pass the actual entity object, not a type string like `["journal"]`. A type string checks "can this user update *any* journal"; passing the entity checks "can this user update *this* journal." Load the entity first, then authorize against it.

**Important:** Don't duplicate `authorize` calls in child routes when the parent layout already checks the same ability. React Router runs parent loaders before children, so a child nested under `$id/_layout.jsx` (which authorizes `update` on the entity) doesn't need its own `authorize` call. Only add `authorize` in a child when it checks a *different* ability or entity. If the child needs a different auth check but doesn't need to fetch the entity itself (because the parent already provides it via outlet context), use `useAuthorizeRoute` in the component instead — this avoids a redundant `loadEntity` call in the child loader just to run auth.

**Default export** from `authorize.js`.

```js
import loadEntity from "app/routes/utility/loaders/loadEntity";
import authorize from "app/routes/utility/loaders/authorize";

export const loader = async ({ params, request, context }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({ request, context, ability: "update", entity: project });
  return project;
};
```

### `useAuthorizeRoute({ entity, ability, message? })` (client-side)

Client-side authorization hook for sub-layouts that receive their entity from `useOutletContext()`. Throws a 403 `data()` response (caught by the backend `ErrorBoundary`) if the user lacks the required ability.

**Default export** from `src/hooks/useAuthorizeRoute/index.js`. Also exported from `hooks`.

Use this instead of `authorize()` in the loader when the parent layout already fetches the entity — it avoids a redundant server-side fetch just to run an auth check.

```js
import { Outlet, useOutletContext } from "react-router";
import { useAuthorizeRoute } from "hooks";

export default function ResourcesLayout() {
  const project = useOutletContext();
  useAuthorizeRoute({ entity: project, ability: "manageResources" });
  return <Outlet context={project} />;
}
```

With a custom error message (uses `useTranslation` in the caller):

```js
useAuthorizeRoute({
  entity: project,
  ability: "manageTexts",
  message: t("errors.access_denied.authorization_admin_type", {
    type: t("glossary.text_other")
  })
});
```

**When to use `authorize` (loader) vs `useAuthorizeRoute` (component):**

| Scenario | Use |
|---|---|
| Route fetches its own entity in the loader | `authorize()` in the loader — you already have the entity |
| Route gets entity from parent via outlet context | `useAuthorizeRoute()` in the component — avoids re-fetching |
| Parent layout broadens auth for multiple child groups | `useAuthorizeRoute()` in each child group's sub-layout |

### `requireLogin(request, context)`

Redirects to `/login?redirect_uri=...` if no user is present in context.

**Default export** from `requireLogin.js`.

### `createListClientLoader({ hydrateKey, fetchFn, options })`

Returns a `clientLoader` for list routes. On first load it uses server data; after hydration it fetches client-side. The returned function has `hydrate = true` set automatically.

**Default export** from `createListClientLoader.js`.

```js
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";

export const clientLoader = createListClientLoader({
  hydrateKey: "__projectsHydrated",
  fetchFn: projectsAPI.index,
  options: { defaultFilters: { standaloneModeEnforced: "false" } }
});
```

### `parseListParams(url, options)`

Parses URL search params into `{ filters, pagination }`.

**Default export** from `parseListParams.js`.

`options`:
| Key | Default | Description |
|---|---|---|
| `defaultFilters` | `{}` | Merged with parsed filters |
| `defaultPagination` | `{ page: 1, perPage: 20 }` | Merged with parsed pagination |
| `paginationKeys` | `["page", "perPage"]` | Which params are pagination (rest are filters) |
| `additionalPagination` | — | Nested pagination structures |
| `arrayKeys` | `[]` | Keys to always treat as arrays |
| `skipFilters` | `false` | Skip filter parsing; `filters` returns `null` |
| `skipPagination` | `false` | Skip pagination parsing; `pagination` returns `null` |

### `shouldRevalidate({ currentUrl, nextUrl, formAction, defaultShouldRevalidate })`

Revalidates on form submissions and same-URL navigations (explicit `revalidate()` calls). Skips revalidation on different-page navigations.

**Named export** from `shouldRevalidate.js`.

```js
export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";
```

---

## 3. API Helpers

All helpers live in `app/routes/utility/helpers/`.

### `queryApi(fetchFn, context?, signal?)`

**Named export** from `queryApi.js`.

Core helper for all API calls in loaders and actions. Gets the auth token from `routerContext` (server) or cookies (client). All loader utilities use this internally.

### `handleLoaderError(error)`

**Default export** from `handleLoaderError.js`.

Throws the error if it has a `status` property (i.e., it's already a Response); otherwise throws a 404. Used as the catch handler in loader utilities.

### `handleActionError(error)`

**Default export** from `handleActionError.js`.

Re-throws redirects (3xx). For API errors, returns `{ errors: error.body.errors }`. For other errors, returns a generic error object. Used in action catch blocks.

---

## 4. Route Module Structure

A complete backend route module:

```js
// app/routes/backend/projects/$id/_layout.jsx
import { Outlet } from "react-router";
import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import authorize from "app/routes/utility/loaders/authorize";

export const loader = async ({ params, request, context }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({ request, context, ability: "update", entity: project });
  return project;
};

export default function ProjectLayout({ loaderData: project }) {
  return <Outlet context={project} />;
}
```

Child route consuming parent data:

```js
// app/routes/backend/projects/$id/texts.jsx
import { useOutletContext } from "react-router";

export default function ProjectTextsRoute() {
  const project = useOutletContext();
  return <TextsList project={project} />;
}
```

---

## 5. Mutations

### Pattern A: Route Actions with `useFetcher` + `FormContainer.Form`

The preferred pattern for forms. `FormContainer.Form` has native `fetcher` prop support — it handles submission, reads errors from `fetcher.data.errors`, tracks submitting state from `fetcher.state`, and clears the navigation blocker on `fetcher.data.success`.

Drop the legacy `create`/`update` API props from `FormContainer.Form` — the route action handles the API call.

#### `formAction` helper

Most route actions follow an identical pattern: parse JSON, call an API via `queryApi`, return errors or success/redirect. The `formAction` helper (`app/routes/utility/helpers/formAction.js`) encapsulates this. Use it for any action that does a single mutation — only write a manual action when the route needs multi-intent dispatching, auth checks, data mutation before the API call, or custom return values.

```js
import formAction from "app/routes/utility/helpers/formAction";
```

**Update (stays on same page):**

```js
export const action = formAction({
  mutation: ({ data, params }) => pagesAPI.update(params.id, data)
});
```

**Create (redirects after success):**

```js
export const action = formAction({
  mutation: ({ data }) => projectsAPI.create(data),
  redirectTo: ({ result }) => `/backend/projects/${result.data.id}`
});
```

**With data transformation in the mutation closure:**

```js
// Add metadata
export const action = formAction({
  mutation: ({ data }) =>
    usersAPI.create({ ...data, meta: { createdByAdmin: true } }),
  redirectTo: ({ result }) => `/backend/records/users/${result.data.id}`
});

// Pass a subset of data
export const action = formAction({
  mutation: ({ data }) => meAPI.update(data.attributes)
});
```

`mutation` receives `{ data, params }` where `data` is the parsed JSON body and `params` is the route params object. It should return the API call (the promise passed to `queryApi`).

`redirectTo` is optional. When provided, it receives `{ result, params }` and should return a path string. The helper uses `throw redirect(...)` internally.

When `redirectTo` is omitted, the helper returns `{ success: true }` — React Router auto-revalidates the parent layout loader after the action, refreshing the entity data.

#### Manual actions

Write a manual action (instead of `formAction`) when the route needs:
- Multi-intent dispatching (`if (intent === "delete") ...`)
- Auth checks before the API call
- Custom error handling (e.g. custom message arg to `handleActionError`)
- Custom return values (not `{ success: true }` or redirect)
- `return redirect()` instead of `throw redirect()` (rare edge case)

```js
import { redirect } from "react-router";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(pagesAPI.update(params.id, data), context);
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}
```

### Pattern A (alt): Route Actions with `useSubmit`

Use when not using `FormContainer.Form` (e.g. custom forms or non-form submissions).

```js
import { useSubmit } from "react-router";

function MyComponent({ actionData }) {
  const submit = useSubmit();
  const handleSave = data => {
    submit(JSON.stringify(data), {
      method: "POST",
      encType: "application/json"
    });
  };
  const errors = actionData?.errors || [];
  // ...
}
```

### Pattern B: `useApiCallback`

Use for imperative mutations that don't navigate.

```js
import { useApiCallback } from "hooks";
import { useRevalidator } from "react-router";
import { annotationsAPI } from "api";

function MyComponent() {
  const destroyAnnotation = useApiCallback(annotationsAPI.destroy);
  const { revalidate } = useRevalidator();

  const handleDelete = async id => {
    await destroyAnnotation(id);
    revalidate(); // refresh loader data
  };
}
```

### Pattern C: Direct `queryApi` in callbacks

Use when you need the context object or don't want to use `useApiCallback`.

```js
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useRevalidator } from "react-router";

function MyComponent() {
  const { revalidate } = useRevalidator();

  const handleRemove = async membershipId => {
    await queryApi(membershipsAPI.destroy(membershipId));
    revalidate();
  };
}
```

---

## 6. Accessing Global State

### `AppContext` — settings, auth, pages

```js
import { useContext } from "react";
import { AppContext } from "app/contexts";

const { settings, pages } = useContext(AppContext);
```

Loaded by middleware, always available. Use for data that doesn't change per-route.

### `useLoaderEntity(type)` / `useLoaderCollection(type)`

Search all matched route loader data for an entity or collection by JSON:API `type` string. Useful in deeply nested components that don't receive loader data via props.

**Default exports** from `src/hooks/useLoaderEntity.js` and `src/hooks/useLoaderCollection.js`.

```js
import { useLoaderEntity, useLoaderCollection } from "hooks";

const project = useLoaderEntity("projects");
const resources = useLoaderCollection("resources");
```

---

## 7. Replacing Legacy Patterns

| Legacy pattern | Replacement |
|---|---|
| `useFetch({ request: [api.index, ...args] })` in wrapper | Route `loader` with `loadEntity` or `loadList` |
| `useFromStore("entityStore.entities.X")` | `useLoaderEntity` / `useLoaderCollection` / `useOutletContext` |
| `useDispatch` + `flush(requestKey)` cleanup | Remove — loaders handle caching |
| `useApiCallback` for mutations | Keep as-is, add `revalidate()` after mutation |
| `Authorize` HOC wrapping route component | `authorize()` in loader, or `useAuthorizeRoute()` in component if entity comes from parent context |
| `withConfirmation` HOC | `useConfirmation` hook + `<Dialog.Confirm />` |
| `RedirectToFirstMatch` hook | Index route with `throw redirect("child")` in loader |
| `connectAndFetch` / `connect` (Redux) | Route loader + hooks |
| `FormContainer` with `create`/`update` API props | `FormContainer.Form` with `fetcher` prop; route `action` handles API call |
| `FormContainer` with `name` prop | Remove `name` — it was for Redux store keying and is no longer accepted |
| `FormContainer` with `refreshes` option | `FormContainer` can stay; replace redux refresh with `revalidate()` or route action |
| `FormContainer` with `onSuccess` callback + navigate | Route action with `throw redirect(...)` on success |
| `lh.link("routeName")` | Direct string path (e.g. `"/backend/records/pages"`) |
| `lh.link("routeName")` in PageHeader action objects | Use `path` key (e.g. `{ label, path: "/page/slug", icon }`) — not `route`/`slug` |
| `withFilteredLists` HOC | Define filter params inline + `useListQueryParams` (see section 9) |
| `OutletWithDrawer` + `context={{ refetch }}` | Drop the `refetch` callback — revalidation is automatic. Pass `context` only when drawer children need data not available via their own loaders (e.g. `{ entity, closeUrl }` or `{ project, revalidate }`). |
| `setter` HOC wrapping form components | `useContext(FormContext)` for `getModelValue` and `actions.setValue` (see section 16) |
| `<main>` / wrapper element in detail layout | Omit if parent layout already renders it — check the nesting chain |

---

## 8. Confirmation Dialogs

### Prefer `useConfirmation` hook over `withConfirmation` HOC

The legacy `withConfirmation` HOC wraps a component and injects a `confirm` prop. For migrated routes, prefer the `useConfirmation` hook instead — it avoids HOC wrapping and gives the callback control over when the dialog closes.

```js
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";

export default function PageDetailLayout({ loaderData: page }) {
  const { confirm, confirmation } = useConfirmation();

  const handleDestroy = () => {
    confirm({
      heading: t("modals.delete_page"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await deletePage(page.id);
        closeDialog();
        navigate("/backend/records/pages");
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {/* rest of component */}
    </>
  );
}
```

Key differences from the HOC:
- `confirm()` takes an options object (`{ heading, message, callback }`) instead of positional args
- `callback` receives `closeDialog` — call it to dismiss the dialog (useful for async operations)
- You render `{confirmation && <Dialog.Confirm {...confirmation} />}` in your JSX
- Also supports `icon`, `form`, `resolveLabel`, and `closeCallback` options

---

## 9. Drawer Routes

Some backend routes (makers, subjects, etc.) use a drawer pattern: the list is always visible and new/edit routes render as a side drawer overlay.

### Setup

The **layout route** renders `OutletWithDrawer` which manages drawer open/close state based on the current match's `handle`:

```js
// app/routes/backend/records/makers/_layout.jsx
import OutletWithDrawer from "global/components/router/OutletWithDrawer";

export default function MakersLayout({ loaderData }) {
  return (
    <>
      <OutletWithDrawer
        drawerProps={{
          closeUrl: "/backend/records/makers",
          lockScroll: "always"
        }}
      />
      <EntitiesList entities={loaderData.data} /* ... */ />
    </>
  );
}
```

**Child routes** export `handle = { drawer: true }` to signal they should render inside the drawer:

```js
// app/routes/backend/records/makers/new.jsx
export const handle = { drawer: true };

export default function MakersNew() {
  return (
    <section>
      <Layout.DrawerHeader title="..." />
      <FormContainer.Form fetcher={fetcher} notificationScope="drawer">
        {/* form fields */}
      </FormContainer.Form>
    </section>
  );
}
```

Key points:
- `OutletWithDrawer` reads `handle.drawer` from the deepest matched route to determine open state
- The old `refetch` callback pattern is replaced by automatic loader revalidation — no need to pass `refetch` via context
- Pass `context` when drawer children need shared data (e.g. `context={{ entity: project, closeUrl }}` or `context={{ project, revalidate }}`). Children access this via `useOutletContext()`.
- Use `notificationScope="drawer"` on `FormContainer.Form` so success/error toasts appear in the drawer
- To highlight the active row in the list, pass `useParams().id` as the `active` prop to `entityComponentProps`

---

## 10. Replacing `withFilteredLists`

The `withFilteredLists` HOC managed filter params and wired them to `useListQueryParams`. In framework mode, define the filter config inline and pass it directly.

### Before (with HOC)

```js
import withFilteredLists, { makerFilters } from "hoc/withFilteredLists";

function MakersList({ entitiesListSearchProps, entitiesListSearchParams }) {
  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.makers,
    initSearchProps: entitiesListSearchProps("makers")
  });

  const { data: makers } = useFetch({
    request: [makersAPI.index, filters, pagination]
  });
  // ...
}

export default withFilteredLists(MakersList, { makers: makerFilters() });
```

### After (inline)

```js
const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  {
    label: "Order",
    name: "order",
    value: "last_name",
    options: [
      { label: "Alphabetical by first name", value: "first_name" },
      { label: "Alphabetical by last name", value: "last_name" }
    ]
  }
];

const INIT_FILTERS = { order: "last_name" };

const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", order: "last_name" }
};

export default function MakersLayout({ loaderData }) {
  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  // loaderData comes from the route loader (loadList) — no useFetch needed
  const { data: makers, meta } = loaderData;

  return <EntitiesList search={<Search {...searchProps} />} /* ... */ />;
}
```

Key points:
- `INIT_FILTERS` should only contain non-empty default values (what `pickBy(values, identity)` would return). These become the initial URL filter params.
- `INIT_SEARCH_PROPS` needs `params` (array of `{ label, name, options? }`) and `values` (object with all param defaults including empty strings). This drives the `Search` component's UI.
- The loader's `defaultFilters` should match `INIT_FILTERS` so the server-side fetch uses the same defaults when no URL params are present.
- `useListQueryParams` pushes filter changes to URL params, which triggers the loader to re-run with the new filters. The data flow is: URL is the source of truth.
- The `useFetch` call is gone — `loadList` in the loader handles fetching.

---

## 11. Bulk Actions on List Routes

List routes that support bulk selection and deletion (e.g. users) use a set of hooks and components from `backend/components/list/EntitiesList/List/bulkActions/`.

### Imports

```js
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";
```

### Hooks

**`useBulkActions(records, filters)`** — Takes the current page's entities and the active filter object (from `useListQueryParams`). Returns `bulkActionsActive`, `toggleBulkActions`, `bulkSelection`, `bulkSelectionEmpty`, `handleSelectAll`, `resetBulkSelection`, `addItem`, `removeItem`, `addPage`.

**`useClearBulkSelectionWithFilters(onReset, setParam, resetBulkSelection, bulkSelectionEmpty)`** — Wraps the `onReset` and `setParam` from `searchProps` to also clear bulk selection when filters change. Use its returned `{ setParam, onReset }` in `<Search />`.

### Bulk delete callback

`bulkSelection` has two modes: when `bulkSelection.filters` is non-null, the entire filtered set is selected (pass `{ filters: bulkSelection.filters, ids: [] }` to the API); when null, `bulkSelection.ids` is the explicit list (pass `{ filters: {}, ids: bulkSelection.ids }`). After a successful delete, call `revalidate()` and `resetBulkSelection()`.

### Components

```js
// Replace count display with SelectAll when bulk mode is active
showCount={
  bulkActionsActive ? (
    <SelectAll
      pagination={meta.pagination}
      unit={unit}
      onSelect={handleSelectAll}
      onClear={resetBulkSelection}
      onSelectPage={() => addPage(entities.map(e => e.id))}
      allSelected={!!bulkSelection.filters}
      idsSelectedCount={bulkSelection.ids.length}
    />
  ) : true
}

// Toggle bulk mode and show delete button
buttons={[
  <BulkActionButtons
    active={bulkActionsActive}
    onBulkDelete={handleBulkDelete}
    toggleBulkActions={toggleBulkActions}
    actionsDisabled={bulkSelectionEmpty}
  />,
  ...(!bulkActionsActive ? [<Button path="/backend/records/users/new" />] : [])
]}

// Pass selection state to row components
entityComponentProps={{
  bulkActionsActive,
  bulkSelection,
  addItem,
  removeItem
}}
```

---

## 12. Keeping `useFetch` for Sub-Lists

Replace `useFetch` with route loaders for primary data, but keep `useFetch` when a route renders **multiple independently-paginated sub-lists** that would be awkward to encode in URL params. For example, a user activity tab with separate annotations and reading group membership lists, each with their own pagination.

```js
const [annotationsPagination, setAnnotationsPage] = usePaginationState(1, 5);
const filters = useMemo(() => ({ formats: ["annotation"], order: "created_at DESC" }), []);

const { data: annotations, meta: annotationsMeta, refresh } = useFetch({
  request: [usersAPI.annotations, user.id, filters, annotationsPagination]
});

// After imperative delete, refresh the specific list (not revalidate):
await deleteAnnotation(id);
refresh();
```

Use `paginationTarget={false}` on `EntitiesList` to suppress URL-based pagination and wire `callbacks={{ onPageClick: page => () => setAnnotationsPage(page) }}` instead.

---

## 13. Shared Properties Component (Create vs. Edit)

A single `Properties` component can handle both create and edit by accepting `{ user, fetcher, saveLabel }`:

```js
// Module-scope constant — stable reference prevents infinite re-renders
const DEFAULT_USER = { attributes: { role: "reader" } };

export default function UserProperties({ user, fetcher, saveLabel }) {
  return (
    <FormContainer.Form fetcher={fetcher} model={user ?? DEFAULT_USER} className="form-secondary">
      {!user && <Form.GeneratedPasswordInput ... />}  {/* create-only field */}
      <Form.Save text={saveLabel ?? t("records.users.submit_label")} />
    </FormContainer.Form>
  );
}
```

**Important:** Declare default model objects at **module scope** (outside the component), not inline. An inline `user ?? { attributes: { role: "reader" } }` creates a new object reference every render, causing `FormContainer.Form` to reinitialize in a loop.

The **create route** (`new.jsx`) passes no model and a custom `saveLabel`; its action uses `throw redirect(...)`. The **edit route** (`properties.jsx`) passes the entity from `useOutletContext()`; its action returns `{ success: true }`.

---

## 14. Navigation Link Shape

`SecondaryNav` and `PageHeader` expect link objects with string `path` values (not functions or route names):

```js
// navigation.js helper
static user = memoize(user => [
  {
    label: "titles.properties",
    path: `/backend/records/users/${user.id}/properties`,
    entity: user,
    ability: "update"
  },
  {
    label: "titles.activity",
    path: `/backend/records/users/${user.id}/activity`,
    entity: user,
    ability: "update"
  }
]);
```

- `path` — absolute string path, used as `NavLink` `to` prop
- `label` — i18n key (translated inside the component)
- `entity` / `ability` — optional, used by `Authorize` wrapper to conditionally show links

For **create routes** without an entity, use a single-item nav pointing to the current route:

```js
links={[{ label: "titles.properties", path: "/backend/records/users/new", entity: "user", ability: "update" }]}
```

`SecondaryNav` uses `link.path` as the React key. Do not add `route` properties — route names are being phased out.

---

## 15. Migration Checklist for a Backend Route

1. Create route file in `app/routes/backend/` following flat-file conventions
2. Move data fetching from container's `useFetch` to route `loader` using `loadEntity` / `loadList`
3. Move auth checks from `Authorize` HOC to `authorize()` in loader (skip if parent layout already checks the same ability — don't duplicate)
4. Component receives data via `loaderData` prop or `useOutletContext()`
5. Replace `useDispatch` / `flush` cleanup with nothing (loaders handle it)
6. For mutations: use route `action` (if form-based) or keep `useApiCallback` + `revalidate()`
7. Export `shouldRevalidate` if the route's data shouldn't refetch on every navigation

**Note on `createClientListLoader`:** Frontend/reader list routes use `createClientListLoader` to fetch client-side after the initial SSR hydration — this avoids full server round-trips on filter/pagination changes, which matters for public pages where responsiveness and SEO are both important (SSR for the first paint, client-side for subsequent interactions). Backend routes don't use it because they're behind authentication, SEO is irrelevant, and always fetching through the server loader keeps things simpler with consistent revalidation behavior.

---

## 16. Replacing the `setter` HOC

The `setter` HOC (`global/components/form/setter`) was deleted but several components still imported it (e.g. `AvatarBuilder`, `KindPicker`, `Upload`). `setter` connected class components to the form context, providing `setOther`, `set`, `value`, and `onChange` props.

### Replacement: `useContext(FormContext)`

For components that used `setter` without a `name` prop (like `AvatarBuilder`), `setter` only provided `setOther`. Replace with direct context access:

```js
import { useContext } from "react";
import { FormContext } from "helpers/contexts";
import { brackets2dots } from "utils/string";

function MyFormComponent() {
  const formContext = useContext(FormContext);
  const getModelValue = formContext?.getModelValue ?? (() => null);
  const setValue = formContext?.actions?.setValue;

  // Equivalent to the old setOther(value, name)
  const setField = (value, name) => {
    if (!setValue) return;
    setValue(brackets2dots(name), value);
  };

  // Read a value (same as getModelValue from render prop)
  const title = getModelValue("attributes[title]");

  // Set a value
  setField("new value", "attributes[someField]");
}
```

For components that used `setter` **with** a `name` prop (standard form inputs), use the `useFormField` hook instead:

```js
import useFormField from "hooks/useFormField";

function MyInput({ name }) {
  const { value, onChange, set, errors } = useFormField(name);
  // ...
}
```

### Key differences

- `setter` called `actions.set(sessionKey, path.$set, value)` — the new `FormContext` exposes `actions.setValue(path, value)` directly (no `$set` suffix, no session key)
- `setter` provided `setOther(value, name, triggersDirty)` — use `setValue(brackets2dots(name), value, triggersDirty)` instead
- Convert class components to function components when replacing `setter`, since it was always used as an HOC

---

## 17. Delete Handler Patterns

Delete handlers use `useConfirmation` + `useApiCallback`. The correct post-delete behavior depends on the route context:

### Pattern A: Routed Drawer (`handle: { drawer: true }`)

Navigation unmounts the drawer component, which cleans up dialog state automatically. No `closeDialog()` or `revalidate()` needed on success — the parent list's loader reruns on navigation.

```js
const handleDestroy = () => {
  confirm({
    heading: t("modals.delete_subject"),
    message: t("modals.confirm_body"),
    callback: async closeDialog => {
      try {
        await destroySubject(subject.id);
        navigate("/backend/settings/subjects");
      } catch {
        closeDialog();
      }
    }
  });
};
```

### Pattern B: Inline List (stays on same page)

The component stays mounted, so call `closeDialog()` to dismiss the confirmation and `revalidate()` to refresh the list.

```js
const handleDestroy = () => {
  confirm({
    heading: t("modals.delete_annotation"),
    message: t("modals.confirm_body"),
    callback: async closeDialog => {
      try {
        await destroyAnnotation(annotation.id);
        closeDialog();
        revalidate();
      } catch {
        closeDialog();
      }
    }
  });
};
```

### Pattern C: Full-Page Entity (navigates to parent list)

Same as routed drawer — navigation unmounts the component. Add a notification before navigating since the user lands on a different page.

```js
const handleDelete = () => {
  confirm({
    heading: t("modals.delete_project"),
    message: t("modals.confirm_body"),
    callback: async closeDialog => {
      try {
        await destroy(project.id);
        addNotification({
          level: 0,
          id: `PROJECT_DESTROYED_${project.id}`,
          heading: t("notifications.project_delete"),
          body: t("notifications.delete_entity_body", {
            title: project?.attributes?.titlePlaintext
          }),
          expiration: 5000
        });
        navigate("/backend/projects/all");
      } catch {
        closeDialog();
        addNotification({
          level: 2,
          id: `PROJECT_DESTROY_FAILED_${project.id}`,
          heading: t("notifications.project_delete_fail"),
          expiration: 5000
        });
      }
    }
  });
};
```

### Rules

| Context | Success | Error |
|---------|---------|-------|
| Routed drawer | `navigate()` only | `closeDialog()` only |
| Inline list | `closeDialog()` + `revalidate()` | `closeDialog()` only |
| Full-page entity | `navigate()` only | `closeDialog()` only |

- **Notifications before navigation:** `addNotification()` persists across navigation, so call it before `navigate()`
- **Error paths never navigate:** The user stays on the current page with the dialog dismissed and an error notification (if applicable)
- **No `revalidate()` before `navigate()`:** The target route runs its own loaders
- **No `closeDialog()` before `navigate()`:** Navigation unmounts the component, cleaning up dialog state via React's `useState` lifecycle

---

## 18. SSR-Incompatible Components

Some third-party libraries render different HTML on server vs. client, causing React hydration mismatches. These must be guarded so they only render after mount.

### Known libraries

- **`react-datepicker` (`ReactDatePicker`)** — Renders a default `<input>` on the server (when `customInput` is undefined) but a custom `<div>`-based input on the client. This causes "Expected server HTML to contain a matching `<div>` in `<div>`" errors.
- **`react-beautiful-dnd`** — Relies on browser APIs and produces mismatched markup during SSR.

### Fix: skip rendering until after mount

```js
import { useState, useEffect } from "react";

function MyComponent() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return <ReactDatePicker /* ... */ />;
}
```

This ensures the server and initial client render both produce `null` (no mismatch), then the component renders client-side after hydration.
