import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Query from "../Query";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

export class SearchMenuBody extends PureComponent {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    visibility: PropTypes.object.isRequired,
    searchType: PropTypes.string.isRequired,
    facets: PropTypes.array,
    scopes: PropTypes.array,
    initialState: PropTypes.object,
    description: PropTypes.string
  };

  static defaultProps = {
    toggleVisibility: () => {}
  };

  setQueryState = queryParams => {
    this.setState(queryParams);
  };

  doSearch = () => {
    if (this.props.searchType === "reader") return this.doReaderSearch();
    return this.doFrontendSearch();
  };

  doFrontendSearch = () => {
    this.props.toggleVisibility();
    setTimeout(() => {
      const path = lh.link("frontendSearch");
      this.props.history.push(path, {
        searchQueryState: this.state,
        noScroll: true
      });
    }, 250);
  };

  doReaderSearch = () => {
    this.props.toggleVisibility();
    setTimeout(() => {
      const { sectionId, textId } = this.props.match.params;
      const path = lh.link("readerSectionSearchResults", textId, sectionId);
      this.props.history.push(path, {
        searchQueryState: this.state,
        noScroll: true
      });
    }, 250);
  };

  render() {
    return (
      <nav className="search-menu">
        <ReactCSSTransitionGroup
          transitionName="visibility"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.props.visibility.search ? (
            <Query.Form
              facets={this.props.facets}
              initialState={this.props.initialState}
              scopes={this.props.scopes}
              searchType={this.props.searchType}
              description={this.props.description}
              setQueryState={this.setQueryState}
              doSearch={this.doSearch}
            />
          ) : null}
        </ReactCSSTransitionGroup>
      </nav>
    );
  }
}

export default withRouter(SearchMenuBody);
