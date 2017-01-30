import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Settings, Navigation } from 'components/backend';
import get from 'lodash/get';

class SettingsWrapperContainer extends PureComponent {

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  secondaryNavigationLinks() {
    return [
      { path: "/backend/settings", label: "General", key: "general" },
      { path: "/backend/settings/theme", label: "Theme", key: "theme" },
      { path: "/backend/settings/oauth", label: "OAuth", key: "oauth" },
      { path: "/backend/settings/features", label: "Features", key: "features" }
    ];
  }

  render() {
    return (
      <section className="backend-panel">
        <aside className="scrollable">
          <div className="wrapper">
            <Navigation.Secondary
              links={this.secondaryNavigationLinks()}
              active={this.activeChild()}
            />
          </div>
        </aside>
        <div className="container">
          <aside className="aside">
            <Navigation.Secondary
              links={this.secondaryNavigationLinks()}
              active={this.activeChild()}
            />
          </aside>
          <div className="panel">
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }

}

export default connect(
  SettingsWrapperContainer.mapStateToProps
)(SettingsWrapperContainer);

