import { createContext as createRouterContext } from "react-router";
import { createContext as createReactContext } from "react";
import { initialReaderState } from "./readerReducer";

// Router context - used in middleware and loaders to pass data through request lifecycle
export const routerContext = createRouterContext();

// React context - provides settings, auth, pages, and utilities to components
// Individual hooks (useSettings, useAuthentication) read from this
export const AppContext = createReactContext({
  settings: null,
  auth: null,
  pages: null
});

// Frontend context - provides frontend-specific data to frontend routes only
// Not available in backend/reader routes
export const FrontendContext = createReactContext({
  subjects: [],
  journalSubjects: []
});

// Reader context - provides reader-specific data to reader routes
export const ReaderContext = createReactContext({
  ...initialReaderState,
  dispatch: () => {}
});
