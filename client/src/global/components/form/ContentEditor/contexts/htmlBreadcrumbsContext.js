import { createContext } from "react";

// This is here to prevent a circular dependency between Wrapper/Editor/Element
export const HtmlBreadcrumbsContext = createContext([]);
