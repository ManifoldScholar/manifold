import { textsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import Toc from "components/lti/Toc";
import EntityHeader from "components/lti/EntityHeader";

export const handle = {
  breadcrumb: ({ loaderData, params }, location, t) => {
    const title = loaderData?.attributes?.titlePlaintext;
    const trail = location?.state?.trail;
    const base =
      Array.isArray(trail) && trail.length > 0
        ? trail
        : [{ label: t("lti.breadcrumb.texts"), to: "/lti/texts" }];
    return [
      ...base,
      title ? { label: title, to: `/lti/texts/${params.id}` } : null
    ].filter(Boolean);
  }
};

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => textsAPI.show(params.id),
    request
  });
};

export default function LtiStyledDetail({ loaderData: text }) {
  const { titlePlaintext, subtitle, toc } = text.attributes;

  return (
    <>
      <EntityHeader
        id={text.id}
        type="text"
        title={titlePlaintext}
        subtitle={subtitle}
      />
      <Toc toc={toc} textTitle={titlePlaintext} />
    </>
  );
}
