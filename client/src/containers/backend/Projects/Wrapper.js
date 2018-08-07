import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { List, Project } from "components/backend";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, statisticsAPI, requests } from "api";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";

const { request } = entityStoreActions;

const perPage = 10;

export class ProjectsWrapper extends PureComponent {

  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      projectsListSnapshot: state.ui.transitory.stateSnapshots.dashboardProjectsList,
      authentication: state.authentication
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    projectsListSnapshot: PropTypes.object.isRequired,
    snapshotCreator: PropTypes.func.isRequired,
    authentication: PropTypes.object
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

    const { promise: one } = this.props.dispatch(projectsRequest);
    const promises = [ one ];

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

  render() {
    if (!this.props.projectsMeta) return null;
    const { totalCount } = this.props.projectsMeta.pagination;
    return (
      <div className="backend-detail">
        <header className="backend-header section-heading-secondary">
          <h1>
            <i className="manicon manicon-stack" aria-hidden="true" />
            <span className="list-total">{totalCount}</span>
            {" Projects"}
          </h1>
        </header>
        <section className="backend-panel">
          <div className="container">
            {this.props.projects && this.props.projectsMeta ? (
              <List.Searchable
                newButton={{
                  path: lh.link("backendProjectsNew"),
                  text: "Add a New Project",
                  authorizedFor: "project"
                }}
                columnarNav={true}
                showEntityCount={false}
                initialFilter={this.state.filter}
                defaultFilter={{ order: "sort_title ASC" }}
                listClassName="grid-list"
                entities={this.props.projects}
                entityComponent={Project.ListItem}
                singularUnit="project"
                pluralUnit="projects"
                pagination={this.props.projectsMeta.pagination}
                paginationClickHandler={this.updateHandlerCreator}
                paginationClass="wide"
                filterChangeHandler={this.filterChangeHandler}
              />
            ) : null}
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ProjectsWrapper);
