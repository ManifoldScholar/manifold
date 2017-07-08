import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import {
  List,
  Project,
  Dashboard as DashboardComponents
} from "components/backend";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, statisticsAPI, requests } from "api";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

const perPage = 5;

export class DashboardContainer extends PureComponent {
  static fetchData(getState, dispatch) {
    const projectsRequest = request(
      projectsAPI.index({}, { size: perPage }),
      requests.beProjects
    );
    const statsRequest = request(statisticsAPI.show(), requests.beStats);
    const { promise: one } = dispatch(projectsRequest);
    const { promise: two } = dispatch(statsRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      statistics: select(requests.beStats, state.entityStore),
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore)
    };
  }

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object
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
      requests.beProjects
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  }

  updateHandlerCreator(page) {
    return event => {
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
                    {"Projects"} <i className="manicon manicon-stack" />
                  </h3>
                </header>
                {this.props.projects && this.props.projectsMeta
                  ? <List.Searchable
                      newButtonVisible
                      newButtonPath={lh.link("backendProjectsNew")}
                      newButtonText="Add a New Project"
                      entities={this.props.projects}
                      singularUnit="project"
                      pluralUnit="projects"
                      pagination={this.props.projectsMeta.pagination}
                      paginationClickHandler={this.updateHandlerCreator}
                      entityComponent={Project.ListItem}
                      filterChangeHandler={this.filterChangeHandler}
                    />
                  : null}
              </div>

              <div className="right">
                <section>
                  <header className="section-heading-secondary">
                    <h3>
                      {"Notifications"}{" "}
                      <i className="manicon manicon-bugle-small" />
                    </h3>
                  </header>
                  <DashboardComponents.Notifications />
                </section>

                <section>
                  <header className="section-heading-secondary">
                    <h3>
                      {"Activity"} <i className="manicon manicon-pulse-small" />
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

export default connectAndFetch(DashboardContainer);
