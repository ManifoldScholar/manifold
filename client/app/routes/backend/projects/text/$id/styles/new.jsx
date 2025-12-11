import { useOutletContext, useFetcher } from "react-router";
import { stylesheetsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import StylesheetForm from "components/backend/stylesheet/Form";

const DEFAULT_STYLESHEET = {
  attributes: {},
  relationships: { textSections: [] }
};

export const action = formAction({
  mutation: ({ data, params }) => stylesheetsAPI.create(params.id, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/text/${params.id}/styles/${result.data.id}`
});

export default function TextStylesheetNew() {
  const text = useOutletContext();
  const fetcher = useFetcher();

  return (
    <StylesheetForm
      stylesheet={DEFAULT_STYLESHEET}
      textId={text.id}
      fetcher={fetcher}
      cancelUrl={`/backend/projects/text/${text.id}/styles`}
    />
  );
}
