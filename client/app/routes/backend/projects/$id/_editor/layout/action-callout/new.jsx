import { useMemo } from "react";
import { useLocation, useOutletContext, useFetcher } from "react-router";
import { actionCalloutsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import ActionCalloutForm from "components/backend/action-callout/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    actionCalloutsAPI.createForProject(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/layout`
});

const DEFAULT_ATTRIBUTES = {
  kind: "link",
  location: "left",
  position: "top",
  button: true
};

export default function ActionCalloutNew() {
  const { project } = useOutletContext() ?? {};
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
      closeUrl={`/backend/projects/${project?.id}/layout`}
      calloutable={project}
    />
  );
}
