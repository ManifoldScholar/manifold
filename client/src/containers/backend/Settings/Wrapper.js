import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const skipId = "skip-to-settings-panel";
    const secondaryLinks = navigation.settings();

    return (
      <HigherOrder.Authorize
        entity="settings"
        failureFatalError={{
          detail: "You are not allowed to update settings."
        }}
        ability="update"
      >
        <RedirectToFirstMatch
          from={lh.link("backendSettings")}
          candidates={secondaryLinks}
        />

        <section className="backend-panel">
          <Utility.SkipLink skipId={skipId} />
          <Navigation.Secondary links={secondaryLinks} />
          <div className="container">
            <div id={skipId} className="panel">
              {childRoutes(this.props.route)}
            </div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(SettingsWrapperContainer.mapStateToProps)(
  SettingsWrapperContainer
);
