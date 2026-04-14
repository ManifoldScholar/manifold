import { useFetcher, useOutletContext } from "react-router";
import Metadata from "components/backend/metadata";
import { textsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => textsAPI.update(params.id, data)
});

export default function TextMetadata() {
  const fetcher = useFetcher();
  const text = useOutletContext();

  return (
    <Metadata.Form model={text} fetcher={fetcher} className="form-secondary" />
  );
}
