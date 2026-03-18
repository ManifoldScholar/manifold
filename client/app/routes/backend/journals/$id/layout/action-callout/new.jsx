import { useMemo } from "react";
import { useLocation, useOutletContext, useFetcher } from "react-router";
import { actionCalloutsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import ActionCalloutForm from "backend/containers/action-callout/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    actionCalloutsAPI.createForJournal(params.id, data),
  redirectTo: ({ params }) => `/backend/journals/${params.id}/layout`
});

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
