import React, { Component, PropTypes } from 'react';
import { oauthActions } from 'actions';
import { get } from 'lodash';
import { openPopup, providerSetting } from 'utils/oauth';
import HigherOrder from 'containers/global/HigherOrder';

class OauthButton extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    provider: PropTypes.string.isRequired,
    iconName: PropTypes.string,
    children: PropTypes.node,
    hasIcon: PropTypes.bool,
    settings: PropTypes.object
  }

  static defaultProps = {
    hasIcon: true
  }

  openWindow = (event) => {
    this.props.dispatch(oauthActions.prompt(this.props.provider));
  }

  get oauthSettings() {
    const settingsKey = providerSetting(this.props.provider);

    console.log('settingsKey: %s', settingsKey);

    return get(this.props, `settings.attributes.oauth.${settingsKey}`);
  }

  get isEnabled() {
    return get(this, `oauthSettings.enabled`);
  }

  get iconClass() {
    if (this.props.iconName) {
      return this.props.iconName;
    }

    return `manicon-${this.props.provider}`;
  }

  render() {
    console.log('provider %s is enabled? %s', this.props.provider, this.isEnabled);

    if (!this.isEnabled) {
      return null;
    }

    const icon = (this.props.hasIcon ? <i className={`manicon ${this.iconClass}`}></i> : null);

    const label = (this.props.children ?
      this.props.children
      :
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

export default HigherOrder.withSettings(OauthButton);
