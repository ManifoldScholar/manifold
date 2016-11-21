import React, { Component, PropTypes } from 'react';
import validatedNode from './HigherOrder/ValidatedNode';

class CodeNode extends Component {

  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  render() {
    const child = this.props.children[0];
    if (!child && child.props.content) return null;
    return (
      <code
        data-text-digest={child.props.textDigest}
        data-node-uuid={child.props.nodeUuid}
      >
        {child.props.content}
      </code>
    );
  }

}

export default validatedNode(CodeNode);
