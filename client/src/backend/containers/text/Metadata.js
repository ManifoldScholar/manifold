import { useOutletContext } from "react-router-dom";
import Metadata from "backend/components/metadata";
import { textsAPI } from "api";

export default function TextMetadataContainer() {
  const { text } = useOutletContext() || {};

  if (!text) return null;

  return (
    <Metadata.Form
      model={text}
      name="backend-project-general"
      update={textsAPI.update}
      create={textsAPI.create}
      className="form-secondary"
    />
  );
}

TextMetadataContainer.displayName = "Text.Metadata";
