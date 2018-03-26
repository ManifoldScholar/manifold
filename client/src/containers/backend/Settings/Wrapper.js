import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectIfNoChildRouteMatches } from "helpers/router";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendSettingsGeneral"),
        label: "General",
        key: "general"
      },
      { path: lh.link("backendSettingsTheme"), label: "Theme", key: "theme" },
      {
        path: lh.link("backendSettingsIntegrations"),
        label: "Integrations",
        key: "integrations"
      },
      {
        path: lh.link("backendSettingsSubjects"),
        label: "Subjects",
        key: "subjects"
      },
      {
        path: lh.link("backendSettingsEmail"),
        label: "Email",
        key: "email"
      }
    ];
  }

  render() {
    return (
      <HigherOrder.Authorize
        entity="settings"
        failureFatalError={{
          detail: "You are not allowed to update settings."
        }}
        ability="update"
      >
        <RedirectIfNoChildRouteMatches
          route={this.props.route}
          to={lh.link("backendSettingsGeneral")}
        />

        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </aside>
            <div className="panel">{childRoutes(this.props.route)}</div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(SettingsWrapperContainer.mapStateToProps)(
  SettingsWrapperContainer
);
