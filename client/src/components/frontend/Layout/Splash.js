import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import classnames from "classnames";

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

  constructor() {
    super();
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(event) {
    event.preventDefault();
    this.props.toggleSignInUpOverlay();
  }

  isPreview(props) {
    return props.preview || false;
  }

  feature(props) {
    return props.feature;
  }

  foregroundPosition(props) {
    const feature = this.feature(props);
    const raw = get(feature, "attributes.foregroundPosition");
    if (this.isPreview(props)) return raw * 0.6666;
    return raw;
  }

  foregroundTopPadding(props) {
    const feature = this.feature(props);
    const raw = get(feature, "attributes.foregroundTopPadding");
    if (this.isPreview(props)) return raw * 0.6666;
    return raw;
  }

  render() {
    const feature = this.feature(this.props);
    if (!feature) return null;
    const attr = feature.attributes;
    const hasBackground = !isEmpty(get(attr, "backgroundStyles.original"));
    const hasForeground = !isEmpty(get(attr, "foregroundStyles.original"));
    const isPreview = this.isPreview(this.props);
    const foregroundPosition = this.foregroundPosition(this.props);
    const foregroundTopPadding = this.foregroundTopPadding(this.props);

    let backgroundStyles = {};
    if (hasBackground) {
      backgroundStyles = {
        backgroundImage: `url(${get(
          feature,
          "attributes.backgroundStyles.original"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "right bottom"
      };
    }

    const foregroundStyles = {};
    if (hasForeground) {
      foregroundStyles.bottom = foregroundPosition;
    }

    const wrapperClass = classnames({
      "bg-accent-primary": attr.style !== "light",
      "bg-accent-secondary": attr.style === "light",
      "splash-preview": isPreview
    });

    const splashStyles = {};
    if (foregroundTopPadding) {
      splashStyles.paddingTop = foregroundTopPadding;
    }

    const splashClasses = classnames("splash-50");

    const header = isPreview ? attr.header : attr.headerFormatted;
    const subheader = isPreview ? attr.subheader : attr.subheaderFormatted;
    const body = isPreview ? attr.body : attr.bodyFormatted;

    return (
      <section className={wrapperClass} style={backgroundStyles}>
        <div className="container rel">
          <div className={splashClasses} style={splashStyles}>
            <div className="left">
              <h2
                className="heading-primary"
                dangerouslySetInnerHTML={{ __html: header }}
              />
              <h3
                className="heading-secondary"
                dangerouslySetInnerHTML={{ __html: subheader }}
              />
              <p
                className="splash-body"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              <div className="splash-content" />
              {feature.attributes.linkUrl && feature.attributes.linkText
                ? <nav className="buttons">
                    <a
                      href={feature.attributes.linkUrl}
                      target="blank"
                      className="button-bare-primary"
                    >
                      {feature.attributes.linkText}
                    </a>
                    {!this.props.authenticated && feature.attributes.linkUrl
                      ? <a
                          href="#"
                          onClick={this.handleSignUp}
                          target="blank"
                          className="button-bare-primary"
                        >
                          {"Sign Up"}
                        </a>
                      : null}
                  </nav>
                : null}
            </div>
            <figure className="right">
              {hasForeground
                ? <img
                    style={foregroundStyles}
                    src={get(attr, "foregroundStyles.original")}
                    alt={attr.header}
                  />
                : null}
            </figure>
          </div>
        </div>
      </section>
    );
  }
}
