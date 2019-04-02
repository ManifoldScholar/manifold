import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import DashboardComponents from "backend/components/dashboard";
import Layout from "backend/components/layout";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, statisticsAPI, requests } from "api";
import debounce from "lodash/debounce";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";

import Authorize from "hoc/authorize";
import isEqual from "lodash/isEqual";

const { request } = entityStoreActions;

const perPage = 10;

export class DashboardsAdminContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      statistics: select(requests.beStats, state.entityStore),
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      recentProjects: select(requests.beRecentProjects, state.entityStore),
      authentication: state.authentication,
      projectsListSnapshot:
        state.ui.transitory.stateSnapshots.dashboardProjectsList
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    recentProjects: PropTypes.array,
    authentication: PropTypes.object,
    projectsListSnapshot: PropTypes.object.isRequired,
    snapshotCreator: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
    this.authorization = new Authorization();
    this.updateResults = debounce(this.updateResults.bind(this), 250);
  }

  componentDidMount() {
    const projectsRequest = request(
      projectsAPI.index(this.buildFetchFilter(this.props, this.state.filter), {
        number: this.props.projectsListSnapshot.page,
        size: perPage
      }),
      requests.beProjects
    );
    const recentProjectsRequest = request(
      projectsAPI.index(
        this.buildFetchFilter(this.props, { order: "updated_at DESC" }),
        { size: 5 }
      ),
      requests.beRecentProjects
    );
    const statsRequest = request(statisticsAPI.show(), requests.beStats);

    const { promise: one } = this.props.dispatch(projectsRequest);
    const { promise: two } = this.props.dispatch(recentProjectsRequest);
    const promises = [one, two];

    const readStats = this.authorization.authorizeAbility({
      authentication: this.props.authentication,
      entity: "statistics",
      ability: "read"
    });
    if (readStats) {
      const { promise: three } = this.props.dispatch(statsRequest);
      promises.push(three);
    }

    return Promise.all(promises);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldFetch(prevState)) return this.updateResults();
  }

  get defaultFilter() {
    return { order: "updated_at DESC" };
  }

  shouldFetch(prevState) {
    return !isEqual(prevState.filter, this.state.filter);
  }

  initialState(props) {
    return Object.assign({}, { filter: props.projectsListSnapshot.filter });
  }

  buildFetchFilter = (props, base) => {
    const out = Object.assign({}, base);
    const currentUser = props.authentication.currentUser;
    if (!currentUser) return out;
    if (currentUser.attributes.abilities.viewDrafts) return out;
    out.withUpdateAbility = true;
    return out;
  };

  snapshotState(page) {
    const snapshot = { filter: this.state.filter, page };
    this.props.snapshotCreator(snapshot);
  }

  updateResults = (page = 1) => {
    this.snapshotState(page);

    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.index(
        this.buildFetchFilter(this.props, this.state.filter),
        pagination
      ),
      requests.beProjects
    );
    this.props.dispatch(action);
  };

  filterChangeHandler = filter => {
    this.setState({ filter });
  };

  updateHandlerCreator = page => {
    return () => this.updateResults(page);
  };

  resetSearch = () => {
    this.setState({ filter: this.defaultFilter }, this.updateResults);
  };

  noProjects = () => {
    const filters = Object.assign({}, this.state.filter);
    delete filters.order;
    const createProjects = this.authorization.authorizeAbility({
      authentication: this.props.authentication,
      entity: "project",
      ability: "create"
    });

    if (!isEmpty(filters)) return "Sorry, no results were found.";

    if (createProjects)
      return "This Manifold Library is empty. Click the button above to create your first project.";

    return "This Manifold Library is empty. Check back soon.";
  };

  render() {
    return (
      <div>
        <section>
          <div className="container">
            <section className="backend-dashboard">
              <div className="left">
                {this.props.projects && this.props.projectsMeta && (
                  <Layout.DashboardPanel>
                    <EntitiesList
                      entities={this.props.projects}
                      entityComponent={ProjectRow}
                      title="Projects"
                      titleLink={lh.link("backendProjects")}
                      titleIcon="BEProject64"
                      showCountInTitle
                      unit="project"
                      pagination={this.props.projectsMeta.pagination}
                      callbacks={{
                        onPageClick: this.updateHandlerCreator
                      }}
                      emptyMessage={this.noProjects()}
                      search={
                        <Search
                          onChange={this.filterChangeHandler}
                          filter={this.state.filter}
                          reset={this.resetSearch}
                          sortOptions={[
                            { label: "Newest", value: "created_at DESC" },
                            { label: "Oldest", value: "created_at ASC" },
                            {
                              label: "Updated At ASC",
                              value: "updated_at ASC"
                            },
                            {
                              label: "Updated At DESC",
                              value: "updated_at DESC"
                            },
                            { label: "Title ASC", value: "sort_title ASC" },
                            { label: "Title DESC", value: "sort_title DESC" }
                          ]}
                        />
                      }
                      buttons={[
                        <Button
                          path={lh.link("backendProjectsNew")}
                          text="Add a new project"
                          authorizedFor="project"
                          authorizedTo="create"
                          type="add"
                        />
                      ]}
                    />
                  </Layout.DashboardPanel>
                )}
              </div>
              <div className="right">
                {this.props.recentProjects && (
                  <Layout.DashboardPanel>
                    <EntitiesList
                      entities={this.props.recentProjects}
                      entityComponent={ProjectRow}
                      entityComponentProps={{ compact: true }}
                      title="Recently Updated"
                      titleIcon="BEProject64"
                    />
                  </Layout.DashboardPanel>
                )}
                <Authorize entity="statistics" ability={"read"}>
                  <Layout.DashboardPanel icon={"BEActivity64"} title="Activity">
                    <DashboardComponents.Activity
                      statistics={this.props.statistics}
                    />
                  </Layout.DashboardPanel>
                  <Layout.DashboardPanel icon={"lamp64"} title="Statistics">
                    <DashboardComponents.Counts
                      statistics={this.props.statistics}
                    />
                  </Layout.DashboardPanel>
                </Authorize>
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(DashboardsAdminContainer);
