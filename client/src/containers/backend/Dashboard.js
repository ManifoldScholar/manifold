import React, { Component, PropTypes } from 'react';
import { pagesAPI } from 'api';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { request, flush, requests } = entityStoreActions;

class DashboardContainer extends Component {

  static propTypes = {
  };

  componentWillUnmount() {
  }

  render() {
    return (
      <section>
        <div className="container">
          {'This is the backend dashboard'}
        </div>
      </section>
    )
  }
}

const Dashboard = connect(
  DashboardContainer.mapStateToProps
)(DashboardContainer);

export default Dashboard;
