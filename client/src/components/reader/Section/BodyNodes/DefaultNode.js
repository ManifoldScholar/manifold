import React, { Component, PropTypes } from 'react';
import validatedNode from './HigherOrder/ValidatedNode';
import isEmpty from 'lodash/isEmpty';

class DefaultNode extends Component {

  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  render() {
    return React.createElement(this.props.tag, this.props.attributes, this.props.children);
  }

}

export default validatedNode(DefaultNode);
