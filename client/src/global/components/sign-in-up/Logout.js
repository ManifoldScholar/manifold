import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { currentUserActions } from "actions";
import classNames from "classnames";

class Logout extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    }),
    t: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const action = currentUserActions.logout();
    dispatch(action);
  };

  render() {
    if (!this.props.authentication.authenticated) return null;

    const submitClass = classNames({
      "form-input": true
    });

    const t = this.props.t;

    return (
      <div style={{ minHeight: 250 }}>
        <form method="post" onSubmit={this.handleLogout}>
          <div className="row-1-p">
            {t("forms.signin_overlay.current_user", {
              name: this.props.authentication.currentUser.attributes.fullName
            })}
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.signin_overlay.log_out")}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withTranslation()(Logout);
