import React, { PureComponent, PropTypes } from 'react';
import { Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { usersAPI } from 'api';
import get from 'lodash/get';

class UsersWrapperContainer extends PureComponent {

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
      { path: "/backend/people", label: "Users", key: "users" },
      { path: "/backend/people/makers", label: "Makers", key: "makers" }
    ];
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  render() {

    return (
      <div>
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
      </div>
    );
  }
}

export default connect(
  UsersWrapperContainer.mapStateToProps
)(UsersWrapperContainer);

