import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SearchNoResults extends PureComponent {
  static displayName = "Search.NoResults";

  static propTypes = {};

  render() {
    return (
      <div className="search-results">
        <label className="label-count">
          <span className="count">0</span> results found
        </label>
      </div>
    );
  }
}
