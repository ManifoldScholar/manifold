import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import Utility from "../utility";
import unescape from "lodash/unescape";

import config from "config";
import get from "lodash/get";

import withSettings from "hoc/withSettings";

export class HeadContentComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    socialTitle: PropTypes.string,
    image: PropTypes.string,
    siteName: PropTypes.string,
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    locale: PropTypes.string,
    charset: PropTypes.string,
    twitterCard: PropTypes.string,
    twitterSite: PropTypes.string,
    description: PropTypes.string,
    appendDefaultTitle: PropTypes.bool,
    settings: PropTypes.object
  };

  static defaultProps = { ...config.app.head.meta };

  get defaultTitle() {
    return get(this.props.settings, "attributes.general.headTitle");
  }

  get title() {
    return unescape(this.props.title);
  }

  get appendedTitle() {
    if (this.props.appendDefaultTitle)
      return `${this.title} | ${this.defaultTitle}`;
    return this.title;
  }

  get socialTitle() {
    return this.props.socialTitle || this.appendedTitle;
  }

  get twitterSite() {
    const twitter =
      get(this.props.settings, "attributes.general.twitter") ||
      this.props.twitterSite;
    return `@${twitter}`;
  }

  get description() {
    if (this.props.description) return this.props.description;
    return get(this.props.settings, "attributes.general.headDescription");
  }

  get image() {
    return (
      this.props.image ||
      get(this.props.settings, "attributes.pressLogoStyles.medium") ||
      `${config.services.client.url}/static/logo.jpg`
    );
  }

  readPropValue(key) {
    return this.props[key];
  }

  addMeta(meta, key, overrideKey = null, overrideValue = null) {
    const value = overrideValue || this.readPropValue(key);
    if (!value) return meta;
    const adjustedKey = overrideKey || key;
    meta.push({ name: adjustedKey, content: value });
    return meta;
  }

  addOpenGraph(meta, key, overrideKey = null, overrideValue = null) {
    const adjustedKey = overrideKey || key;
    return this.addMeta(meta, key, `og:${adjustedKey}`, overrideValue);
  }

  buildMetaContent() {
    const meta = [];
    meta.push({ charset: this.props.charset });
    this.addMeta(meta, "description", null, this.description);
    this.addOpenGraph(meta, "siteName", "site_name", this.defaultTitle);
    this.addOpenGraph(meta, "locale");
    this.addOpenGraph(meta, "image", null, this.image);
    this.addOpenGraph(meta, "title", null, this.socialTitle);
    this.addOpenGraph(meta, "description", null, this.description);
    this.addOpenGraph(meta, "imageWidth", "image:width");
    this.addOpenGraph(meta, "imageHeight", "image:height");
    this.addMeta(meta, "twitterCard", "twitter:card");
    this.addMeta(meta, "twitterSite", "twitter:site", this.twitterSite);
    return meta;
  }

  titleTemplate(props) {
    if (!props.appendDefaultTitle) return null;

    return `%s | ${this.defaultTitle}`;
  }

  render() {
    const meta = this.buildMetaContent();
    const props = {
      meta,
      title: this.title
    };
    props.titleTemplate = this.titleTemplate(this.props);
    props.defaultTitle = this.defaultTitle;

    return (
      <>
        <Helmet {...props} />
        <Utility.RouteAnnouncer title={props.title ?? props.defaultTitle} />
      </>
    );
  }
}

export default withSettings(HeadContentComponent);
