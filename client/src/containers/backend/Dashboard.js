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
                <header className="section-heading-secondary">
                  <h3>
                    {'Projects'} <i className="manicon manicon-stack"></i>
                  </h3>
                </header>
                <ProjectList.SearchableList />
              </div>

              <div className="right">
                <header className="section-heading-secondary">
                  <h3>
                    {'Notifications'} <i className="manicon manicon-bugle-small"></i>
                  </h3>
                </header>

                <header className="section-heading-secondary">
                  <h3>
                    {'Activity'} <i className="manicon manicon-pulse-small"></i>
                  </h3>
                </header>
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
