import { useFetcher, useOutletContext } from "react-router";
import Metadata from "components/backend/metadata";
import { projectsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => projectsAPI.update(params.id, data)
});

export default function ProjectMetadata() {
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <Metadata.Form
      model={project}
      fetcher={fetcher}
      className="form-secondary"
    />
  );
}
