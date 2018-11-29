import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SearchResultsEmpty extends PureComponent {
  static displayName = "Search.Results.Empty";

  static propTypes = {};

  render() {
    return (
      <div className="search-results">
        <span className="label-count">
          <span className="count">0</span> results found
        </span>
      </div>
    );
  }
}
