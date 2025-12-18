import { useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useSearchContext } from "hooks/useSearch/context";
import Query from "../query";

export default function SearchMenuBody({
  afterSubmit = () => {},
  searchType,
  facets,
  scopes,
  initialState,
  description,
  projectId,
  textId,
  sectionId,
  className
}) {
  const { sectionId: sectionIdParam, textId: textIdParam } = useParams();

  const { searchQueryState, setQueryState } = useSearchContext();

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

  const handleSetQueryState = useCallback(
    state => {
      afterSubmit();
      setQueryState(state, searchPath);
    },
    [searchPath, afterSubmit, setQueryState]
  );

  return (
    <div className={className}>
      <Query.Form
        projectId={projectId}
        sectionId={sectionId}
        textId={textId}
        facets={facets}
        scopes={scopes}
        searchType={searchType}
        initialState={initialState}
        searchQueryState={searchQueryState}
        setQueryState={handleSetQueryState}
        description={description}
        searchOnScopeChange={false}
        autoFocus
      />
    </div>
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
