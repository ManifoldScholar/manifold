import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Navigation from "backend/components/navigation";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

import Authorize from "hoc/Authorize";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const secondaryLinks = navigation.settings();

    return (
      <Authorize
        entity="settings"
        failureFatalError={{
          body: this.props.t("settings.unauthorized")
        }}
        ability="update"
      >
        <RedirectToFirstMatch
          from={lh.link("backendSettings")}
          candidates={secondaryLinks}
        />

        <section>
          <Navigation.Secondary links={secondaryLinks} />
          <main id="skip-to-main" className="backend-detail">
            <div className="panel">{childRoutes(this.props.route)}</div>
          </main>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(
  connect(SettingsWrapperContainer.mapStateToProps)(SettingsWrapperContainer)
);
