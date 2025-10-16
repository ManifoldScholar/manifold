import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Query from "../query";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";

export class SearchMenuBody extends PureComponent {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    searchType: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    facets: PropTypes.array,
    scopes: PropTypes.array,
    initialState: PropTypes.object,
    description: PropTypes.string,
    projectId: PropTypes.string,
    textId: PropTypes.string,
    sectionId: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    toggleVisibility: () => {}
  };

  setQueryState = queryParams => {
    this.setState(queryParams, this.doSearch);
  };

  doSearch = () => {
    if (this.props.searchType === "reader") return this.doReaderSearch();
    if (this.props.searchType === "project") return this.doProjectSearch();
    if (this.props.onSubmit) this.props.onSubmit();
    return this.doFrontendSearch();
  };

  doFrontendSearch = () => {
    this.props.toggleVisibility();
    setTimeout(() => {
      const path = lh.link("frontendSearch");
      this.props.history.push(path, {
        searchQueryState: this.state,
        noScroll: true,
        fromMenu: true
      });
    }, 250);
  };

  doProjectSearch = () => {
    this.props.toggleVisibility();
    setTimeout(() => {
      const path = lh.link("frontendProjectSearch", this.props.projectId);
      this.props.history.push(path, {
        searchQueryState: this.state,
        noScroll: true,
        fromMenu: true
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
        noScroll: true,
        fromMenu: true
      });
    }, 250);
  };

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <Query.Form
          projectId={this.props.projectId}
          sectionId={this.props.sectionId}
          textId={this.props.textId}
          facets={this.props.facets}
          initialState={this.props.initialState}
          scopes={this.props.scopes}
          searchType={this.props.searchType}
          description={this.props.description}
          searchOnScopeChange={false}
          setQueryState={this.setQueryState}
          autoFocus
        />
      </div>
    );
  }
}

export default withRouter(SearchMenuBody);
