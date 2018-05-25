import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendSettingsGeneral"),
        label: "General",
        key: "general",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsTheme"),
        label: "Theme",
        key: "theme",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsIntegrations"),
        label: "Integrations",
        key: "integrations",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsSubjects"),
        label: "Subjects",
        key: "subjects",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsEmail"),
        label: "Email",
        key: "email",
        entity: "settings",
        ability: "update"
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
        <RedirectToFirstMatch candidates={this.secondaryNavigationLinks()} />

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
