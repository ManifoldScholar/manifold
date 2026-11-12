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

  // Inline styles to pass through to the iframe. Width and height are omitted
  // because the responsive wrapper controls the frame's dimensions.
  get style() {
    const { width: widthIgnored, height: heightIgnored, ...filteredStyle } =
      this.props.attributes.style || {};
    return filteredStyle;
  }

  // Sets the wrapper's aspect ratio from the frame's specified dimensions. When
  // either dimension is missing or invalid, no inline style is set and the
  // stylesheet's default ratio for .responsive-iframe applies.
  get wrapperStyle() {
    const { width, height } = this;
    if (!(width > 0) || !(height > 0)) return {};
    return { aspectRatio: `${width} / ${height}` };
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
