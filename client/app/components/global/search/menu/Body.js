import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router";
import { serializeQueryToUrl } from "hooks/useSearch/helpers";
import SearchQuery from "../query";
import * as Styled from "./styles";

export default function SearchMenuBody({
  afterSubmit,
  searchType,
  scopes,
  initialState,
  projectId,
  textId,
  sectionId,
  className,
  description,
  visible
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

  // Allow callers to pass initialState as plain, unmemoized object
  const initialStateRef = useRef(initialState ?? {});
  const [query, setQuery] = useState(initialStateRef.current);

  useEffect(() => {
    if (!visible || !query?.keyword) return;
    if (afterSubmit) afterSubmit();
    navigate(
      { pathname: searchPath, search: serializeQueryToUrl(query) },
      { replace: true }
    );
  }, [query, afterSubmit, searchPath, navigate, visible]);

  useEffect(() => {
    if (!visible) setQuery(initialStateRef.current);
  }, [visible]);

  return (
    <Styled.Wrapper className={className}>
      <SearchQuery.ControlledProvider query={query} setQuery={setQuery}>
        <SearchQuery.Form scopes={scopes} autoFocus className="search-query" />
      </SearchQuery.ControlledProvider>
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
  scopes: PropTypes.array,
  initialState: PropTypes.object,
  description: PropTypes.string,
  projectId: PropTypes.string,
  textId: PropTypes.string,
  sectionId: PropTypes.string,
  className: PropTypes.string
};
