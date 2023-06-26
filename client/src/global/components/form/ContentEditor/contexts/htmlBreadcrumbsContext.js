import { createContext, useContext } from "react";

export const HtmlBreadcrumbsContext = createContext([]);

export const useHtmlBreadcrumbs = () => {
  const context = useContext(HtmlBreadcrumbsContext);

  return context;
};
