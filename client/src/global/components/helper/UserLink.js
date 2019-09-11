import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Url from "url-parse";
import memoize from "lodash/memoize";
import config from "config";
import { Link } from "react-router-dom";

const urlFactory = memoize(url => new Url(url));

class UserLink extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired
  };

  get isReactRouterLink() {
    return this.isLocalUrl;
  }

  get linkComponent() {
    return this.isReactRouterLink ? Link : "a";
  }

  get linkProps() {
    const baseProps = {
      className: this.props.className
    };
    if (this.isReactRouterLink) {
      return Object.assign(baseProps, {
        to: this.renderUrl
      });
    }
    return Object.assign(baseProps, {
      href: this.renderUrl,
      target: "_blank",
      rel: "noopener noreferrer"
    });
  }

  get isAbsoluteUrl() {
    return /^[a-z][a-z\d+.-]*:/.test(this.rawUrl);
  }

  get isLocalUrl() {
    if (!this.isAbsoluteUrl) return true;
    return this.parsedUrl.hostname === config.services.client.domain;
  }

  get rawUrl() {
    return this.props.url;
  }

  get parsedUrl() {
    return urlFactory(this.rawUrl);
  }

  get renderUrl() {
    if (this.isLocalUrl)
      return `${this.parsedUrl.pathname}${this.parsedUrl.query}${this.parsedUrl.hash}`;
    return this.rawUrl;
  }

  render() {
    const LinkComponent = this.linkComponent;
    const linkProps = this.linkProps;

    return <LinkComponent {...linkProps}>{this.props.children}</LinkComponent>;
  }
}

export default withRouter(UserLink);
