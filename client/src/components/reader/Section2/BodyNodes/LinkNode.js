import React, { Component, PropTypes } from 'react';
import URI from 'uri-js';
import { Link } from 'react-router';
import validatedNode from './HigherOrder/ValidatedNode';

class LinkNode extends Component {

  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  hasUri() {
    return this.props.attributes.hasOwnProperty('href');
  }

  isAbsoluteUri() {
    if (!this.hasUri()) {
      return false;
    }
    return URI.parse(this.props.attributes.href).reference === 'absolute';
  }

  adjustedAttributes() {
    const parsedURI = URI.parse(this.props.attributes.href);
    const pathname = parsedURI.path;
    const query = parsedURI.query;
    const hash = `#${parsedURI.fragment}`;
    const adjustedAttributes = { to: { pathname, query, hash } };
    delete Object.assign(adjustedAttributes, this.props.attributes).href;
    return adjustedAttributes;
  }

  render() {
    if (!this.hasUri() || this.isAbsoluteUri()) {
      return React.createElement(this.props.tag, this.props.attributes, this.props.children);
    }
    return React.createElement(Link, this.adjustedAttributes(), this.props.children);
  }

}

export default validatedNode(LinkNode);
