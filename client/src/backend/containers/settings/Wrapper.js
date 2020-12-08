import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Navigation from "backend/components/navigation";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

import Authorize from "hoc/authorize";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const secondaryLinks = navigation.settings();

    return (
      <Authorize
        entity="settings"
        failureFatalError={{
          body: "You are not allowed to update settings."
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

export default connect(SettingsWrapperContainer.mapStateToProps)(
  SettingsWrapperContainer
);
