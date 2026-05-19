import { textsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import DetailLayout from "components/lti/Detail";

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => textsAPI.show(params.id),
    request
  });
};

export default function LtiTextDetail({ loaderData: text }) {
  const toc = text.attributes.toc ?? [];
  const categories = [
    {
      type: "textSection",
      collection: toc,
      textTitle: text.attributes.titlePlaintext
    }
  ];

  return <DetailLayout type="text" entity={text} categories={categories} />;
}
