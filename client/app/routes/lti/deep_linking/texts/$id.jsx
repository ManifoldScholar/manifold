import { textsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import DetailLayout from "components/lti/Detail";

export const loader = ({ params, context, url }) =>
  loadEntity({ context, fetchFn: () => textsAPI.show(params.id), url });

export default function LtiTextDetailRoute({ loaderData: text }) {
  const toc = text.attributes?.toc ?? [];

  const categories = [
    {
      type: "textSection",
      collection: toc,
      textTitle: text.attributes?.titlePlaintext
    }
  ];

  return <DetailLayout type="text" entity={text} categories={categories} />;
}
