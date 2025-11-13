import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import classNames from "classnames";
import Utility from "global/components/utility";
import Option from "global/components/form/Radio/Option";
import CheckboxMixed from "./CheckboxMixed";

export default function SearchQueryForm({
  searchQueryState,
  setQueryState = state => {
    /* eslint-disable no-console */
    console.warn("The SearchQuery component expects a setQueryState callback.");
    console.warn("Current SearchQuery State");
    console.warn(state);
    /* eslint-enable no-console */
  },
  facets: facetOptions = [],
  description,
  searchType,
  searchOnScopeChange = true,
  projectId,
  textId,
  sectionId,
  autoFocus = false
}) {
  const { t } = useTranslation();
  const handlersRef = useRef({
    facets: {},
    scopes: {}
  });

  const availableScopes = useMemo(() => {
    const scopesList = [];
    if (sectionId)
      scopesList.push({
        label: t("glossary.chapter_one"),
        value: "section",
        originalValue: "section"
      });
    if (textId)
      scopesList.push({
        label: t("glossary.text_one"),
        value: "text",
        originalValue: "text"
      });
    if (projectId)
      scopesList.push({
        label: t("glossary.project_one"),
        value: "project",
        originalValue: "project"
      });
    return scopesList;
  }, [sectionId, textId, projectId, t]);

  const setScopeIdFromScopeString = useCallback(
    state => {
      const { scope: scopeValue } = state;
      const newState = {
        scope: scopeValue,
        project: null,
        text: null,
        textSection: null
      };
      if (scopeValue === "project") newState.project = projectId;
      if (scopeValue === "text") newState.text = textId;
      if (scopeValue === "section") newState.textSection = sectionId;
      return { ...state, ...newState };
    },
    [projectId, textId, sectionId]
  );

  const setDefaultScope = useCallback(
    state => {
      if (availableScopes.length > 0 && !state.scope) {
        let scopeValue;
        if (availableScopes.find(s => s.value === "project")) {
          scopeValue = "project";
        } else if (availableScopes.find(s => s.value === "text")) {
          scopeValue = "text";
        } else {
          scopeValue = availableScopes[availableScopes.length - 1].value;
        }
        return {
          ...state,
          ...setScopeIdFromScopeString({ ...state, scope: scopeValue })
        };
      }
      return state;
    },
    [availableScopes, setScopeIdFromScopeString]
  );

  const [state, setState] = useState(() => setDefaultScope(searchQueryState));

  const searchIdPrefix = "query-search";
  const typeIsReader = searchType === "reader";

  const doSearch = useCallback(
    (event = null) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      setQueryState(state);
    },
    [state, setQueryState]
  );

  const setScope = useCallback(
    scopeValue => {
      if (scopeValue === state.scope) return;
      setState(prevState => {
        const newState = setScopeIdFromScopeString({
          ...prevState,
          scope: scopeValue
        });
        if (searchOnScopeChange) {
          setQueryState(newState);
        }
        return newState;
      });
    },
    [state.scope, setScopeIdFromScopeString, searchOnScopeChange, setQueryState]
  );

  const setKeyword = useCallback(event => {
    if (!event || !event.target) return;
    const target = event.target;
    const value = target.value;
    setState(prevState => {
      const newState = { ...prevState, keyword: value };
      return newState;
    });
  }, []);

  // Handle edge case where header/footer search is used on search route
  useEffect(() => {
    if (searchQueryState?.keyword !== state.keyword)
      setState(prevState => ({
        ...prevState,
        keyword: searchQueryState.keyword
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQueryState.keyword]);

  const setFacets = useCallback(
    facetsList => {
      const sortedFacets = [...facetsList].sort();
      setState(prevState => {
        const newState = { ...prevState, facets: sortedFacets };
        setQueryState(newState);
        return newState;
      });
    },
    [setQueryState]
  );

  const makeScopeHandler = useCallback(
    value => {
      let handler = handlersRef.current.scopes[value];
      if (handler) return handler;
      handler = () => {
        setScope(value);
      };
      handlersRef.current.scopes[value] = handler;
      return handler;
    },
    [setScope]
  );

  const renderScopeOptions = () => {
    return (
      <fieldset
        className={classNames({
          "search-query__filter-group": true,
          "search-query__filter-group--inline": typeIsReader
        })}
      >
        <legend className="search-query__group-label">
          {t("search.scopes_label")}
        </legend>
        <div className="search-query__filter-group-list">
          {availableScopes.map(option => (
            <Option
              key={option.value}
              option={option}
              groupName={`search[scope]`}
              onChange={makeScopeHandler(option.value)}
              value={state.scope}
              inline
            />
          ))}
        </div>
      </fieldset>
    );
  };

  const renderFacetOptions = () => {
    return (
      <CheckboxMixed
        label={t("search.result_types_label")}
        checkboxes={facetOptions}
        onChange={setFacets}
      />
    );
  };

  const renderFooter = () => {
    if (searchType !== "frontend" && !description) return false;

    return (
      <div className="search-query__footer">
        {description ? (
          <div className="search-query__description">{description}</div>
        ) : null}
        {searchType === "frontend" ? (
          <button
            type="submit"
            className="search-query__button-primary button-primary"
          >
            <span className="button-primary__text">{t("search.title")}</span>
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <form role="search" className="search-query" onSubmit={doSearch}>
      <div className="search-query__input-magnify">
        <UIDConsumer name={id => `${searchIdPrefix}-${id}`}>
          {id => (
            <>
              <label htmlFor={id} className="screen-reader-text">
                {t("search.instructions")}
              </label>
              <input
                type="text"
                id={id}
                autoFocus={autoFocus}
                onChange={setKeyword}
                value={state.keyword}
                placeholder={t("search.placeholder")}
                className="search-query__input"
              />
            </>
          )}
        </UIDConsumer>
        <button type="submit" className="search-query__submit">
          <Utility.IconComposer
            className="search-query__search-icon"
            icon="search16"
            size={22}
          />
          <span className="screen-reader-text">{t("search.execute")}</span>
        </button>
      </div>
      {availableScopes.length > 1 && renderScopeOptions()}
      {facetOptions.length > 0 && renderFacetOptions()}
      {renderFooter()}
    </form>
  );
}

SearchQueryForm.displayName = "Search.Query.Form";

SearchQueryForm.propTypes = {
  initialState: PropTypes.object,
  searchQueryState: PropTypes.object,
  setQueryState: PropTypes.func,
  facets: PropTypes.array,
  scopes: PropTypes.array,
  description: PropTypes.string,
  searchType: PropTypes.string,
  searchOnScopeChange: PropTypes.bool,
  projectId: PropTypes.string,
  textId: PropTypes.string,
  sectionId: PropTypes.string,
  autoFocus: PropTypes.bool
};
