import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Settings, Navigation } from 'components/backend';
import { entityStoreActions, notificationActions } from 'actions';
import get from 'lodash/get';

class SettingsWrapperContainer extends PureComponent {

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  createSuccessNotification() {
    const notification = {
      level: 0,
      id: 'SETTINGS_UPDATED',
      heading: "Manifold settings updated",
      body: "Your Manifold settings changes have been applied.",
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleSuccess() {
    this.createSuccessNotification();
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
            {React.cloneElement(this.props.children, { handleSuccess: this.handleSuccess })}
          </div>
        </div>
      </section>
    );
  }

}

export default connect(
  SettingsWrapperContainer.mapStateToProps
)(SettingsWrapperContainer);

