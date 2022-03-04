import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import PropTypes from "prop-types";
import withSearch from "hoc/withSearch";

class SearchContainer extends PureComponent {
  static displayName = "Frontend.SearchContainer";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    results: PropTypes.array,
    resultsMeta: PropTypes.object,
    searchQueryState: PropTypes.object.isRequired,
    setQueryState: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    text: PropTypes.object,
    section: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = props.searchQueryState;
  }

  get facets() {
    const t = this.props.t;
    return [
      { label: t("glossary.project_other"), value: "Project" },
      { label: t("glossary.resource_other"), value: "Resource" },
      { label: t("glossary.text_other"), value: "Text" },
      { label: t("glossary.annotation_other"), value: "Annotation" },
      { label: t("glossary.full_text_other"), value: "TextSection" }
    ];
  }

  render() {
    const { results, t } = this.props;

    return (
      <div>
        <h1 className="screen-reader-text">{t("search.title")}</h1>
        <div className="search-form-frontend">
          <div className="container">
            <h2 className="screen-reader-text">{t("search.form")}</h2>
            <SearchQuery.Form
              initialState={{
                keyword: ""
              }}
              searchQueryState={this.props.searchQueryState}
              setQueryState={this.props.setQueryState}
              facets={this.facets}
            />
          </div>
        </div>
        {results && (
          <div className="search-results-frontend">
            <div className="container">
              <h2 className="screen-reader-text">{t("search.results")}</h2>
              <SearchResults.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.props.setPage}
                results={results}
                context="frontend"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(withSearch(SearchContainer));
