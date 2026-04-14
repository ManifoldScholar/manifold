import { useRef, useMemo } from "react";
import { useMatches, useLocation } from "react-router";
import { useSettings } from "hooks";
import computeFrontendMode from "./computeFrontendMode";

const PROJECT_ROUTE_ID = "routes/frontend/_frontend.projects.$id";

export default function useFrontendMode() {
  const matches = useMatches();
  const location = useLocation();
  const settings = useSettings();

  const projectMatch = matches.find(m => m.id === PROJECT_ROUTE_ID);
  const project = projectMatch?.data ?? null;

  const frontendMeta = [...matches].reverse().find(m => m.handle?.frontendMode);
  const isProjectHomepage =
    frontendMeta?.handle?.frontendMode?.isProjectHomepage ?? false;

  const searchParams = new URLSearchParams(location.search);

  // Track the previous project ID and standalone decision so that
  // sub-navigation within the same project preserves standalone mode
  // even after the ?mode=standalone param is dropped from the URL.
  const prevRef = useRef({ projectId: null, wasStandalone: false });

  const projectChanged = project?.id !== prevRef.current.projectId;
  const prevStandalone = !projectChanged && prevRef.current.wasStandalone;

  const frontendMode = useMemo(
    () =>
      computeFrontendMode({
        project,
        settings,
        searchParams,
        prevStandalone,
        isProjectHomepage
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, settings, location.search, prevStandalone, isProjectHomepage]
  );

  prevRef.current = {
    projectId: project?.id ?? null,
    wasStandalone: frontendMode.isStandalone
  };

  return frontendMode;
}
