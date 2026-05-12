import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router";
import { serializeQueryToUrl } from "hooks/useSearch/helpers";
import Query from "../query";
import * as Styled from "./styles";

export default function SearchMenuBody({
  afterSubmit = () => {},
  searchType,
  facets,
  scopes,
  initialState,
  projectId,
  textId,
  sectionId,
  className,
  description
}) {
  const { sectionId: sectionIdParam, textId: textIdParam } = useParams();
  const navigate = useNavigate();

  let searchPath;
  if (searchType === "reader") {
    const finalTextId = textId || textIdParam;
    const finalSectionId = sectionId || sectionIdParam;
    searchPath = `/read/${finalTextId}/section/${finalSectionId}/search`;
  } else if (searchType === "project") {
    searchPath = `/projects/${projectId}/search`;
  } else {
    searchPath = "/search";
  }

  const [query, setQuery] = useState(initialState ?? {});

  const sortedFacets = arr =>
    (arr ?? [])
      .slice()
      .sort()
      .join(",");

  const handleQueryChange = useCallback(
    next => {
      const facetsChanged =
        sortedFacets(query.facets) !== sortedFacets(next.facets);
      setQuery(next);
      if (facetsChanged) {
        afterSubmit();
        navigate(
          { pathname: searchPath, search: serializeQueryToUrl(next) },
          { replace: true }
        );
      }
    },
    [query.facets, afterSubmit, searchPath, navigate]
  );

  const handleSubmit = useCallback(
    event => {
      if (event?.preventDefault) event.preventDefault();
      afterSubmit();
      navigate(
        { pathname: searchPath, search: serializeQueryToUrl(query) },
        { replace: true }
      );
    },
    [query, afterSubmit, searchPath, navigate]
  );

  return (
    <Styled.Wrapper className={className}>
      <Query.ControlledForm
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={handleSubmit}
        facets={facets}
        scopes={scopes}
        autoFocus
        className="search-query"
      />
      {description && (
        <div className="search-query__footer">
          <div className="search-query__description">{description}</div>
        </div>
      )}
    </Styled.Wrapper>
  );
}

SearchMenuBody.displayName = "Search.Menu.Body";

SearchMenuBody.propTypes = {
  afterSubmit: PropTypes.func,
  searchType: PropTypes.string.isRequired,
  facets: PropTypes.array,
  scopes: PropTypes.array,
  initialState: PropTypes.object,
  description: PropTypes.string,
  projectId: PropTypes.string,
  textId: PropTypes.string,
  sectionId: PropTypes.string,
  className: PropTypes.string
};
