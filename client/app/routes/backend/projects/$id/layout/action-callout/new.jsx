import { useState } from "react";
import { redirect, useLocation, useOutletContext, useFetcher } from "react-router";
import { actionCalloutsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import ActionCalloutForm from "backend/containers/action-callout/Form";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      actionCalloutsAPI.createForProject(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/projects/${params.id}/layout`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ActionCalloutNew() {
  const { calloutable, refreshActionCallouts, closeUrl } =
    useOutletContext() || {};
  const location = useLocation();
  const fetcher = useFetcher();

  const [attributes] = useState(() => {
    const defaultAttributes = {
      kind: "link",
      location: "left",
      position: "top",
      button: true
    };

    if (location.state?.actionCallout) {
      return Object.assign(
        defaultAttributes,
        location.state.actionCallout.attributes
      );
    }

    return defaultAttributes;
  });

  const actionCallout = { attributes };

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
