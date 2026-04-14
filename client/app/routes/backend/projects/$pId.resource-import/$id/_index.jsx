import { useFetcher, useOutletContext } from "react-router";
import { resourceImportsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import ImportForm from "components/backend/resource-import/ImportForm";

export const action = formAction({
  mutation: ({ data, params }) =>
    resourceImportsAPI.update(params.pId, params.id, data),
  redirectTo: ({ params }) =>
    `/backend/projects/${params.pId}/resource-import/${params.id}/map`
});

export default function ResourceImportEdit() {
  const resourceImport = useOutletContext();
  const fetcher = useFetcher();

  return <ImportForm resourceImport={resourceImport} fetcher={fetcher} />;
}
