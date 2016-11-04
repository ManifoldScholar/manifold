import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProjectList, Dashboard as DashboardComponents } from 'components/backend';
import { Link } from 'react-router';

class DashboardContainer extends Component {

  static propTypes = {
  };


  render() {
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
                <DashboardComponents.Notifications />

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
