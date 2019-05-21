import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import classNames from "classnames";

export default class Splash extends Component {
  static displayName = "Layout.Splash";

  static propTypes = {
    authenticated: PropTypes.bool,
    toggleSignInUpOverlay: PropTypes.func,
    feature: PropTypes.object,
    preview: PropTypes.bool
  };

  static defaultProps = {
    toggleSignInUpOverlay: () => {},
    preview: false,
    authenticated: true
  };

  componentDidMount() {
    this.sizeForeground();
  }

  componentDidUpdate() {
    this.sizeForeground();
  }

  foregroundStyle() {
    const top = get(this.props.feature, "attributes.foregroundTop");
    const left = get(this.props.feature, "attributes.foregroundLeft");
    const maxWidth = 600;
    return this.stripNullStyles({ top, left, maxWidth });
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

  feature(props) {
    return props.feature;
  }

  isPreview(props = this.props) {
    return props.preview || false;
  }

  stripNullStyles(style) {
    const newStyle = Object.assign({}, style);
    Object.keys(newStyle).forEach(
      key => newStyle[key] == null && delete newStyle[key]
    );
    return newStyle;
  }

  headerStyle() {
    const color = get(this.props.feature, "attributes.headerColor");
    return this.stripNullStyles({ color });
  }

  foregroundTextStyle() {
    const color = get(this.props.feature, "attributes.foregroundColor");
    return this.stripNullStyles({ color });
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

  wrapUrlValue(url) {
    if (!url) return null;
    return `url(${url})`;
  }

  attribute(name) {
    return get(this.props.feature, `attributes.${name}`);
  }

  hasAttribute(attribute) {
    return !isEmpty(this.attribute(attribute));
  }

  hasLink() {
    return this.hasAttribute("linkText") && this.hasAttribute("linkUrl");
  }

  showSignUpButton() {
    return this.attribute("includeSignUp") && !this.props.authenticated;
  }

  hasForeground() {
    return this.hasAttribute("foregroundStyles.original");
  }

  header(formatted = true) {
    if (!formatted) return this.attribute("header");
    return this.attribute("headerFormatted") || this.attribute("header");
  }

  subheader(formatted = true) {
    if (!formatted) return this.attribute("subheader");
    return this.attribute("subheaderFormatted") || this.attribute("subheader");
  }

  body(formatted = true) {
    if (!formatted) return this.attribute("body");
    return this.attribute("bodyFormatted") || this.attribute("body");
  }

  isLightStyle() {
    return this.style() === "light";
  }

  isDarkStyle() {
    const style = this.style();
    return style === "dark" || isEmpty(style);
  }

  style() {
    return this.attribute("style");
  }

  wrapperClass() {
    return classNames("feature", {
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
            <h1
              style={this.headerStyle()}
              className="heading-primary"
              dangerouslySetInnerHTML={{ __html: this.header() }}
            />
            {this.subheader() && (
              <h2
                style={this.headerStyle()}
                className="heading-secondary"
                dangerouslySetInnerHTML={{ __html: this.subheader() }}
              />
            )}
            <div
              style={this.foregroundTextStyle()}
              className="feature-body"
              dangerouslySetInnerHTML={{ __html: this.body() }}
            />
            <div className="splash-content" />
            <div className="feature__buttons utility-button-group utility-button-group--inline">
              {this.hasLink() ? (
                <a
                  href={this.attribute("linkUrl")}
                  target="blank"
                  className="utility-button"
                >
                  <span
                    className={classNames(
                      "utility-button__text",
                      "utility-button__text--large",
                      {
                        "utility-button__text--dark-green": this.isLightStyle(),
                        "utility-button__text--light": this.isDarkStyle()
                      }
                    )}
                  >
                    {this.attribute("linkText")}
                  </span>
                </a>
              ) : null}
              {this.showSignUpButton() ? (
                <span
                  onClick={this.handleSignUp}
                  target="blank"
                  className="utility-button"
                  role="button"
                  tabIndex="0"
                >
                  <span
                    className={classNames(
                      "utility-button__text",
                      "utility-button__text--large",
                      {
                        "utility-button__text--dark-green": this.isLightStyle(),
                        "utility-button__text--light": this.isDarkStyle()
                      }
                    )}
                  >
                    {"Sign Up"}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
