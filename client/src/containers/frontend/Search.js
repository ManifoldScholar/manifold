import React, { PureComponent } from "react";
import { Search } from "components/global";
import connectAndFetch from "utils/connectAndFetch";
import { searchResultsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const { request, flush } = entityStoreActions;

class SearchContainer extends PureComponent {
  static displayName = "Frontend.SearchContainer";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    results: PropTypes.array,
    resultsMeta: PropTypes.object,
    text: PropTypes.object,
    section: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      results: select(requests.rSearchResults, state.entityStore),
      resultsMeta: meta(requests.rSearchResults, state.entityStore)
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      searchNum: 0
    };
  }

  componentWillMount() {
    if (this.searchQueryState()) {
      this.setState(this.props.location.state.searchQueryState, () => {
        this.doSearch();
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If we have results and a keyword
    if (this.props.results && this.state.keyword) {
      // and scope or facet was changed, then we run the search.
      if (
        prevState.facets !== this.state.facets ||
        prevState.scope !== this.state.scope
      ) {
        this.doSearch();
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rSearchResults));
  }

  setPage = page => {
    return event => {
      event.preventDefault();
      this.doSearch(page);
    };
  };

  setQueryState = queryParams => {
    this.setState(queryParams);
  };

  doSearch = (page = 1) => {
    const pagination = { number: page };
    const params = Object.assign({}, this.state, { page: pagination });
    if (!params.facets || params.facets.includes("All")) {
      params.facets = this.availableFacetValues();
    }
    const call = searchResultsAPI.index(params);
    const { promise: one } = this.props.dispatch(
      request(call, requests.rSearchResults)
    );
    one.then(
      () => {
        this.setState({ searchNum: this.state.searchNum + 1 });
      },
      () => {
        // do nothing
      }
    );
  };

  searchQueryState() {
    if (this.props.location.state)
      return this.props.location.state.searchQueryState;
    return null;
  }

  availableFacetValues() {
    return this.facets().map(facet => facet.value);
  }

  facets() {
    return [
      { label: "Projects", value: "Project" },
      { label: "Resources", value: "Resource" },
      { label: "Texts", value: "Text" },
      { label: "Full Text", value: "SearchableNode" }
    ];
  }

  scopes() {
    return [];
  }

  renderHeader(results, resultsMeta) {
    let output = (
      <header>
        <h1 className="title">{"Search"}</h1>
      </header>
    );

    if (results) {
      const resultString = results.length === 1 ? "result" : "results";

      if (!resultsMeta.keyword.trim()) return output;

      output = (
        <header>
          <h1 className="title">{"Search Results"}</h1>
          <p className="subtitle">
            {`${results.length} ${resultString} for "${resultsMeta.keyword}"`}
          </p>
        </header>
      );
    }

    return output;
  }

  render() {
    const queryState = this.searchQueryState();
    const results = this.props.results;
    const resultsMeta = this.props.resultsMeta;

    return (
      <div>
        <div className="search-form-frontend">
          <div className="container">
            {this.renderHeader(results, resultsMeta)}
            <Search.Query.Form
              initialState={queryState}
              doSearch={this.doSearch}
              setQueryState={this.setQueryState}
              facets={this.facets()}
              scopes={this.scopes()}
            />
          </div>
        </div>
        <div className="search-results-frontend">
          <div className="container">
            {this.props.results ? (
              <Search.Results.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.setPage}
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

export default connectAndFetch(withRouter(SearchContainer));
