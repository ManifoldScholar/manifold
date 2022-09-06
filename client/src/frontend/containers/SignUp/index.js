import React, { Component } from "react";
import PropTypes from "prop-types";
import withSettings from "hoc/withSettings";
import connectAndFetch from "utils/connectAndFetch";
import withProjectContext from "hoc/withProjectContext";
import SignInUp from "global/components/sign-in-up";
import get from "lodash/get";

export class SignUpContainer extends Component {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      routing: state.routing
    };
  };

  render() {
    return (
      <section className="bg-neutral05">
        {this.props.projectBackLink}
        <div className="container login-page">
          <div className="login-form">
            <SignInUp.Interface
              authentication={this.props.authentication}
              showLogout
              defaultView="accept-terms"
              settings={this.props.settings}
              dispatch={this.props.dispatch}
              hash={get(this, "props.routing.locationBeforeTransitions.hash")}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default connectAndFetch(
  withSettings(withProjectContext(SignUpContainer))
);
