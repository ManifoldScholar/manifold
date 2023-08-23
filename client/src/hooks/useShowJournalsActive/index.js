import { useLocation } from "react-router";
import useFromStore from "../useFromStore";

export default function useShowJournalsActive() {
  const { pathname } = useLocation();

  let id;
  let slug;
  if (
    pathname.includes("projects") &&
    !pathname.includes("project-collections")
  ) {
    const idRegex = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g;
    const parts = pathname.split("/");
    id = parts.find(p => p.match(idRegex));

    if (!id) {
      slug = parts
        .filter(Boolean)
        .find(
          p =>
            !(p === "all" || p.startsWith("all?")) &&
            p !== "backend" &&
            p !== "projects"
        );
    }
  }

  const projects = useFromStore(`entityStore.entities.projects`);

  if (!id) {
    id = projects
      ? Object.keys(projects).find(p => projects[p].attributes.slug === slug)
      : null;
  }

  if (!id && !slug) return false;

  // Prevent flash where projects is active on first render by returning undefined rather than false.
  return id && projects ? projects[id]?.attributes.isJournalIssue : undefined;
}
