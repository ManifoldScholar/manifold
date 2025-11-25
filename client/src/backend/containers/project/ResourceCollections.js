import { useOutletContext } from "react-router-dom";
import Resource from "./resource";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export default function ProjectResourceCollectionsContainer() {
  const { project } = useOutletContext() || {};

  if (!project) return null;

  return (
    <Authorize
      entity={project}
      ability="manageResourceCollections"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <section>
        <Resource.ResourceCollectionsList project={project} />
      </section>
    </Authorize>
  );
}

ProjectResourceCollectionsContainer.displayName =
  "Project.ResourceCollectionsContainer";
