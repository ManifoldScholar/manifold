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

// Notification context - separate from AppContext to avoid re-renders
// from frequent notification state changes
export const NotificationContext = createReactContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  removeNotifications: () => {}
});

export { default as FormContext } from "./FormContext";
export { default as ManifoldAnalyticsContext } from "./ManifoldAnalyticsContext";
export { default as LanguageContext } from "./LanguageContext";
export { default as TableHeaderContext } from "./TableHeaderContext";
export { default as BackLinkContext } from "./BackLinkContext";
export { default as DrawerContext } from "./DrawerContext";
export { default as CollapseContext } from "./CollapseContext";
export {
  default as SelectionContext,
  SelectionProvider,
  useSelection
} from "./SelectionContext";
