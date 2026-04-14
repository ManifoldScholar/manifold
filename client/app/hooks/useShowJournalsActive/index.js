import { useMatches } from "react-router";

export default function useShowJournalsActive() {
  const matches = useMatches();
  const routeId = "routes/frontend/_frontend.projects.$id";

  const route = matches.find(m => m.id === routeId);

  if (!route) return false;

  const project = route.loaderData;

  return project?.attributes.isJournalIssue ?? false;
}
