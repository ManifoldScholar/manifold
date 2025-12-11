import { useFetcher, useOutletContext } from "react-router";
import Metadata from "components/backend/metadata";
import { journalsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => journalsAPI.update(params.id, data)
});

export default function JournalMetadata() {
  const journal = useOutletContext();
  const fetcher = useFetcher();

  return (
    <Metadata.Form
      model={journal}
      fetcher={fetcher}
      className="form-secondary"
    />
  );
}
