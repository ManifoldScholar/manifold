import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigation } from "components/backend";
import lh from "helpers/linkHandler";
import { renderRoutes } from "helpers/routing";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      { path: lh.link("backendSettings"), label: "General", key: "general" },
      { path: lh.link("backendSettingsTheme"), label: "Theme", key: "theme" },
      {
        path: lh.link("backendSettingsIntegrations"),
        label: "Integrations",
        key: "integrations"
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
          <div className="panel">
            {renderRoutes(this.props.route.routes)}
          </div>
        </div>
      </section>
    );
  }
}

export default connect(SettingsWrapperContainer.mapStateToProps)(
  SettingsWrapperContainer
);
