import React, { Component } from "react";
import PropTypes from "prop-types";
import { oauthActions } from "actions";
import { get } from "lodash";
import { providerSetting } from "utils/oauth";
import IconComposer from "global/components/utility/IconComposer";

import withSettings from "hoc/with-settings";

class Button extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    provider: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    children: PropTypes.node,
    hasIcon: PropTypes.bool,
    settings: PropTypes.object
  };

  static defaultProps = {
    hasIcon: true
  };

  shouldComponentUpdate(nextProps) {
    return this.props.settings !== nextProps.settings;
  }

  get oauthSettings() {
    const settingsKey = providerSetting(this.props.provider);

    return get(this.props, `settings.attributes.oauth.${settingsKey}`);
  }

  get isEnabled() {
    return get(this, `oauthSettings.enabled`);
  }

  get providerTitled() {
    const { provider } = this.props;
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  }

  get iconClass() {
    if (this.props.iconName) {
      return this.props.iconName;
    }

    return `social${this.providerTitled}32`;
  }

  openWindow = eventIgnored => {
    this.props.dispatch(oauthActions.prompt(this.props.provider));
  };

  render() {
    if (!this.isEnabled) {
      return null;
    }

    const icon = this.props.hasIcon ? (
      <IconComposer
        icon={this.iconClass}
        size={26}
        iconClass="button-secondary__icon"
      />
    ) : null;

    const label = this.props.children ? (
      this.props.children
    ) : (
      <span className="button-secondary__text">
        Log in with {this.props.provider}
      </span>
    );

    return (
      <button
        className="button-secondary button-secondary--dark"
        onClick={this.openWindow}
      >
        {icon}
        {label}
      </button>
    );
  }
}

export default withSettings(Button);
