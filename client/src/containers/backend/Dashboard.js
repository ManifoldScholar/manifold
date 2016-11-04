import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList } from 'components/backend';

class DashboardContainer extends Component {

  static propTypes = {
  };


  render() {
    console.log(ProjectList, 'project list!');

    return (
      <div>
        <section>
          <div className="container">
            <section className="backend-dashboard">
              <div className="left">
                <ProjectList.SearchableList />
              </div>

              <div className="right">
                {'Notifications'}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

const Dashboard = connect(
  DashboardContainer.mapStateToProps
)(DashboardContainer);

export default Dashboard;
