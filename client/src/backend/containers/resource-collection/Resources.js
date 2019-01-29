import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import List from "backend/components/list";
import Resourceish from "frontend/components/resourceish";
import FormattedDate from "global/components/FormattedDate";
import { resourceCollectionsAPI, projectsAPI, requests } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import find from "lodash/find";
import lh from "helpers/linkHandler";
import classnames from "classnames";

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

  buildResourceItem = props => {
    const resource = props.entity;
    if (!resource) return null;

    const classes = classnames({
      "boolean-primary": true,
      checked: this.isInCollection(resource)
    });

    return (
      <li>
        <Link to={lh.link("backendResource", resource.id)}>
          <header>
            <figure className="cover">
              <Resourceish.Thumbnail
                key={resource.id}
                resourceish={resource}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span
                  dangerouslySetInnerHTML={{
                    __html: resource.attributes.titleFormatted
                  }}
                />
                <span className="subtitle">
                  <FormattedDate
                    format="MMMM DD, YYYY"
                    date={resource.attributes.createdAt}
                  />
                </span>
              </h3>
            </div>
          </header>
        </Link>
        <div className="form-input utility">
          <div className="toggle-indicator">
            {/* Add .checked to .boolean-primary to change visual state */}
            <div
              onClick={event => this.handleSelect(event, resource)}
              className={classes}
              role="button"
              tabIndex="0"
            >
              {this.isInCollection(resource) ? (
                <span className="screen-reader-text">
                  {`Remove Resource from Collection`}
                </span>
              ) : (
                <span className="screen-reader-text">
                  {`Add Resource to Collection`}
                </span>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  };

  render() {
    if (!this.props.resources) return null;
    const toggleLabel = this.state.filter.resourceCollection
      ? "Show all"
      : "Show collection only";
    const project = this.props.resourceCollection.relationships.project;
    const collectionFilter = {
      options: [this.props.resourceCollection.id],
      labels: {}
    };
    collectionFilter.labels[this.props.resourceCollection.id] = "In Collection";

    return (
      <section className="collection-resources-list">
        <div>
          <header className="section-heading-secondary">
            <h3>Resources</h3>
          </header>
          <button
            onClick={this.toggleCollectionOnly}
            className="button-bare-primary"
          >
            {toggleLabel}
          </button>
          <List.Searchable
            entities={this.props.resources}
            singularUnit="resource"
            pluralUnit="resources"
            pagination={this.props.resourcesMeta.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            paginationClass="secondary"
            entityComponent={this.buildResourceItem}
            filterChangeHandler={this.handleFilterChange}
            filterOptions={{
              tag: project.attributes.resourceTags,
              kind: project.attributes.resourceKinds
            }}
          />
        </div>
      </section>
    );
  }
}

export default connect(ResourceCollectionResourcesContainer.mapStateToProps)(
  ResourceCollectionResourcesContainer
);
