import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { List } from "components/backend";
import { Resourceish } from "components/frontend";
import FormattedDate from "components/global/FormattedDate";
import { collectionsAPI, projectsAPI, requests } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import find from "lodash/find";
import lh from "helpers/linkHandler";
import classnames from "classnames";

const { request, flush } = entityStoreActions;
const perPage = 5;

export class CollectionResourcesContainer extends Component {
  static displayName = "Collection.Resources";

  static mapStateToProps = state => {
    return {
      resources: select(requests.beResources, state.entityStore),
      resourcesMeta: meta(requests.beResources, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    collection: PropTypes.object,
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
    const projectId = this.props.collection.relationships.project.id;
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
    const collection = {
      type: "collections",
      id: this.props.collection.id,
      relationships: { resources: { data: adjustedResources } }
    };
    const call = collectionsAPI.update(collection.id, collection);
    const collectionRequest = request(call, requests.beCollectionUpdate);
    this.props.dispatch(collectionRequest);
  }

  handleFilterChange = filter => {
    const newFilter = filter;
    if (this.state.filter.collection)
      newFilter.collection = this.state.filter.collection;
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
        this.props.collection.relationships.resources
      );
    } else if (!this.isInCollection(resource)) {
      this.addToCollection(
        resource,
        this.props.collection.relationships.resources
      );
    } else {
      return null;
    }
  };

  isInCollection = resource => {
    if (!this.props.collection.relationships.resources) return false;
    return !!find(this.props.collection.relationships.resources, cResource => {
      return cResource.id === resource.id;
    });
  };

  toggleCollectionOnly = event => {
    event.preventDefault();
    const filter = this.state.filter;
    if (this.state.filter.collection) {
      delete filter.collection;
    } else {
      filter.collection = this.props.collection.id;
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
    const toggleLabel = this.state.filter.collection
      ? "Show all"
      : "Show collection only";
    const project = this.props.collection.relationships.project;
    const collectionFilter = {
      options: [this.props.collection.id],
      labels: {}
    };
    collectionFilter.labels[this.props.collection.id] = "In Collection";

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

export default connect(CollectionResourcesContainer.mapStateToProps)(
  CollectionResourcesContainer
);
