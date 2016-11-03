import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class DashboardContainer extends Component {

  static propTypes = {
  };


  render() {
    return (
      <div className="container">
        <section className="backend-dashboard">
          <div className="left">
            {'ProjectsList'}
          </div>

          <div className="right">
            {'Notifications'}
          </div>
        </section>
      </div>
    )
  }
}

const Dashboard = connect(
  DashboardContainer.mapStateToProps
)(DashboardContainer);

export default Dashboard;
