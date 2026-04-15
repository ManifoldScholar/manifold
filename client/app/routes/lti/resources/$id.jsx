import { resourcesAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import * as Styled from "../styles";

export const handle = {
  breadcrumb: ({ loaderData, params }, location) => {
    const title = loaderData?.attributes?.titlePlaintext;
    const trail = location?.state?.trail;
    const base =
      Array.isArray(trail) && trail.length > 0
        ? trail
        : [{ label: "Resources", to: "/lti/resources" }];
    return [
      ...base,
      title ? { label: title, to: `/lti/resources/${params.id}` } : null
    ].filter(Boolean);
  }
};

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => resourcesAPI.show(params.id),
    request
  });
};

export default function LtiResourceDetail({ loaderData: resource }) {
  const {
    titlePlaintext,
    kind,
    subKind,
    descriptionPlaintext,
    captionPlaintext
  } = resource.attributes ?? {};

  return (
    <>
      <h1>{titlePlaintext}</h1>
      <Styled.Meta>
        {kind}
        {subKind ? ` · ${subKind}` : ""}
      </Styled.Meta>
      {descriptionPlaintext ? <p>{descriptionPlaintext}</p> : null}
      {captionPlaintext ? <p>{captionPlaintext}</p> : null}
    </>
  );
}
