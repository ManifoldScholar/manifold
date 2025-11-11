import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import Query from "../query";
import lh from "helpers/linkHandler";

export default function SearchMenuBody({
  toggleVisibility = () => {},
  searchType,
  onSubmit,
  facets,
  scopes,
  initialState,
  description,
  projectId,
  textId,
  sectionId,
  className
}) {
  const navigate = useNavigate();
  const { sectionId: sectionIdParam, textId: textIdParam } = useParams();
  const [queryState, setQueryState] = useState({});

  const doFrontendSearch = useCallback(() => {
    toggleVisibility();
    setTimeout(() => {
      const path = lh.link("frontendSearch");
      navigate(path, {
        state: {
          searchQueryState: queryState,
          noScroll: true,
          fromMenu: true
        }
      });
    }, 250);
  }, [toggleVisibility, navigate, queryState]);

  const doProjectSearch = useCallback(() => {
    toggleVisibility();
    setTimeout(() => {
      const path = lh.link("frontendProjectSearch", projectId);
      navigate(path, {
        state: {
          searchQueryState: queryState,
          noScroll: true,
          fromMenu: true
        }
      });
    }, 250);
  }, [toggleVisibility, navigate, projectId, queryState]);

  const doReaderSearch = useCallback(() => {
    toggleVisibility();
    setTimeout(() => {
      const finalSectionId = sectionId || sectionIdParam;
      const finalTextId = textId || textIdParam;
      const path = lh.link(
        "readerSectionSearchResults",
        finalTextId,
        finalSectionId
      );
      navigate(path, {
        state: {
          searchQueryState: queryState,
          noScroll: true,
          fromMenu: true
        }
      });
    }, 250);
  }, [
    toggleVisibility,
    navigate,
    sectionId,
    sectionIdParam,
    textId,
    textIdParam,
    queryState
  ]);

  const handleSetQueryState = useCallback(
    queryParams => {
      setQueryState(queryParams);
      // Trigger search after state update
      setTimeout(() => {
        if (searchType === "reader") doReaderSearch();
        else if (searchType === "project") doProjectSearch();
        else if (onSubmit) onSubmit();
        else doFrontendSearch();
      }, 0);
    },
    [searchType, onSubmit, doReaderSearch, doProjectSearch, doFrontendSearch]
  );

  return (
    <div className={className}>
      <Query.Form
        projectId={projectId}
        sectionId={sectionId}
        textId={textId}
        facets={facets}
        initialState={initialState}
        scopes={scopes}
        searchType={searchType}
        description={description}
        searchOnScopeChange={false}
        setQueryState={handleSetQueryState}
        autoFocus
      />
    </div>
  );
}

SearchMenuBody.displayName = "Search.Menu.Body";

SearchMenuBody.propTypes = {
  toggleVisibility: PropTypes.func,
  searchType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  facets: PropTypes.array,
  scopes: PropTypes.array,
  initialState: PropTypes.object,
  description: PropTypes.string,
  projectId: PropTypes.string,
  textId: PropTypes.string,
  sectionId: PropTypes.string,
  className: PropTypes.string
};
