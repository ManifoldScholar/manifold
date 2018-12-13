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

  get facets() {
    return [
      { label: "Full Text", value: "SearchableNode" },
      { label: "Annotations", value: "Annotation" }
    ];
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
            initialState={{
              keyword: "",
              scope: "text",
              allFacets: true
            }}
            searchQueryState={this.props.searchQueryState}
            setQueryState={this.props.setQueryState}
            facets={this.facets}
            projectId={this.projectId}
            textId={this.textId}
            sectionId={this.sectionId}
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
