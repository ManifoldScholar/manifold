import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import classnames from "classnames";

export default class Splash extends Component {
  static defaultProps = {
    toggleSignInUpOverlay: () => {},
    preview: false,
    authenticated: true
  };

  static displayName = "Layout.Splash";

  static propTypes = {
    authenticated: PropTypes.bool,
    toggleSignInUpOverlay: PropTypes.func,
    feature: PropTypes.object,
    preview: PropTypes.bool
  };

  componentDidMount() {
    this.sizeForeground();
  }

  componentDidUpdate() {
    this.sizeForeground();
  }

  sizeForeground = () => {
    if (!this.imgEl) return;
    if (!this.rightEl) return;
    const containerWidth = this.rightEl.offsetWidth;
    this.imgEl.style.position = get(
      this.props.feature,
      "attributes.foregroundPosition"
    );
    if (this.imgEl.offsetWidth > containerWidth) {
      this.imgEl.style.width = `${containerWidth}px`;
      this.imgEl.style.maxWidth = `${this.imgEl.naturalWidth}px`;
      this.imgEl.style.maxHeight = `${this.imgEl.naturalHeight}px`;
    }
  };

  handleSignUp = event => {
    event.preventDefault();
    this.props.toggleSignInUpOverlay();
  };

  attribute(name) {
    return get(this.props.feature, `attributes.${name}`);
  }

  backgroundStyle() {
    const backgroundColor = get(
      this.props.feature,
      "attributes.backgroundColor"
    );
    const backgroundImage = this.wrapUrlValue(
      get(this.props.feature, "attributes.backgroundStyles.original")
    );
    return this.stripNullStyles({ backgroundColor, backgroundImage });
  }

  body(formatted = true) {
    if (!formatted) return this.attribute("body");
    return this.attribute("bodyFormatted") || this.attribute("body");
  }

  feature(props) {
    return props.feature;
  }

  foregroundStyle() {
    const top = get(this.props.feature, "attributes.foregroundTop");
    const left = get(this.props.feature, "attributes.foregroundLeft");
    const maxWidth = 600;
    return this.stripNullStyles({ top, left, maxWidth });
  }

  foregroundTextStyle() {
    const color = get(this.props.feature, "attributes.foregroundColor");
    return this.stripNullStyles({ color });
  }

  hasAttribute(attribute) {
    return !isEmpty(this.attribute(attribute));
  }

  hasForeground() {
    return this.hasAttribute("foregroundStyles.original");
  }

  hasLink() {
    return this.hasAttribute("linkText") && this.hasAttribute("linkUrl");
  }

  header(formatted = true) {
    if (!formatted) return this.attribute("header");
    return this.attribute("headerFormatted") || this.attribute("header");
  }

  headerStyle() {
    const color = get(this.props.feature, "attributes.headerColor");
    return this.stripNullStyles({ color });
  }

  isDarkStyle() {
    const style = this.style();
    return style === "dark" || isEmpty(style);
  }

  isLightStyle() {
    return this.style() === "light";
  }

  isPreview(props = this.props) {
    return props.preview || false;
  }

  showSignUpButton() {
    return this.attribute("includeSignUp") && !this.props.authenticated;
  }

  stripNullStyles(style) {
    const newStyle = Object.assign({}, style);
    Object.keys(newStyle).forEach(
      key => newStyle[key] == null && delete newStyle[key]
    );
    return newStyle;
  }

  style() {
    return this.attribute("style");
  }

  subheader(formatted = true) {
    if (!formatted) return this.attribute("subheader");
    return this.attribute("subheaderFormatted") || this.attribute("subheader");
  }

  wrapUrlValue(url) {
    if (!url) return null;
    return `url(${url})`;
  }

  wrapperClass() {
    return classnames("feature", {
      "feature-dark-style": this.isDarkStyle(),
      "feature-light-style": this.isLightStyle(),
      "feature-preview": this.isPreview()
    });
  }

  render() {
    return (
      <section style={this.backgroundStyle()} className={this.wrapperClass()}>
        <div className="container flush rel">
          <figure ref={el => (this.rightEl = el)} className="right">
            {this.hasForeground() ? (
              <img
                ref={el => (this.imgEl = el)}
                style={this.foregroundStyle()}
                onLoad={this.sizeForeground}
                src={this.attribute("foregroundStyles.original")}
                alt={this.header(false)}
              />
            ) : null}
            &nbsp;
          </figure>
          <div className="left">
            <h2
              style={this.headerStyle()}
              className="heading-primary"
              dangerouslySetInnerHTML={{ __html: this.header() }}
            />
            <h3
              style={this.headerStyle()}
              className="heading-secondary"
              dangerouslySetInnerHTML={{ __html: this.subheader() }}
            />
            <div
              style={this.foregroundTextStyle()}
              className="feature-body"
              dangerouslySetInnerHTML={{ __html: this.body() }}
            />
            <div className="splash-content" />
            <nav className="buttons">
              {this.hasLink() ? (
                <a
                  href={this.attribute("linkUrl")}
                  target="blank"
                  className="button-bare-primary"
                >
                  {this.attribute("linkText")}
                </a>
              ) : null}
              {this.showSignUpButton() ? (
                <span
                  onClick={this.handleSignUp}
                  target="blank"
                  className="button-bare-primary"
                  role="button"
                  tabIndex="0"
                >
                  {"Sign Up"}
                </span>
              ) : null}
            </nav>
          </div>
        </div>
      </section>
    );
  }
}
