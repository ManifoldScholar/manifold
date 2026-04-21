import { useTranslation } from "react-i18next";
import { textsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import TocNode from "components/lti/TocNode";
import * as Styled from "./styles";

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
  const { t } = useTranslation();
  const { titlePlaintext, subtitle, toc } = text.attributes;

  return (
    <>
      <h1>{titlePlaintext}</h1>
      {subtitle ? <Styled.Subtitle>{subtitle}</Styled.Subtitle> : null}

      <h2>{t("lti.text_detail.toc_heading")}</h2>
      {toc?.length ? (
        <Styled.Toc>
          <Styled.TocList>
            {toc.map(node => (
              <TocNode
                key={node.id}
                node={node}
                depth={0}
                textTitle={titlePlaintext}
              />
            ))}
          </Styled.TocList>
        </Styled.Toc>
      ) : (
        <Styled.TocEmpty>{t("lti.text_detail.toc_empty")}</Styled.TocEmpty>
      )}
    </>
  );
}
