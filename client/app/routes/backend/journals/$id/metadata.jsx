import { useFetcher, useOutletContext } from "react-router";
import Metadata from "backend/components/metadata";
import { journalsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

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
