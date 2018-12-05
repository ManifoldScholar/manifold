import React, { PureComponent } from "react";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import PropTypes from "prop-types";
import withSearch from "hoc/with-search";

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
    section: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = props.searchQueryState;
  }

  get facets() {
    return [
      { label: "Projects", value: "Project" },
      { label: "Resources", value: "Resource" },
      { label: "Texts", value: "Text" },
      { label: "Full Text", value: "SearchableNode" }
    ];
  }

  get availableFacetValues() {
    return this.facets.map(facet => facet.value);
  }

  get scopes() {
    return [];
  }

  searchParams() {
    const params = Object.assign({}, this.props.searchQueryState);
    if (!params.facets || params.facets.includes("All")) {
      params.facets = this.availableFacetValues;
    }

    return params;
  }

  renderHeader(results, resultsMeta) {
    let output = (
      <header>
        <h1 className="title">{"Search"}</h1>
      </header>
    );

    if (results) {
      const resultsTotal = resultsMeta.pagination.totalCount;
      const resultString = resultsTotal === 1 ? "result" : "results";

      if (!resultsMeta.keyword.trim()) return output;

      output = (
        <header>
          <h1 className="title">{"Search Results"}</h1>
          <p className="subtitle">
            {`${resultsTotal} ${resultString} for "${resultsMeta.keyword}"`}
          </p>
        </header>
      );
    }

    return output;
  }

  render() {
    const results = this.props.results;
    const resultsMeta = this.props.resultsMeta;

    return (
      <div>
        <div className="search-form-frontend">
          <div className="container">
            {this.renderHeader(results, resultsMeta)}
            <SearchQuery.Form
              initialState={this.props.searchQueryState}
              setQueryState={this.props.setQueryState}
              facets={this.facets}
              scopes={this.scopes}
            />
          </div>
        </div>
        <div className="search-results-frontend">
          <div className="container">
            {this.props.results ? (
              <SearchResults.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.props.setPage}
                results={results}
                context="frontend"
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default withSearch(SearchContainer);
