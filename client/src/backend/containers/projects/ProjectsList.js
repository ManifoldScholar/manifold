import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import Project from "backend/components/project";
import List from "backend/components/list";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";

const { request, flush } = entityStoreActions;

const perPage = 20;

export class ProjectsListContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      projectsListSnapshot: state.ui.transitory.stateSnapshots.projectsList,
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
    const promises = [one];

    return Promise.all(promises);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjects));
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
    const label = totalCount > 1 || totalCount === 0 ? " Projects" : " Project";

    return (
      <div>
        <Layout.ViewHeader icon="stack">
          <span className="list-total">{totalCount}</span>
          {label}
        </Layout.ViewHeader>
        <Layout.BackendPanel>
          {this.props.projects && this.props.projectsMeta ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendProjectsNew"),
                text: "Add a New Project",
                authorizedFor: "project"
              }}
              columnarNav
              showEntityCount={false}
              initialFilter={this.state.filter}
              defaultFilter={{ order: "sort_title ASC" }}
              listClassName="project-list grid"
              entities={this.props.projects}
              entityComponent={Project.ListItem}
              singularUnit="project"
              pluralUnit="projects"
              pagination={this.props.projectsMeta.pagination}
              paginationClickHandler={this.updateHandlerCreator}
              paginationClass="secondary"
              filterChangeHandler={this.filterChangeHandler}
              filterOptions={{
                draft: {
                  options: [true, false],
                  labels: {
                    true: "Show Draft Projects",
                    false: "Hide Draft Projects"
                  }
                }
              }}
              sortOptions={[{ label: "title", value: "sort_title" }]}
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connectAndFetch(ProjectsListContainer);
