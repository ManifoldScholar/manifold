import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import {
  List,
  Project,
  Dashboard as DashboardComponents
} from "components/backend";
import { HigherOrder } from "containers/global";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, statisticsAPI, requests } from "api";
import debounce from "lodash/debounce";
import Authorization from "helpers/authorization";

const { request } = entityStoreActions;

const perPage = 5;

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
        { size: 2 }
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

  updateResults(eventIgnored = null, page = 1) {
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
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.updateResults();
    });
  };

  updateHandlerCreator = page => {
    return event => {
      this.updateResults(event, page);
    };
  };

  renderProjectCount = () => {
    if (!this.props.projectsMeta) return null;

    const { totalCount } = this.props.projectsMeta.pagination;
    const label = totalCount > 1 || totalCount === 0 ? "projects" : "project";

    return <span className="list-total">{`${totalCount} ${label}`}</span>;
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
                    <i className="manicon manicon-stack" aria-hidden="true" />
                    {"Projects"} {this.renderProjectCount()}
                  </h3>
                </header>
                {this.props.projects && this.props.projectsMeta ? (
                  <List.Searchable
                    showEntityCount={false}
                    initialFilter={this.state.filter}
                    defaultFilter={{ order: "sort_title ASC" }}
                    entities={this.props.projects}
                    pagination={this.props.projectsMeta.pagination}
                    paginationClickHandler={this.updateHandlerCreator}
                    paginationClass="secondary"
                    entityComponent={Project.ListItem}
                    filterChangeHandler={this.filterChangeHandler}
                  />
                ) : null}
              </div>
              <div className="right">
                <nav className="vertical-list-primary flush">
                  {this.props.recentProjects ? (
                    <List.SimpleList
                      entities={this.props.recentProjects}
                      entityComponent={Project.ListItem}
                      title={"Recently Updated"}
                      icon={"manicon-bugle-small"}
                      listClasses={"flush"}
                    />
                  ) : null}
                </nav>
                <HigherOrder.Authorize entity="statistics" ability={"read"}>
                  <section>
                    <header className="section-heading-secondary">
                      <h3>
                        <i
                          className="manicon manicon-pulse-small"
                          aria-hidden="true"
                        />
                        {"Activity"}{" "}
                      </h3>
                    </header>
                    <DashboardComponents.Activity
                      statistics={this.props.statistics}
                    />
                  </section>
                </HigherOrder.Authorize>
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(DashboardsAdminContainer);
