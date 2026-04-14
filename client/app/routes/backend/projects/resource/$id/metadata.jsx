import { useFetcher, useOutletContext } from "react-router";
import Metadata from "components/backend/metadata";
import { resourcesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => resourcesAPI.update(params.id, data)
});

export default function ResourceMetadata() {
  const fetcher = useFetcher();
  const resource = useOutletContext();

  return (
    <Metadata.Form
      model={resource}
      fetcher={fetcher}
      className="form-secondary"
    />
  );
}
