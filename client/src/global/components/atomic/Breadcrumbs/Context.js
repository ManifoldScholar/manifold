import React, { createContext, useState, useContext, useEffect } from "react";

export const BreadcrumbsContext = createContext();

export default function BreadcrumbsProvider({ children }) {
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export function RegisterBreadcrumbs({ breadcrumbs }) {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => setBreadcrumbs(null);
  }, [breadcrumbs, setBreadcrumbs]);
  return null;
}
