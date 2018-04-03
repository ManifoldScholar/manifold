import React, { Component } from "react";
import PropTypes from "prop-types";
import URI from "urijs";
import { Link } from "react-router-dom";
import validatedNode from "./HigherOrder/ValidatedNode";

class LinkNode extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  hasUri() {
    return this.props.attributes.hasOwnProperty("href");
  }

  isAbsoluteUri() {
    if (!this.hasUri()) {
      return false;
    }
    return URI.parse(this.props.attributes.href).protocol;
  }

  adjustedAttributes() {
    const parsedURI = URI.parse(this.props.attributes.href);
    const pathname = parsedURI.path;
    const query = parsedURI.query;
    const adjustedAttributes = { to: { pathname, query } };
    if (parsedURI.fragment) {
      adjustedAttributes.to.hash = `#${parsedURI.fragment}`;
    }
    delete Object.assign(adjustedAttributes, this.props.attributes).href;
    return adjustedAttributes;
  }

  render() {
    if (!this.hasUri() || this.isAbsoluteUri()) {
      return React.createElement(
        this.props.tag,
        this.props.attributes,
        this.props.children
      );
    }
    return React.createElement(
      Link,
      this.adjustedAttributes(),
      this.props.children
    );
  }
}

export default validatedNode(LinkNode);
