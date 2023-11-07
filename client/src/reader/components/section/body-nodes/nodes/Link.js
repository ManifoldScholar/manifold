import React, { Component } from "react";
import PropTypes from "prop-types";
import URI from "urijs";
import { Link } from "react-router-dom";
import validatedNode from "../higher-order/ValidatedNode";

class LinkNode extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  hasUri() {
    return this.props.attributes.hasOwnProperty("href");
  }

  isProxyUri() {
    if (this.hasUri()) {
      return /api\/proxy\//.test(this.props.attributes.href);
    }
    return false;
  }

  isAbsoluteUri() {
    if (!this.hasUri()) {
      return false;
    }

    try {
      return URI.parse(this.props.attributes.href).protocol;
    } catch (e) {
      return true;
    }
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

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          hasInteractiveAncestor: true
        });
      }
    });
  }

  render() {
    if (!this.hasUri() || this.isAbsoluteUri() || this.isProxyUri()) {
      const Tag = this.props.tag;
      return (
        <Tag
          {...this.props.attributes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.renderChildren()}
        </Tag>
      );
    }

    return <Link {...this.adjustedAttributes()}>{this.renderChildren()}</Link>;
  }
}

export default validatedNode(LinkNode);
