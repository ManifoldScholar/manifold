import { useFetcher, useOutletContext } from "react-router";
import { actionCalloutsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import ActionCalloutForm from "components/backend/action-callout/Form";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => actionCalloutsAPI.show(params.calloutId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    actionCalloutsAPI.update(params.calloutId, data),
  redirectTo: ({ params }) => `/backend/journals/${params.id}/layout`
});

export default function ActionCalloutEdit({ loaderData: actionCallout }) {
  const journal = useOutletContext();
  const fetcher = useFetcher();

  return (
    <ActionCalloutForm
      fetcher={fetcher}
      actionCallout={actionCallout}
      closeUrl={`/backend/journals/${journal?.id}/layout`}
      calloutable={journal}
    />
  );
}
