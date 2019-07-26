import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import withSettings from "hoc/with-settings";
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

  get color() {
    return (
      this.props.bgColor || this.props.settings.attributes.theme.topBarColor
    );
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
    return (
      this.props.label ||
      (this.context.project &&
        this.context.project.standaloneModePressBarText) ||
      this.props.settings.attributes.theme.topBarText
    );
  }

  get pressHeaderMode() {
    const mode = get(this.props.settings, "attributes.theme.topBarMode");
    if (!mode) return "disabled";
    return mode;
  }

  get visible() {
    if (!this.label || !this.url) return false;
    const mode = this.pressHeaderMode;
    if (mode === "enforced") return true;
    if (mode === "enabled" && this.context.isStandalone) return true;
    return false;
  }

  get styles() {
    return {
      backgroundColor: this.color
    };
  }

  render() {
    if (!this.visible) return null;
    return (
      <SetCSSProperty measurement="height" propertyName="--press-header-height">
        <a
          href={this.url}
          rel="noopener noreferrer"
          className="press-header"
          style={this.styles}
        >
          <div className="press-header__inner">
            <span className="press-header__text">{this.label}</span>
          </div>
        </a>
      </SetCSSProperty>
    );
  }
}

export default withSettings(PressHeader);
