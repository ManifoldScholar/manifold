import { useOutletContext } from "react-router-dom";
import Resource from "./resource";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export default function ProjectResourcesContainer() {
  const { project } = useOutletContext() || {};

  if (!project) return null;

  return (
    <Authorize
      entity={project}
      ability={"manageResources"}
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <section>
        <Resource.ResourcesList project={project} />
      </section>
    </Authorize>
  );
}

ProjectResourcesContainer.displayName = "Project.ResourcesContainer";
