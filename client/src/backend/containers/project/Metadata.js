import { useOutletContext } from "react-router-dom";
import Metadata from "backend/components/metadata";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export default function ProjectMetadataContainer() {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;

  if (!project) return null;

  return (
    <Authorize
      entity={project}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <Metadata.Form
        model={project}
        name="backend-project-general"
        update={projectsAPI.update}
        create={projectsAPI.create}
        className="form-secondary"
      />
    </Authorize>
  );
}

ProjectMetadataContainer.displayName = "Project.Metadata";
