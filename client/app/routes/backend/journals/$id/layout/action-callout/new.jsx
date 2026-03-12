import { useMemo } from "react";
import {
  redirect,
  useLocation,
  useOutletContext,
  useFetcher
} from "react-router";
import { actionCalloutsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import ActionCalloutForm from "backend/containers/action-callout/Form";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      actionCalloutsAPI.createForJournal(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/journals/${params.id}/layout`);
  } catch (error) {
    return handleActionError(error);
  }
}

const DEFAULT_ATTRIBUTES = {
  kind: "link",
  location: "left",
  position: "top",
  button: true
};

export default function ActionCalloutNew() {
  const journal = useOutletContext();
  const location = useLocation();
  const fetcher = useFetcher();

  const actionCallout = useMemo(
    () => ({
      attributes: {
        ...DEFAULT_ATTRIBUTES,
        ...location.state?.actionCallout?.attributes
      }
    }),
    [location.state?.actionCallout?.attributes]
  );

  return (
    <ActionCalloutForm
      fetcher={fetcher}
      actionCallout={actionCallout}
      closeUrl={`/backend/journals/${journal?.id}/layout`}
      calloutable={journal}
    />
  );
}
