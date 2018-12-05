import React, { PureComponent } from "react";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import Overlay from "global/components/Overlay";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import withSearch from "hoc/with-search";

class SearchContainer extends PureComponent {
  static displayName = "Reader.SearchContainer";

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

  get availableFacetValues() {
    return this.facets.map(facet => facet.value);
  }

  get facets() {
    return [
      { label: "Full Text", value: "SearchableNode" },
      { label: "Annotations", value: "Annotation" }
    ];
  }

  get scopes() {
    const scopes = [
      { label: "Text", value: "text" },
      { label: "Project", value: "project" }
    ];
    if (this.isSectionSet) {
      scopes.unshift({ label: "Chapter", value: "section" });
    }
    return scopes;
  }

  get isSectionSet() {
    return !!this.props.match.params.sectionId;
  }

  get projectId() {
    if (!this.props.text) return null;
    return this.props.text.relationships.project.id;
  }

  get textId() {
    if (!this.props.text) return null;
    return this.props.text.id;
  }

  get sectionId() {
    if (!this.props.section) return null;
    return this.props.section.id;
  }

  searchParams() {
    const params = Object.assign({}, this.props.searchQueryState);
    if (this.state.scope === "project" && this.projectId)
      params.project = this.projectId();
    if (this.state.scope === "text" && this.textId) params.text = this.textId();
    if (this.state.scope === "section" && this.sectionId)
      params.textSection = this.sectionId();
    if (params.facets.includes("All")) {
      params.facets = this.availableFacetValues;
    }

    return params;
  }

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

  render() {
    return (
      <Overlay
        triggerScrollToTop={this.searchNum}
        closeCallback={this.close}
        title={"Search Results"}
        icon={"magnify"}
        contentWidth={850}
      >
        <div>
          <SearchQuery.Form
            initialState={this.props.searchQueryState}
            setQueryState={this.props.setQueryState}
            facets={this.facets}
            scopes={this.scopes}
          />
          {this.props.results ? (
            <SearchResults.List
              pagination={this.props.resultsMeta.pagination}
              paginationClickHandler={this.props.setPage}
              results={this.props.results}
              context="project"
            />
          ) : null}
        </div>
      </Overlay>
    );
  }
}

export default withSearch(SearchContainer);
