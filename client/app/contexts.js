import { createContext as createRouterContext } from "react-router";
import { createContext as createReactContext } from "react";

// Router context - used in middleware and loaders to pass data through request lifecycle
export const routerContext = createRouterContext();

// Entity contexts - used to pass entity from parent to child loaders
export const readingGroupContext = createRouterContext();
export const projectContext = createRouterContext();

// React context - provides settings, auth, pages, and utilities to components
// Individual hooks (useSettings, useCurrentUser, usePages, etc.) read from this
export const AppContext = createReactContext({
  settings: null,
  auth: null,
  pages: null,
  revalidate: () => {
    console.warn("AppContext not yet initialized");
  }
});

// Frontend context - provides frontend-specific data to frontend routes only
// Not available in backend/reader routes
export const FrontendContext = createReactContext({
  subjects: [],
  journalSubjects: [],
  frontendMode: {}
});
