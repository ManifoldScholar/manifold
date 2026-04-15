import { Link } from "react-router";
import { resourcesAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

export const handle = {
  breadcrumb: () => ({ label: "Resources", to: "/lti/resources" })
};

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: resourcesAPI.index
  });
};

export default function LtiResourcesList({ loaderData }) {
  const resources = loaderData?.data ?? [];
  const { add, remove, has } = useSelection();

  return (
    <>
      <h1>Resources</h1>
      {resources.length === 0 ? (
        <Styled.Empty>No resources.</Styled.Empty>
      ) : (
        <Styled.SelectableList>
          {resources.map(resource => {
            const { titlePlaintext, kind } = resource.attributes ?? {};
            const item = {
              type: "resource",
              id: resource.id,
              title: titlePlaintext
            };
            const selected = has(item);
            return (
              <Styled.SelectableItem key={resource.id} $selected={selected}>
                <Link to={`/lti/resources/${resource.id}`}>
                  {titlePlaintext}
                  {kind ? <Styled.ItemSub>{kind}</Styled.ItemSub> : null}
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
      )}
    </>
  );
}
