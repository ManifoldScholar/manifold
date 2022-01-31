import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import withSettings from "hoc/withSettings";
import { FrontendModeContext } from "helpers/contexts";
import get from "lodash/get";

class PressHeader extends PureComponent {
  static displayName = "Layout.Header.PressHeader";

  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    bgColor: PropTypes.string,
    settings: PropTypes.object
  };

  static contextType = FrontendModeContext;

  get bgColor() {
    return (
      this.props.bgColor ||
      this.props.settings.attributes.theme.topBarColor ||
      this.props.settings.attributes.theme.accentColor ||
      "#52e3ac" // default $accentPrimary
    );
  }

  get white() {
    return "#ffffff";
  }

  get black() {
    return "#2e2e2e";
  }

  get color() {
    /*
     * Get a contrasting color based on value of `this.bgColor`
     * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
     * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
     */
    let bgColor = this.bgColor;

    // If a leading # is provided, remove it
    if (bgColor.slice(0, 1) === "#") {
      bgColor = bgColor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (bgColor.length === 3) {
      bgColor = bgColor
        .split("")
        .map(hex => hex + hex)
        .join("");
    }

    // Convert to RGB value
    const r = parseInt(bgColor.substr(0, 2), 16);
    const g = parseInt(bgColor.substr(2, 2), 16);
    const b = parseInt(bgColor.substr(4, 2), 16);

    // Get YIQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? this.black : this.white;
  }

  get url() {
    return (
      this.props.url ||
      (this.context.project &&
        this.context.project.standaloneModePressBarUrl) ||
      this.props.settings.attributes.theme.topBarUrl
    );
  }

  get label() {
    const type = this.labelType;
    if (type === "props") return this.propsLabel;
    if (type === "project") return this.projectLabel;
    if (type === "settings") return this.settingsLabel;
    return null;
  }

  get labelType() {
    if (this.props.label) return "props";
    if (this.projectLabel) {
      if (this.isProjectPage || this.isLibraryDisabled || this.isStandaloneMode)
        return "project";
    }
    if (this.settingsLabel) return "settings";
    return null;
  }

  get visible() {
    const labelType = this.labelType;
    if (!labelType) return false;
    if (labelType === "project") return true;
    if (this.isHeaderAlwaysVisible) return true;
    if (this.isHeaderOnlyVisibleInStandaloneMode && this.isStandaloneMode)
      return true;
    return false;
  }

  get propsLabel() {
    return this.props.label;
  }

  get projectLabel() {
    return (
      this.context.project && this.context.project.standaloneModePressBarText
    );
  }

  get settingsLabel() {
    return this.props.settings.attributes.theme.topBarText;
  }

  get pressHeaderMode() {
    const mode = get(this.props.settings, "attributes.theme.topBarMode");
    if (!mode) return "disabled";
    return mode;
  }

  get isHeaderAlwaysVisible() {
    return this.pressHeaderMode === "enforced";
  }

  get isHeaderOnlyVisibleInStandaloneMode() {
    return this.pressHeaderMode === "enabled";
  }

  get isLibraryDisabled() {
    return this.props.settings.attributes.general.libraryDisabled;
  }

  get isProjectPage() {
    return this.context.isProject;
  }

  get isStandaloneMode() {
    return this.context.isStandalone;
  }

  get linked() {
    return Boolean(this.url);
  }

  get styles() {
    return {
      color: this.color,
      backgroundColor: this.bgColor
    };
  }

  render() {
    if (!this.visible) return null;
    const text = (
      <div className="press-header__inner">
        <span className="press-header__text">{this.label}</span>
      </div>
    );

    return (
      <SetCSSProperty measurement="height" propertyName="--press-header-height">
        {this.linked ? (
          <a
            href={this.url}
            rel="noopener noreferrer"
            className="press-header"
            style={this.styles}
          >
            {text}
          </a>
        ) : (
          <span className="press-header" style={this.styles}>
            {text}
          </span>
        )}
      </SetCSSProperty>
    );
  }
}

export default withSettings(PressHeader);
