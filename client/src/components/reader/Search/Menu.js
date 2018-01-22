import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Query from "./Query";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

export class ReaderSearchMenu extends PureComponent {
  static propTypes = {
    toggleVisibility: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    visibility: PropTypes.object.isRequired
  };

  setQueryState = queryParams => {
    this.setState(queryParams);
  };

  doSearch = () => {
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
          {this.props.visibility.search
            ? <Query
                setQueryState={this.setQueryState}
                doSearch={this.doSearch}
                includeSection
              />
            : null}
        </ReactCSSTransitionGroup>
      </nav>
    );
  }
}

export default withRouter(ReaderSearchMenu);
