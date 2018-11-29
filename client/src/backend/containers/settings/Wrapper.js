import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Navigation from "backend/components/navigation";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

import Authorize from "hoc/authorize";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const skipId = "skip-to-settings-panel";
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
          <Utility.SkipLink skipId={skipId} />
          <Navigation.Secondary links={secondaryLinks} />
          <div className="backend-detail">
            <div id={skipId} className="panel">
              {childRoutes(this.props.route)}
            </div>
          </div>
        </section>
      </Authorize>
    );
  }
}

export default connect(SettingsWrapperContainer.mapStateToProps)(
  SettingsWrapperContainer
);
