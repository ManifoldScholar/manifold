import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/with-filtered-lists";

const { request, flush } = entityStoreActions;

const perPage = 20;

class ProjectsListContainerImplementation extends PureComponent {
  static displayName = "Projects.List";

  static mapStateToProps = state => {
    return {
      projects: select(requests.beProjects, state.entityStore),
      projectsMeta: meta(requests.beProjects, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    projects: PropTypes.array,
    dispatch: PropTypes.func,
    projectsMeta: PropTypes.object,
    authentication: PropTypes.object,
    savedSearchPaginationState: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  componentDidMount() {
    const pagination = this.props.savedSearchPaginationState("projectsList");
    const page = pagination ? pagination.number : 1;
    this.fetchProjects(page, true);
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) {
      return this.fetchProjects();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProjects));
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchProjects(page = 1, doNotSnapshot = false) {
    const listKey = "projectsList";
    const filters = this.filterParams();
    const pagination = { number: page, size: perPage };
    if (!doNotSnapshot) this.props.saveSearchState(listKey, pagination);
    const projectsRequest = request(
      projectsAPI.index(filters, pagination),
      requests.beProjects
    );
    this.props.dispatch(projectsRequest);
  }

  filterParams(additionalParams = {}) {
    const filterState = this.props.entitiesListSearchParams.projectsList || {};
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

  render() {
    if (!this.props.projectsMeta) return null;
    const { totalCount } = this.props.projectsMeta.pagination;
    const label = totalCount > 1 || totalCount === 0 ? " Projects" : " Project";

    return (
      <Layout.BackendPanel>
        {this.props.projects && this.props.projectsMeta ? (
          <EntitiesList
            entityComponent={ProjectRow}
            listStyle="grid"
            title={label}
            titleStyle="bar"
            titleIcon="BEProject64"
            entities={this.props.projects}
            unit="project"
            pagination={this.props.projectsMeta.pagination}
            showCountInTitle
            showCount
            callbacks={{
              onPageClick: this.updateHandlerCreator
            }}
            search={
              <Search {...this.props.entitiesListSearchProps("projectsList")} />
            }
            buttons={[
              <Button
                path={lh.link("backendProjectsNew")}
                text="Add a new project"
                authorizedFor="project"
                type="add"
              />
            ]}
          />
        ) : null}
      </Layout.BackendPanel>
    );
  }
}

export const ProjectsListContainer = withFilteredLists(
  ProjectsListContainerImplementation,
  {
    projectsList: projectFilters({ snapshotState: true })
  }
);
export default connectAndFetch(ProjectsListContainer);
