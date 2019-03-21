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
      { label: "Annotations", value: "Annotation" },
      { label: "Full Text", value: "TextSection" }
    ];
  }

  render() {
    const results = this.props.results;

    return (
      <div>
        <div className="search-form-frontend">
          <div className="container">
            <SearchQuery.Form
              initialState={{
                keyword: "",
                allFacets: true
              }}
              searchQueryState={this.props.searchQueryState}
              setQueryState={this.props.setQueryState}
              facets={this.facets}
            />
          </div>
        </div>
        {this.props.results ? (
          <div className="search-results-frontend">
            <div className="container">
              <SearchResults.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.props.setPage}
                results={results}
                context="frontend"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withSearch(SearchContainer);
