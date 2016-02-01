import React, { Component, PropTypes } from 'react';

export default class MetaAttributes extends Component {

  static propTypes = {
    data: PropTypes.array
  };

  render() {
    return (
      <ul className="meta-list">
        {this.props.data.map((pair) => {
          return (
            <li>
              <span className="meta-label">
                {pair.key}
              </span>
              <div className="meta-value">
                {pair.value}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
