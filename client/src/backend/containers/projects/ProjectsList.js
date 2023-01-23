import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/withFilteredLists";

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
    entitiesListSearchParams: PropTypes.object,
    t: PropTypes.func
  };

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
    const out = { ...filterState, ...additionalParams };
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
    if (!this.props.projectsMeta || !this.props.projects) return null;
    const { totalCount } = this.props.projectsMeta.pagination;
    const t = this.props.t;

    return (
      <>
        <HeadContent
          title={`${t("titles.projects")} | ${t("common.admin")}`}
          appendDefaultTitle
        />
        <EntitiesList
          entityComponent={ProjectRow}
          listStyle="grid"
          title={t("glossary.project_title_case", { count: totalCount })}
          titleStyle="bar"
          titleIcon="BEProject64"
          entities={this.props.projects}
          unit={t("glossary.project", { count: totalCount })}
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
              text={t("projects.add_button_label")}
              authorizedFor="project"
              type="add"
            />
          ]}
        />
      </>
    );
  }
}

export const ProjectsListContainer = withFilteredLists(
  ProjectsListContainerImplementation,
  {
    projectsList: projectFilters({ snapshotState: true })
  }
);
export default withTranslation()(connectAndFetch(ProjectsListContainer));
