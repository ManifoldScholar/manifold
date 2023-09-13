import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { resourceCollectionsAPI, projectsAPI, requests } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import find from "lodash/find";
import EntitiesList, {
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { resourceFilters } from "hoc/withFilteredLists";
import isNil from "lodash/isNil";

const { request, flush } = entityStoreActions;
const perPage = 5;

class ResourceCollectionResourcesContainerImplementation extends Component {
  static mapStateToProps = state => {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore)
    };
  };

  static displayName = "ResourceCollection.Resources";

  static propTypes = {
    dispatch: PropTypes.func,
    resourceCollection: PropTypes.object,
    resources: PropTypes.array,
    resourcesMeta: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      collectionOnly: false
    };
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchResources();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResources));
  }

  get project() {
    return this.props.project;
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  fetchResources(page = 1) {
    const pagination = { number: page, size: perPage };
    const filters = this.props.entitiesListSearchParams.resources;
    const projectId = this.props.resourceCollection.relationships.project.id;
    const action = request(
      projectsAPI.resources(projectId, filters, pagination),
      requests.beResources
    );
    this.props.dispatch(action);
  }

  updateResources(resources, changeTypeIgnored) {
    const adjustedResources = resources.map(e => {
      return {
        id: e.id,
        type: e.type
      };
    });
    const resourceCollection = {
      type: "resourceCollections",
      id: this.props.resourceCollection.id,
      relationships: { resources: { data: adjustedResources } }
    };
    const call = resourceCollectionsAPI.update(
      resourceCollection.id,
      resourceCollection
    );
    const resourceCollectionRequest = request(
      call,
      requests.beResourceCollectionUpdate
    );
    this.props.dispatch(resourceCollectionRequest);
  }

  handleResourcesPageChange(event, page) {
    this.fetchResources(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleResourcesPageChange(event, page);
    };
  };

  addToCollection(entity, collectionResources) {
    const newEntities = collectionResources.slice(0);
    newEntities.push(entity);
    this.updateResources(newEntities, "select");
  }

  removeFromCollection(entity, collectionResources) {
    const newEntities = collectionResources.filter(compare => {
      return compare.id !== entity.id;
    });
    this.updateResources(newEntities, "remove");
  }

  handleSelect = (event, resource) => {
    event.preventDefault();
    if (this.isInCollection(resource)) {
      this.removeFromCollection(
        resource,
        this.props.resourceCollection.relationships.resources
      );
    } else if (!this.isInCollection(resource)) {
      this.addToCollection(
        resource,
        this.props.resourceCollection.relationships.resources
      );
    } else {
      return null;
    }
  };

  isInCollection = resource => {
    if (!this.props.resourceCollection.relationships.resources) return false;
    return !!find(
      this.props.resourceCollection.relationships.resources,
      cResource => {
        return cResource.id === resource.id;
      }
    );
  };

  toggleCollectionOnly = event => {
    event.preventDefault();
    const { setParam } = this.props.entitiesListSearchProps("resources");
    const params = this.props.entitiesListSearchParams.resources;
    if (params.resourceCollection) {
      setParam({ name: "resourceCollection" }, null);
    } else {
      setParam(
        { name: "resourceCollection" },
        this.props.resourceCollection.id
      );
    }
  };

  render() {
    if (!this.props.resources) return null;
    const params = this.props.entitiesListSearchParams.resources;
    const collectionFilterEnabled = !isNil(params.resourceCollection);
    const t = this.props.t;

    const toggleLabel = collectionFilterEnabled
      ? "resource_collections.show_all_projects"
      : "resource_collections.show_collection_projects";

    return (
      <EntitiesList
        entityComponent={ResourceRow}
        entityComponentProps={{
          showSwitch: true,
          onSwitchChange: this.handleSelect,
          switchValue: this.isInCollection
        }}
        title={t("glossary.resource_title_case_other")}
        titleStyle="bar"
        titleTag="h2"
        titleActions={[
          {
            label: toggleLabel,
            onClick: this.toggleCollectionOnly,
            icon: collectionFilterEnabled ? "circlePlus24" : "circleMinus24"
          }
        ]}
        entities={this.props.resources}
        unit={t("glossary.resource", {
          count: this.props.resourcesMeta?.pagination?.totalCount
        })}
        pagination={this.props.resourcesMeta.pagination}
        showCount
        callbacks={{
          onPageClick: this.pageChangeHandlerCreator
        }}
        search={
          <Search
            {...resourceFilters.dynamicParams(
              this.props.entitiesListSearchProps("resources"),
              this.project
            )}
          />
        }
      />
    );
  }
}

export const ResourceCollectionResourcesContainer = withFilteredLists(
  ResourceCollectionResourcesContainerImplementation,
  {
    resources: resourceFilters.defaultParams()
  }
);

export default withTranslation()(
  connect(ResourceCollectionResourcesContainer.mapStateToProps)(
    ResourceCollectionResourcesContainer
  )
);
