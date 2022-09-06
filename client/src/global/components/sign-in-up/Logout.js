import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { currentUserActions } from "actions";

class Logout extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    }),
    t: PropTypes.func
  };

  static defaultProps = {
    hideOverlay: () => {}
  };

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const action = currentUserActions.logout();
    dispatch(action);
  };

  render() {
    if (!this.props.authentication.authenticated) return null;

    const t = this.props.t;

    return (
      <div style={{ minHeight: 250 }}>
        <form method="post" onSubmit={this.handleLogout}>
          <div>
            {t("forms.signin_overlay.current_user", {
              name: this.props.authentication.currentUser.attributes.fullName
            })}
          </div>
          <input
            className="button-secondary button-secondary--with-room"
            type="submit"
            value={t("forms.signin_overlay.log_out")}
          />
        </form>
      </div>
    );
  }
}

export default withTranslation()(Logout);
