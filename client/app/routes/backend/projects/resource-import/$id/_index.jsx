import { useFetcher, redirect } from "react-router";
import { resourceImportsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import ImportForm from "backend/components/resource-import/ImportForm";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => resourceImportsAPI.show(params.id, params.importId),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();
  data.attributes.state = "parsing";
  data.attributes.storageType = "google_drive";
  try {
    const result = await queryApi(
      resourceImportsAPI.update(params.id, params.importId, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(
      `/backend/projects/${params.id}/resources/import/${params.importId}/map`
    );
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceImportEdit({ loaderData: resourceImport }) {
  const fetcher = useFetcher();

  return <ImportForm resourceImport={resourceImport} fetcher={fetcher} />;
}
