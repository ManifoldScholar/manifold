import { useOutletContext, useFetcher } from "react-router";
import { stylesheetsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import formAction from "lib/react-router/helpers/formAction";
import StylesheetForm from "components/backend/stylesheet/Form";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => stylesheetsAPI.show(params.stylesheetId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    stylesheetsAPI.update(params.stylesheetId, data)
});

export default function TextStylesheetEdit({ loaderData: stylesheet }) {
  const text = useOutletContext();
  const fetcher = useFetcher();

  return (
    <StylesheetForm
      stylesheet={stylesheet}
      textId={text.id}
      fetcher={fetcher}
      cancelUrl={`/backend/projects/text/${text.id}/styles`}
    />
  );
}
