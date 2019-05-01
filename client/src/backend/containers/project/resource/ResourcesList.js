import React, { PureComponent } from "react";
import PropTypes from "prop-types";
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
import withFilteredLists, { resourceFilters } from "hoc/with-filtered-lists";

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
    dispatch: PropTypes.func
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
    const project = this.props.project;

    return (
      <EntitiesList
        entityComponent={ResourceRow}
        title="Resources"
        titleIcon="resourceCollection64"
        entities={this.props.resources}
        unit="resource"
        pagination={this.props.resourcesMeta.pagination}
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
            text="Add a new resource"
            authorizedFor={project}
            authorizedTo="createResources"
            type="add"
          />,
          <Button
            path={lh.link("backendResourceImport", project.id)}
            text="Bulk add resources"
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
export default connectAndFetch(ProjectResourcesListContainer);
