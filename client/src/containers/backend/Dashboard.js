import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { List, Project, Dashboard as DashboardComponents } from 'components/backend';
import { Link } from 'react-router';
import { entityUtils } from 'utils';
import projectsAPI from 'api/projects';
import statsAPI from 'api/statistics';
import debounce from 'lodash/debounce';

const { select, meta } = entityUtils;
const { request, requests } = entityStoreActions;

const perPage = 5;

class DashboardContainer extends PureComponent {

  static fetchData(getState, dispatch) {
    const state = getState();
    const projectsRequest =
      request(projectsAPI.index({}, { size: perPage }), requests.backendDashboardProjects);
    const statsRequest =
      request(statsAPI.show(), requests.backendDashboardStats);
    const { promise: one } = dispatch(projectsRequest);
    const { promise: two } = dispatch(statsRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      statistics: select(requests.backendDashboardStats, state.entityStore),
      projects: select(requests.backendDashboardProjects, state.entityStore),
      projectsMeta: meta(requests.backendDashboardProjects, state.entityStore)
    };
  }

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
    this.updateHandlerCreator = this.updateHandlerCreator.bind(this);
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  updateResults(event = null, page = 1) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(this.state.filter, pagination),
      requests.backendDashboardProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  }

  updateHandlerCreator(page) {
    return (event) => {
      this.updateResults(event, page);
    };
  }

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
                { this.props.projects && this.props.projectsMeta ?
                  <List.Searchable
                    newButtonVisible
                    newButtonPath="/backend/project/new"
                    newButtonText="Add a New Project"
                    entities={this.props.projects}
                    singularUnit="project"
                    pluralUnit="projects"
                    pagination={this.props.projectsMeta.pagination}
                    paginationClickHandler={this.updateHandlerCreator}
                    entityComponent={Project.ListItem}
                    filterChangeHandler={this.filterChangeHandler}
                  />
                  : null
                }

              </div>

              <div className="right">
                <section>
                  <header className="section-heading-secondary">
                    <h3>
                      {'Notifications'} <i className="manicon manicon-bugle-small"></i>
                    </h3>
                  </header>
                  <DashboardComponents.Notifications />
                </section>

                <section>
                  <header className="section-heading-secondary">
                    <h3>
                      {'Activity'} <i className="manicon manicon-pulse-small"></i>
                    </h3>
                  </header>
                  <DashboardComponents.Activity
                    statistics={this.props.statistics}
                  />
                </section>
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
