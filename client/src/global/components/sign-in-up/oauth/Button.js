import React, { Component } from "react";
import PropTypes from "prop-types";
import { oauthActions } from "actions";
import { get } from "lodash";
import { providerSetting } from "utils/oauth";

import withSettings from "hoc/with-settings";

class Button extends Component {
  static defaultProps = {
    hasIcon: true
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    provider: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    children: PropTypes.node,
    hasIcon: PropTypes.bool,
    settings: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return this.props.settings !== nextProps.settings;
  }

  get iconClass() {
    if (this.props.iconName) {
      return this.props.iconName;
    }

    return `manicon-${this.props.provider}`;
  }

  get isEnabled() {
    return get(this, `oauthSettings.enabled`);
  }

  get oauthSettings() {
    const settingsKey = providerSetting(this.props.provider);

    return get(this.props, `settings.attributes.oauth.${settingsKey}`);
  }

  openWindow = eventIgnored => {
    this.props.dispatch(oauthActions.prompt(this.props.provider));
  };

  render() {
    if (!this.isEnabled) {
      return null;
    }

    const icon = this.props.hasIcon ? (
      <i className={`manicon ${this.iconClass}`} aria-hidden="true" />
    ) : null;

    const label = this.props.children ? (
      this.props.children
    ) : (
      <span>Log in with {this.props.provider}</span>
    );

    return (
      <button className="button-secondary-dark" onClick={this.openWindow}>
        {icon}
        {label}
      </button>
    );
  }
}

export default withSettings(Button);
