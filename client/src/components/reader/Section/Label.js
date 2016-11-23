import React, { Component, PropTypes } from 'react';

export default class Label extends Component {

  static propTypes = {
    category: PropTypes.string
  };

  render() {
    return (
      <div className="section-category-label">
        <div className="container">
          <div className="label">
            {this.props.category}
          </div>
        </div>
      </div>
    );
  }
}
