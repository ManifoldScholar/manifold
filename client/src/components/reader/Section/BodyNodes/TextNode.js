import React, { Component, PropTypes } from 'react';

export default class TextNode extends Component {

  static propTypes = {
    content: PropTypes.string,
  };

  render() {
    return (
      <span>{this.props.content}</span>
    );
  }

}
