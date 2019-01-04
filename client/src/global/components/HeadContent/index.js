import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import config from "config";
import get from "lodash/get";

import withSettings from "hoc/with-settings";

export class HeadContentComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    siteName: PropTypes.string,
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    locale: PropTypes.string,
    charset: PropTypes.string,
    twitterCard: PropTypes.string,
    twitterSite: PropTypes.string,
    description: PropTypes.string,
    appendTitle: PropTypes.bool,
    settings: PropTypes.object
  };

  static defaultProps = { ...config.app.head.meta };

  get defaultTitle() {
    return get(this.props.settings, "attributes.general.headTitle");
  }

  get title() {
    let title = this.props.title;
    if (!title) return null;
    if (this.props.appendTitle) title = `${this.defaultTitle} | ${title}`;

    return title;
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
    const image =
      this.props.image ||
      get(this.props.settings, "attributes.pressLogoStyles.medium") ||
      `/static/logo.jpg`;
    return `${config.services.client.url}${image}`;
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
    this.addOpenGraph(meta, "title", null, this.title);
    this.addOpenGraph(meta, "description", null, this.description);
    this.addOpenGraph(meta, "imageWidth", "image:width");
    this.addOpenGraph(meta, "imageHeight", "image:height");
    this.addMeta(meta, "twitterCard", "twitter:card");
    this.addMeta(meta, "twitterSite", "twitter:site", this.twitterSite);
    return meta;
  }

  titleTemplate(props) {
    if (!props.appendTitle) return null;

    return `${this.defaultTitle} | %s`;
  }

  render() {
    const meta = this.buildMetaContent();
    const props = {
      meta,
      title: this.props.title
    };
    props.titleTemplate = this.titleTemplate(this.props);
    props.defaultTitle = this.defaultTitle;

    return <Helmet {...props} />;
  }
}

export default withSettings(HeadContentComponent);
