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
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, {
  resourceCollectionFilters
} from "hoc/withFilteredLists";

const { request } = entityStoreActions;
const perPage = 5;

export class ProjectResourceCollectionsListContainerImplementation extends PureComponent {
  static mapStateToProps = state => {
    return {
      resourceCollections: select(
        requests.beResourceCollections,
        state.entityStore
      ),
      resourceCollectionsMeta: meta(
        requests.beResourceCollections,
        state.entityStore
      )
    };
  };

  static displayName = "Project.CollectionsList";

  static propTypes = {
    project: PropTypes.object,
    resourceCollections: PropTypes.array,
    resourceCollectionsMeta: PropTypes.object,
    dispatch: PropTypes.func,
    entitiesListSearchProps: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  componentDidMount() {
    this.fetchCollections(1);
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchCollections();
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchCollections(page) {
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.resourceCollections(
        this.props.project.id,
        this.props.entitiesListSearchParams.resourceCollections,
        pagination
      ),
      requests.beResourceCollections
    );
    this.props.dispatch(action);
  }

  handleCollectionsPageChange(event, page) {
    this.fetchCollections(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleCollectionsPageChange(event, page);
    };
  };

  render() {
    if (!this.props.resourceCollections) return null;
    const { project, t } = this.props;

    return (
      <EntitiesList
        entityComponent={ResourceCollectionRow}
        title={t("projects.manage_resource_collections")}
        titleStyle="bar"
        titleTag="h2"
        entities={this.props.resourceCollections}
        unit={t("glossary.resource_collection", {
          count: this.props.resourceCollectionsMeta?.pagination?.totalCount
        })}
        pagination={this.props.resourceCollectionsMeta.pagination}
        showCount
        callbacks={{
          onPageClick: this.pageChangeHandlerCreator
        }}
        search={
          <Search
            {...this.props.entitiesListSearchProps("resourceCollections")}
          />
        }
        buttons={[
          <Button
            path={lh.link("backendProjectResourceCollectionsNew", project.id)}
            text={t("resource_collections.add_button_label")}
            authorizedFor={project}
            authorizedTo="createResourceCollections"
            type="add"
          />
        ]}
      />
    );
  }
}

export const ProjectResourceCollectionsListContainer = withFilteredLists(
  ProjectResourceCollectionsListContainerImplementation,
  {
    resourceCollections: resourceCollectionFilters()
  }
);
export default withTranslation()(
  connectAndFetch(ProjectResourceCollectionsListContainer)
);
