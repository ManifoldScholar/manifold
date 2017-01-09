import React, { Component, PropTypes } from 'react';
import humps from 'humps';

export default class ProjectMeta extends Component {

  static displayName = "Project.Meta"

  static propTypes = {
    metadata: PropTypes.object
  };

  render() {
    const keys = Object.keys(this.props.metadata);
    return (
      <ul className="meta-list-primary">
        {keys.map((key) => {
          return (
            <li key={key} >
              <span className="meta-label">
                {humps.decamelize(key, { separator: ' ' })}
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
