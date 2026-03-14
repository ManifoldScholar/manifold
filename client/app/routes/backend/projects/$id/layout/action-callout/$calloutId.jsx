import { useFetcher, useOutletContext } from "react-router";
import { actionCalloutsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import ActionCalloutForm from "backend/containers/action-callout/Form";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => actionCalloutsAPI.show(params.calloutId),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      actionCalloutsAPI.update(params.calloutId, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ActionCalloutEdit({ loaderData: actionCallout }) {
  const { calloutable, refreshActionCallouts, closeUrl } =
    useOutletContext() || {};
  const fetcher = useFetcher();

  if (!actionCallout) return null;

  return (
    <ActionCalloutForm
      fetcher={fetcher}
      refreshActionCallouts={refreshActionCallouts}
      actionCallout={actionCallout}
      closeUrl={closeUrl}
      calloutable={calloutable}
    />
  );
}
