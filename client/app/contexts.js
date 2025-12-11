import { createContext as createRouterContext } from "react-router";
import { createContext as createReactContext } from "react";

// Router context - used in middleware and loaders to pass data through request lifecycle
export const routerContext = createRouterContext();

// React context - provides settings, auth, pages, and utilities to components
// Individual hooks (useSettings, useCurrentUser, usePages, etc.) read from this
export const AppContext = createReactContext({
  settings: null,
  auth: null,
  pages: null,
  frontendMode: null,
  revalidate: () => {
    console.warn("AppContext not yet initialized");
  }
});
