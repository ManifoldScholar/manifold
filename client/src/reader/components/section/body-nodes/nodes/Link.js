import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import config from "config";
import validatedNode from "../higher-order/ValidatedNode";

class LinkNode extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array,
  };

  get href() {
    return this.props.attributes.href;
  }

  get hasHref() {
    return !!("href" in this.props.attributes);
  }

  get isProxyURL() {
    if (!this.hasHref) return false;
    return /api\/proxy\//.test(this.href);
  }

  get isAbsoluteURL() {
    if (!this.hasHref) return false;

    try {
      // will only succeed if this.href is a full URL
      // eslint-disable-next-line no-unused-vars
      const url = new URL(this.href);
      return true;
    } catch (_) {
      // return false for relative links; otherwise treat malformed URLs as absolute
      return !this.href.startsWith("/");
    }
  }

  adjustedAttributes() {
    const parsedURI = new URL(this.href, config.services.client.url);
    const { pathname, search: query, hash } = parsedURI;
    const adjustedAttributes = { to: { pathname, query } };
    if (hash) {
      adjustedAttributes.to.hash = hash;
    }
    delete Object.assign(adjustedAttributes, this.props.attributes).href;
    return adjustedAttributes;
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          hasInteractiveAncestor: true,
        });
      }
    });
  }

  render() {
    if (!this.hasHref || this.isAbsoluteURL || this.isProxyURL) {
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
