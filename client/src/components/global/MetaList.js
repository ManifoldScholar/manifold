import React, { Component } from "react";
import PropTypes from "prop-types";
import humps from "humps";

const regenerateState = metadata => {
  const long = {};
  const short = {};

  Object.keys(metadata).forEach(key => {
    const value = metadata[key];
    if (value.length > 280) {
      long[key] = value;
    } else {
      short[key] = value;
    }
  });

  return {
    long: Object.assign({}, long),
    short: Object.assign({}, short)
  };
};

export default class MetaList extends Component {
  static displayName = "MetaList";

  static propTypes = {
    metadata: PropTypes.object
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = regenerateState(nextProps.metadata);
    if (newState !== prevState) {
      return newState;
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = regenerateState(props.metadata);
  }

  render() {
    const { long, short } = this.state;
    const shortKeys = Object.keys(short).sort();

    return (
      <div>
        <ul className="meta-list-primary">
          {Object.keys(long).map(key => {
            return (
              <li key={key}>
                <span className="meta-label">
                  {humps.decamelize(key, { separator: " " })}
                </span>
                <div
                  className="meta-value"
                  dangerouslySetInnerHTML={{ __html: long[key] }}
                />
              </li>
            );
          })}
        </ul>
        <ul className="meta-list-primary columnar">
          {shortKeys.map(key => {
            return (
              <li key={key}>
                <span className="meta-label">
                  {humps.decamelize(key, { separator: " " })}
                </span>
                <div
                  className="meta-value"
                  dangerouslySetInnerHTML={{ __html: short[key] }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
