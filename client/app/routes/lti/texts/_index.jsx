import { useTranslation } from "react-i18next";
import { textsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import LtiRow from "components/lti/Row";
import LtiPager from "components/lti/Pager";
import * as Styled from "./styles";
import { useSelection } from "contexts";

export const handle = {
  breadcrumb: (match, location, t) => ({
    label: t("lti.breadcrumb.texts"),
    to: "/lti/texts"
  })
};

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: textsAPI.index
  });
};

export default function LtiStyledsList({ loaderData: { data: texts, meta } }) {
  const { t } = useTranslation();
  const { add, remove, has } = useSelection();

  return (
    <>
      <h1>{t("lti.lists.texts_heading")}</h1>
      {texts.length === 0 ? (
        <Styled.Empty>{t("lti.lists.texts_empty")}</Styled.Empty>
      ) : (
        <>
          <Styled.List>
            {texts.map(text => {
              const { titlePlaintext } = text.attributes;
              const item = {
                type: "text",
                id: text.id,
                title: titlePlaintext
              };
              const selected = has(item);
              return (
                <LtiRow
                  key={text.id}
                  entity={text}
                  kind="text"
                  to={`/lti/texts/${text.id}`}
                  selected={selected}
                  onToggle={() => (selected ? remove(item) : add(item))}
                />
              );
            })}
          </Styled.List>
          <Styled.PagerWrap>
            <LtiPager meta={meta} />
          </Styled.PagerWrap>
        </>
      )}
    </>
  );
}
