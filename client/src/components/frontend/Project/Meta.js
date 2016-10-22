import React, { Component, PropTypes } from 'react';

export default class ProjectMeta extends Component {

  static displayName = "Project.Meta"

  static propTypes = {
    metadata: PropTypes.object
  };

  render() {
    const keys = Object.keys(this.props.metadata);
    return (
      <ul className="meta-list">
        {keys.map((key) => {
          return (
            <li key={key} >
              <span className="meta-label">
                {key}
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
