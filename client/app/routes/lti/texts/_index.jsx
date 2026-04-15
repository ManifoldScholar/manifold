import { Link, useSearchParams } from "react-router";
import { textsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
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

function Pager({ meta }) {
  const [searchParams] = useSearchParams();
  const pagination = meta?.pagination ?? {};
  const { currentPage, totalPages, prevPage, nextPage } = pagination;
  if (!totalPages || totalPages < 2) return null;

  const linkFor = page => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    return `?${params.toString()}`;
  };

  return (
    <Styled.Pager aria-label="Pagination">
      {prevPage ? (
        <Link to={linkFor(prevPage)}>← Previous</Link>
      ) : (
        <span className="pager-disabled">← Previous</span>
      )}
      <span className="pager-current">
        Page {currentPage} of {totalPages}
      </span>
      {nextPage ? (
        <Link to={linkFor(nextPage)}>Next →</Link>
      ) : (
        <span className="pager-disabled">Next →</span>
      )}
    </Styled.Pager>
  );
}

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
          <Styled.SelectableList>
            {texts.map(text => {
            const { titlePlaintext, subtitle } = text.attributes ?? {};
            const item = {
              type: "text",
              id: text.id,
              title: titlePlaintext
            };
            const selected = has(item);
            return (
              <Styled.SelectableItem key={text.id} $selected={selected}>
                <Link to={`/lti/texts/${text.id}`}>
                  {titlePlaintext}
                  {subtitle ? <Styled.ItemSub>{subtitle}</Styled.ItemSub> : null}
                </Link>
                <Styled.AddButton
                  type="button"
                  onClick={() => (selected ? remove(item) : add(item))}
                  $selected={selected}
                  aria-label={
                    selected
                      ? `Remove ${titlePlaintext}`
                      : `Add ${titlePlaintext}`
                  }
                >
                  {selected ? "✓" : "+"}
                </Styled.AddButton>
              </Styled.SelectableItem>
            );
          })}
          </Styled.SelectableList>
          <Pager meta={meta} />
        </>
      )}
    </>
  );
}
