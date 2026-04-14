import React, { Component } from "react";
import PropTypes from "prop-types";
import validatedNode from "../../higher-order/ValidatedNode";
import H5p from "./H5p";
import get from "lodash/get";

class IframeNode extends Component {
  static propTypes = {};

  static components = {
    h5p: H5p
  };

  get type() {
    const type = get(this.props, "attributes.data-manifold-iframe");
    if (!type) return null;
    return type.toLowerCase();
  }

  get components() {
    return IframeNode.components;
  }

  get component() {
    if (!this.hasComponent) return null;
    return this.components[this.type];
  }

  get hasComponent() {
    return Object.keys(this.components).includes(this.type);
  }

  get width() {
    return parseInt(this.styleOrAttr("width"), 10);
  }

  get height() {
    return parseInt(this.styleOrAttr("height"), 10);
  }

  get renderAttributes() {
    const {
      width: widthIgnored,
      height: heightIgnored,
      style: styleIgnored,
      ...filteredAttributes
    } = this.props.attributes;
    return filteredAttributes;
  }

  get style() {
    let base = this.props.attributes.styles || {};
    base = { ...base };
    delete base.width;
    delete base.height;
    return base;
  }

  get wrapperStyle() {
    let paddingTop = "56.25%";
    if (!this.height || !this.width > 0) paddingTop = this.height / this.width;
    return { paddingTop };
  }

  styleOrAttr(key) {
    if (this.props.attributes.style && this.props.attributes.style[key])
      return this.props.attributes.style[key];
    if (this.props.attributes && this.props.attributes[key])
      return this.props.attributes[key];
  }

  render() {
    const attributes = this.props.attributes;
    if (this.hasComponent) {
      const SupportedComponent = this.component;
      return <SupportedComponent {...attributes} />;
    }

    /* eslint-disable jsx-a11y/iframe-has-title */
    /* We rely on the content to provide the accessibility here */
    return (
      <span style={this.wrapperStyle} className="responsive-iframe">
        <iframe {...this.renderAttributes} style={this.style} />
      </span>
    );
    /* eslint-enable jsx-a11y/iframe-has-title */
  }
}

export default validatedNode(IframeNode);
