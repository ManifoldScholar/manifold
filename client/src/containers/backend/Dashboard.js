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
  static fetchData = (getState, dispatch) => {
    const projectsRequest = request(
      projectsAPI.index({ order: "sort_title ASC" }, { size: perPage }),
      requests.beProjects
    );
    const recentProjectsRequest = request(
      projectsAPI.index({ order: "updated_at DESC" }, { size: 2 }),
      requests.beRecentProjects
    );
    const statsRequest = request(statisticsAPI.show(), requests.beStats);
    const { promise: one } = dispatch(projectsRequest);
    const { promise: two } = dispatch(recentProjectsRequest);
    const { promise: three } = dispatch(statsRequest);
    return Promise.all([one, two, three]);
  };

  static mapStateToProps = state => {
    return {
      statistics: select(requests.beStats, state.entityStore),
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      recentProjects: select(requests.beRecentProjects, state.entityStore)
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    recentProjects: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: { order: "title ASC" } };
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
                      initialFilter={{ order: "sort_title ASC" }}
                    />
                  : null}
              </div>

              <div className="right">
                <nav className="vertical-list-primary flush">
                  {this.props.recentProjects
                    ? <List.SimpleList
                        entities={this.props.recentProjects}
                        entityComponent={Project.ListItem}
                        title={"Recently Updated"}
                        icon={"manicon-stack"}
                        listClasses={"flush"}
                      />
                    : null}
                </nav>
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
