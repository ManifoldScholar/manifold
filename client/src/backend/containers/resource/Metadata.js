import { useOutletContext } from "react-router-dom";
import Metadata from "backend/components/metadata";
import { resourcesAPI } from "api";

function ResourceMetadataContainer() {
  const { resource } = useOutletContext();

  return (
    <Metadata.Form
      model={resource}
      name="backend-resource-metadata"
      update={resourcesAPI.update}
      create={resourcesAPI.create}
      className="form-secondary"
    />
  );
}

ResourceMetadataContainer.displayName = "Resource.Metadata";

export default ResourceMetadataContainer;
