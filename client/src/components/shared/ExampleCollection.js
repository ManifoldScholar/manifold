import React, { Component, PropTypes } from 'react';

export default class extends Component {

  static propTypes = {
    collection: PropTypes.array
  };

  render() {
    return (
      <div>
        <ul>
          {Object.values(this.props.collection).map((item) => {
            return (
              <li key={item}>{item}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

