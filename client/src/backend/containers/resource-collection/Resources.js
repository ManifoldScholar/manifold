import React, { Component } from "react";
import PropTypes from "prop-types";
import { resourceCollectionsAPI, projectsAPI, requests } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import find from "lodash/find";
import EntitiesList, {
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";

const { request, flush } = entityStoreActions;
const perPage = 5;

export class ResourceCollectionResourcesContainer extends Component {
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
    resourcesMeta: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: {}
    };
  }

  componentDidMount() {
    this.fetchResources(1);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResources));
  }

  get project() {
    return this.props.resourceCollection.relationships.project;
  }

  get tagFilterOptions() {
    const tags = this.project.attributes.resourceTags || [];
    return tags.map(t => ({ label: t, value: t }));
  }

  get kindFilterOptions() {
    const tags = this.project.attributes.resourceKinds || [];
    return tags.map(k => ({ label: k, value: k }));
  }

  fetchResources(page) {
    const pagination = { number: page, size: perPage };
    const projectId = this.props.resourceCollection.relationships.project.id;
    const action = request(
      projectsAPI.resources(projectId, this.state.filter, pagination),
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

  handleFilterChange = filter => {
    const newFilter = filter;
    if (this.state.filter.resourceCollection)
      newFilter.resourceCollection = this.state.filter.resourceCollection;
    this.setState({ filter: newFilter }, () => {
      this.fetchResources(1);
    });
  };

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
    const filter = this.state.filter;
    if (this.state.filter.resourceCollection) {
      delete filter.resourceCollection;
    } else {
      filter.resourceCollection = this.props.resourceCollection.id;
    }
    this.handleFilterChange(filter);
  };

  render() {
    if (!this.props.resources) return null;

    const toggleLabel = this.state.filter.resourceCollection
      ? "Show all"
      : "Show collection only";

    return (
      <EntitiesList
        entityComponent={ResourceRow}
        entityComponentProps={{
          showSwitch: true,
          onSwitchChange: this.handleSelect,
          switchValue: this.isInCollection
        }}
        title={
          <React.Fragment>
            Resources
            <button
              style={{ marginLeft: 8 }}
              onClick={this.toggleCollectionOnly}
              className="button-bare-primary"
            >
              {toggleLabel}
            </button>
          </React.Fragment>
        }
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
            onChange={this.handleFilterChange}
            filters={[
              {
                label: "Tag",
                key: "tag",
                options: this.tagFilterOptions
              },
              {
                label: "Kind",
                key: "kind",
                options: this.kindFilterOptions
              }
            ]}
          />
        }
      />
    );
  }
}

export default connect(ResourceCollectionResourcesContainer.mapStateToProps)(
  ResourceCollectionResourcesContainer
);
