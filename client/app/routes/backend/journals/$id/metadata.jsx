import { useFetcher, useOutletContext } from "react-router";
import Metadata from "backend/components/metadata";
import { journalsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(journalsAPI.update(params.id, data), context);
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

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
