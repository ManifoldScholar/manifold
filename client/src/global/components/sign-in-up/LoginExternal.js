import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { get, values } from "lodash";
import Oauth from "./oauth";

class LoginExternal extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  get customOAuthProviders() {
    return values(get(this.props, "settings.attributes.oauth")).filter(
      provider => provider.custom
    );
  }

  get customOAuthButtons() {
    return this.customOAuthProviders.map(provider => (
      <Oauth.Button
        dispatch={this.props.dispatch}
        provider={provider.name}
        hasIcon={false}
      >
        {this.props.t("forms.signin_overlay.log_in_with_provider", {
          provider: provider.descriptiveName
        })}
      </Oauth.Button>
    ));
  }

  render() {
    return (
      <section className="login-external">
        <Oauth.Monitor dispatch={this.props.dispatch} />
        <Oauth.Button dispatch={this.props.dispatch} provider="facebook">
          <span className="button-secondary__text">
            {this.props.t("forms.signin_overlay.log_in_with_provider", {
              provider: "Facebook"
            })}
          </span>
        </Oauth.Button>
        <Oauth.Button
          dispatch={this.props.dispatch}
          provider="google"
          iconName="socialEmail32"
        >
          <span className="button-secondary__text">
            {this.props.t("forms.signin_overlay.log_in_with_provider", {
              provider: "Google"
            })}
          </span>
        </Oauth.Button>
        <Oauth.Button dispatch={this.props.dispatch} provider="twitter">
          <span className="button-secondary__text">
            {this.props.t("forms.signin_overlay.log_in_with_provider", {
              provider: "Twitter"
            })}
          </span>
        </Oauth.Button>
        {this.customOAuthButtons}
      </section>
    );
  }
}

export default withTranslation()(LoginExternal);
