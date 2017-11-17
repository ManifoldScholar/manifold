import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import config from "../../config";

export default class HeadContent extends Component {
  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string
  };

  readPropValue(key) {
    if (key === "image" && this.props.image)
      return `${config.clientUrl}${this.props.image}`;
    return this.props[key];
  }

  addMeta(meta, key) {
    const value = this.readPropValue(key);
    if (!value) return meta;
    meta.push({ name: key, content: value });
    return meta;
  }

  addOpenGraph(meta, key, override = null) {
    const value = this.readPropValue(key);
    if (!value) return meta;
    const adjustedKey = override || key;
    meta.push({ property: `og:${adjustedKey}`, content: value });
    return meta;
  }

  addTwitterCard(meta, key) {
    const value = this.readPropValue(key);
    if (!value) return meta;
    meta.push({ property: `twitter:${key}`, content: value });
    return meta;
  }

  buildMetaContent() {
    const meta = [];
    this.addOpenGraph(meta, "image");
    this.addOpenGraph(meta, "title");
    this.addOpenGraph(meta, "description");
    this.addOpenGraph(meta, "imageWidth", "image:width");
    this.addOpenGraph(meta, "imageHeight", "image:height");
    this.addMeta(meta, "description");
    return meta;
  }

  render() {
    const meta = this.buildMetaContent();
    return <Helmet meta={meta} title={this.props.title} />;
  }
}
