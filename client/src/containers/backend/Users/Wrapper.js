import React, { PureComponent, PropTypes } from 'react';
import { Project } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { usersAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class UsersWraperContainer extends PureComponent {

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
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
              </aside>
              <div className="panel">
                {this.props.children}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  UsersWraperContainer.mapStateToProps
)(UsersWraperContainer);

