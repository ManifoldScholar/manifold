import React, { PureComponent, PropTypes } from 'react';
import { UserList } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { usersAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class UsersWrapperContainer extends PureComponent {

  static displayName = "Users.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
    };
  }

  static propTypes = {
    children: PropTypes.object
  };

  componentDidMount() {
  }

  render() {

    return (
      <div>
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <UserList.Navigation />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <UserList.Navigation />
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

