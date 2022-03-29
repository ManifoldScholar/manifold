import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FocusTrap from "focus-trap-react";
import { UIDConsumer } from "react-uid";
import Utility from "global/components/utility";
import CloseButton from "global/components/Overlay/Close";
import { withRouter } from "react-router-dom";
import Interface from "./Interface";

import BodyClass from "hoc/BodyClass";

class Overlay extends Component {
  static propTypes = {
    hideSignInUpOverlay: PropTypes.func,
    authentication: PropTypes.object,
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const t = this.props.t;
    return (
      <BodyClass className={"no-scroll"}>
        <UIDConsumer>
          {id => (
            <div
              className="overlay-login"
              role="dialog"
              aria-modal
              aria-labelledby={id}
            >
              <FocusTrap
                focusTrapOptions={{
                  onDeactivate: this.props.hideSignInUpOverlay
                }}
              >
                <div className="overlay-header">
                  <div className="overlay-header__inner">
                    <figure className="overlay-header__logo" aria-hidden="true">
                      <Utility.IconComposer size={26} icon="manifoldLogo32" />
                    </figure>
                    <h1 id={id} className="screen-reader-text">
                      {t("forms.signin_overlay.sr_title")}
                    </h1>
                    <CloseButton onClick={this.props.hideSignInUpOverlay} />
                  </div>
                </div>
                <div className="overlay-content focus">
                  <div className="container">
                    <div className="inner login-form">
                      <Interface {...this.props} />
                    </div>
                  </div>
                </div>
              </FocusTrap>
            </div>
          )}
        </UIDConsumer>
      </BodyClass>
    );
  }
}

export default withTranslation()(withRouter(Overlay));
