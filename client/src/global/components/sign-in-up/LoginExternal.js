import React, { Component } from "react";
import PropTypes from "prop-types";
import { get, values } from "lodash";
import Oauth from "./oauth";

export default class LoginExternal extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  get customOAuthButtons() {
    return this.customOAuthProviders.map(provider => (
      <Oauth.Button
        dispatch={this.props.dispatch}
        provider={provider.name}
        hasIcon={false}
      >
        Log in with {provider.descriptiveName}
      </Oauth.Button>
    ));
  }

  get customOAuthProviders() {
    return values(get(this.props, "settings.attributes.oauth")).filter(
      provider => provider.custom
    );
  }

  render() {
    return (
      <section className="login-external">
        <Oauth.Monitor dispatch={this.props.dispatch} />
        <Oauth.Button dispatch={this.props.dispatch} provider="facebook">
          <span>Log in with Facebook</span>
        </Oauth.Button>
        <Oauth.Button
          dispatch={this.props.dispatch}
          provider="google"
          iconName="manicon-envelope"
        >
          <span>Log in with Google</span>
        </Oauth.Button>
        <Oauth.Button dispatch={this.props.dispatch} provider="twitter">
          <span>Log in with Twitter</span>
        </Oauth.Button>
        {this.customOAuthButtons}
      </section>
    );
  }
}
