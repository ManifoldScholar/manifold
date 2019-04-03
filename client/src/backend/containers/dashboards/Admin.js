import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import DashboardComponents from "backend/components/dashboard";
import Layout from "backend/components/layout";
import { select, meta } from "utils/entityUtils";
import isEqual from "lodash/isEqual";
import { projectsAPI, statisticsAPI, requests } from "api";
import Authorization from "helpers/authorization";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/with-filtered-lists";
import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

const perPage = 10;

class DashboardsAdminContainerImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      statistics: select(requests.beStats, state.entityStore),
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      recentProjects: select(requests.beRecentProjects, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    statistics: PropTypes.object,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    recentProjects: PropTypes.array,
    authentication: PropTypes.object,
    entitiesListSearchProps: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  componentDidMount() {
    const pagination = this.props.savedSearchPaginationState("projects");
    const page = pagination ? pagination.number : 1;
    this.fetchProjects(page);
    this.fetchRecentProjects();
    this.fetchStats();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchProjects();
  }

  fetchProjects(page = 1) {
    const listKey = "projects";
    const filters = this.filterParams(listKey);
    const pagination = { number: page, size: perPage };
    this.props.saveSearchState(listKey, pagination);
    const projectsRequest = request(
      projectsAPI.index(filters, pagination),
      requests.beProjects
    );
    this.props.dispatch(projectsRequest);
  }

  fetchRecentProjects() {
    const recentProjectsRequest = request(
      projectsAPI.index(
        this.filterParams(this.props, { order: "updated_at DESC" }),
        { size: 5 }
      ),
      requests.beRecentProjects
    );
    this.props.dispatch(recentProjectsRequest);
  }

  fetchStats() {
    const readStats = this.authorization.authorizeAbility({
      authentication: this.props.authentication,
      entity: "statistics",
      ability: "read"
    });
    if (readStats) {
      const statsRequest = request(statisticsAPI.show(), requests.beStats);
      this.props.dispatch(statsRequest);
    }
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  filterParams(name = null, additionalParams = {}) {
    const filterState = this.props.entitiesListSearchParams[name] || {};
    const out = Object.assign({}, filterState, additionalParams);
    const currentUser = this.props.authentication.currentUser;
    if (!currentUser) return out;
    if (currentUser.attributes.abilities.viewDrafts) return out;
    out.withUpdateAbility = true;
    return out;
  }

  updateHandlerCreator = page => {
    return () => this.fetchProjects(page);
  };

  noProjects = () => {
    const filterState = this.props.entitiesListSearchParams.projects;
    const initialState = this.props.entitiesListSearchParams.initialProjects;

    const createProjects = this.authorization.authorizeAbility({
      authentication: this.props.authentication,
      entity: "project",
      ability: "create"
    });

    if (isEqual(initialState, filterState) && createProjects) {
      return "This Manifold Library is empty. Click the button above to create your first project.";
    }
    return "Sorry, no results were found.";
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
                          {...this.props.entitiesListSearchProps("projects")}
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
export const DashboardsAdminContainer = withFilteredLists(
  DashboardsAdminContainerImplementation,
  {
    projects: projectFilters({ snapshotState: true })
  }
);

export default connectAndFetch(DashboardsAdminContainer);
