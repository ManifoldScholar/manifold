import React, { Component } from "react";
import PropTypes from "prop-types";
import humps from "humps";

export default class MetaList extends Component {
  static displayName = "MetaList";

  static propTypes = {
    metadata: PropTypes.object,
    alphabetize: PropTypes.bool
  };

  static defaultProps = {
    alphabetize: true
  };

  render() {
    const keys = this.alphabetize
      ? Object.keys(this.props.metadata).sort()
      : Object.keys(this.props.metadata);

    return (
      <ul className="meta-list-primary">
        {keys.sort().map(key => {
          return (
            <li key={key}>
              <span className="meta-label">
                {humps.decamelize(key, { separator: " " })}
              </span>
              <div className="meta-value">
                {this.props.metadata[key]}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
