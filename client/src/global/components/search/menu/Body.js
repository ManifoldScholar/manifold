import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { serializeQueryToUrl } from "hooks/search/helpers";
import lh from "helpers/linkHandler";
import SearchQuery from "../query";

export default function SearchMenuBody({
  afterSubmit = () => {},
  searchType,
  scopes,
  initialState,
  description,
  projectId,
  textId,
  sectionId,
  visibility,
  className
}) {
  const { sectionId: sectionIdParam, textId: textIdParam } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialStateRef = useRef(initialState ?? {});
  const [query, setQueryState] = useState(initialStateRef.current);

  const visible = visibility ? Boolean(visibility.search) : true;
  useEffect(() => {
    if (!visible) setQueryState(initialStateRef.current);
  }, [visible]);

  let searchPath;
  if (searchType === "reader") {
    searchPath = lh.link(
      "readerSectionSearchResults",
      textId || textIdParam,
      sectionId || sectionIdParam
    );
  } else if (searchType === "project") {
    searchPath = lh.link("frontendProjectSearch", projectId);
  } else {
    searchPath = lh.link("frontendSearch");
  }

  const setQuery = next => {
    setQueryState(next);
    if (next?.keyword) {
      afterSubmit();
      navigate(
        { pathname: searchPath, search: serializeQueryToUrl(next) },
        { replace: true }
      );
    }
  };

  return (
    <div className={className}>
      <SearchQuery.ControlledProvider query={query} setQuery={setQuery}>
        <SearchQuery.Form
          scopes={scopes}
          placeholder={t("search.placeholder")}
          autoFocus
          className="search-query"
        />
      </SearchQuery.ControlledProvider>
      {description && (
        <div className="search-query__footer">
          <div className="search-query__description">{description}</div>
        </div>
      )}
    </div>
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
  visibility: PropTypes.object,
  className: PropTypes.string
};
