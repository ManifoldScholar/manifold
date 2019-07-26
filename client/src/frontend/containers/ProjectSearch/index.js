import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import BackLink from "frontend/components/back-link";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { uiFrontendModeActions } from "actions";
import withSearch from "hoc/with-search";

class ProjectSearch extends Component {
  static propTypes = {
    route: PropTypes.object
  };

  get project() {
    return this.props.project;
  }

  constructor(props) {
    super(props);
    this.state = props.searchQueryState;
  }

  componentDidMount() {
    this.props.dispatch(uiFrontendModeActions.isProjectSubpage());
  }

  get facets() {
    return [
      { label: "Resources", value: "Resource" },
      { label: "Texts", value: "Text" },
      { label: "Annotations", value: "Annotation" },
      { label: "Full Text", value: "TextSection" }
    ];
  }

  render() {
    if (!this.project) return null;

    return (
      <div>
        <BackLink.Register
          link={lh.link("frontendProjectDetail", this.project.attributes.slug)}
          title={this.project.attributes.titlePlaintext}
        />
        <h1 className="screen-reader-text">Search</h1>
        <div className="search-form-frontend">
          <div className="container">
            <h2 className="screen-reader-text">Search Form</h2>
            <SearchQuery.Form
              initialState={{
                keyword: "",
                scope: "project",
                allFacets: true
              }}
              projectId={this.project.id}
              searchQueryState={this.props.searchQueryState}
              setQueryState={this.props.setQueryState}
              facets={this.facets}
            />
          </div>
        </div>
        {this.props.results ? (
          <div className="search-results-frontend">
            <div className="container">
              <h2 className="screen-reader-text">Search Results</h2>
              <SearchResults.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.props.setPage}
                results={this.props.results}
                hideParent
                context="frontend"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withSearch(ProjectSearch);
