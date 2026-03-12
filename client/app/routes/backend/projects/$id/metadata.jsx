import { useFetcher, useOutletContext } from "react-router";
import Metadata from "backend/components/metadata";
import { projectsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(projectsAPI.update(params.id, data), context);
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

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
