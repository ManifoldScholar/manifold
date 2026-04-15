import { textsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import LtiRow from "components/lti/Row";
import LtiPager from "components/lti/Pager";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

export const handle = {
  breadcrumb: () => ({ label: "Texts", to: "/lti/texts" })
};

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: textsAPI.index
  });
};

export default function LtiTextsList({ loaderData }) {
  const texts = loaderData?.data ?? [];
  const meta = loaderData?.meta;
  const { add, remove, has } = useSelection();

  return (
    <>
      <h1>Texts</h1>
      {texts.length === 0 ? (
        <Styled.Empty>No texts.</Styled.Empty>
      ) : (
        <>
          <Styled.List>
            {texts.map(text => {
              const { titlePlaintext } = text.attributes ?? {};
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
