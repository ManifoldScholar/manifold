import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { usersAPI } from 'api';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';
import { Route, Switch } from 'react-router-dom';
import { People } from 'containers/backend';
import { renderRoutes } from 'helpers/routing';

export class UsersWrapperContainer extends PureComponent {

  static displayName = "Users.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
    };
  }

  static propTypes = {
    children: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      { path: lh.link("backendPeople"), label: "Users", key: "users" },
      { path: lh.link("backendPeopleMakers"), label: "Makers", key: "makers" }
    ];
  }

  render() {
    return (
      <div>
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks()}
              />
            </aside>
            <div className="panel">
              {renderRoutes(this.props.route.routes)}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  UsersWrapperContainer.mapStateToProps
)(UsersWrapperContainer);

