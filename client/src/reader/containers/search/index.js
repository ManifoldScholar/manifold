import React, { PureComponent } from "react";
import Search from "global/components/search";
import Overlay from "global/components/overlay";
import connectAndFetch from "utils/connectAndFetch";
import { searchResultsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

class SearchContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      results: select(requests.rSearchResults, state.entityStore),
      resultsMeta: meta(requests.rSearchResults, state.entityStore)
    };
  };

  static displayName = "Reader.SearchContainer";

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

  constructor(props) {
    super(props);
    this.state = {
      searchNum: 0
    };
  }

  componentDidMount() {
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

  isSectionSet() {
    return !!this.props.match.params.sectionId;
  }

  projectId() {
    if (!this.props.text) return null;
    return this.props.text.relationships.project.id;
  }

  textId() {
    if (!this.props.text) return null;
    return this.props.text.id;
  }

  sectionId() {
    if (!this.props.section) return null;
    return this.props.section.id;
  }

  doSearch = (page = 1) => {
    const pagination = { number: page };
    const params = Object.assign({}, this.state, { page: pagination });
    if (this.state.scope === "project" && this.projectId())
      params.project = this.projectId();
    if (this.state.scope === "text" && this.textId())
      params.text = this.textId();
    if (this.state.scope === "section" && this.sectionId())
      params.textSection = this.sectionId();
    if (params.facets.includes("All")) {
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

  close = () => {
    const { textId, sectionId } = this.props.match.params;
    if (textId && sectionId) {
      this.props.history.push(lh.link("readerSection", textId, sectionId), {
        noScroll: true
      });
    } else {
      this.props.history.push(lh.link("reader", textId), { noScroll: true });
    }
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
      { label: "Full Text", value: "SearchableNode" },
      { label: "Annotations", value: "Annotation" }
    ];
  }

  scopes() {
    const scopes = [
      { label: "Text", value: "text" },
      { label: "Project", value: "project" }
    ];
    if (this.isSectionSet()) {
      scopes.unshift({ label: "Chapter", value: "section" });
    }
    return scopes;
  }

  render() {
    return (
      <Overlay
        triggerScrollToTop={this.state.searchNum}
        closeCallback={this.close}
        title={"Search Results"}
        icon={"magnify"}
        contentWidth={850}
      >
        <div>
          <Search.Query.Form
            initialState={this.searchQueryState()}
            doSearch={this.doSearch}
            setQueryState={this.setQueryState}
            facets={this.facets()}
            scopes={this.scopes()}
          />
          {this.props.results ? (
            <Search.Results.List
              pagination={this.props.resultsMeta.pagination}
              paginationClickHandler={this.setPage}
              results={this.props.results}
              context="project"
            />
          ) : null}
        </div>
      </Overlay>
    );
  }
}

export default connectAndFetch(withRouter(SearchContainer));