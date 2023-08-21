import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { projectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { resourceFilters } from "hoc/withFilteredLists";

const { request } = entityStoreActions;
const perPage = 5;

class ProjectResourcesListContainerImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore)
    };
  };

  static displayName = "Project.ResourcesList";

  static propTypes = {
    project: PropTypes.object,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    dispatch: PropTypes.func,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { filter: {} };
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchResources();
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchResources(page = 1) {
    const pagination = { number: page, size: perPage };
    const filters = this.props.entitiesListSearchParams.resources;
    const action = request(
      projectsAPI.resources(this.props.project.id, filters, pagination),
      requests.beResources
    );
    this.props.dispatch(action);
  }

  handleResourcesPageChange(event, page) {
    this.fetchResources(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleResourcesPageChange(event, page);
    };
  };

  render() {
    if (!this.props.resources) return null;
    const { project, t, resourcesMeta } = this.props;

    return (
      <EntitiesList
        entityComponent={ResourceRow}
        title={t("projects.manage_resources")}
        titleStyle="bar"
        titleTag="h2"
        entities={this.props.resources}
        unit={t("glossary.resource", {
          count: resourcesMeta?.pagination?.totalCount
        })}
        pagination={resourcesMeta.pagination}
        showCount
        callbacks={{
          onPageClick: this.pageChangeHandlerCreator
        }}
        search={
          <Search
            {...resourceFilters.dynamicParams(
              this.props.entitiesListSearchProps("resources"),
              project
            )}
          />
        }
        buttons={[
          <Button
            path={lh.link("backendProjectResourcesNew", project.id)}
            text={t("resources.add_button_label")}
            authorizedFor={project}
            authorizedTo="createResources"
            type="add"
          />,
          <Button
            path={lh.link("backendResourceImport", project.id)}
            text={t("resources.bulk_add_label")}
            authorizedFor={project}
            authorizedTo="createResources"
            icon="BEResourcesBoxes64"
          />
        ]}
      />
    );
  }
}

export const ProjectResourcesListContainer = withFilteredLists(
  ProjectResourcesListContainerImplementation,
  {
    resources: resourceFilters.defaultParams()
  }
);
export default withTranslation()(
  connectAndFetch(ProjectResourcesListContainer)
);
