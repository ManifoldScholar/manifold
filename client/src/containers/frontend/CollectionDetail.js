import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import fakeData from 'helpers/fakeData';
import {
  Utility,
  ResourceCollection
} from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, collectionsAPI } from 'api';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class CollectionDetailContainer extends PureComponent {

  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const {
      showProjectDetail,
      showCollectionDetail,
      collectionResources,
      slideshowResources
    } = requests;
    const projectRequest =
        request(projectsAPI.show(params.id), showProjectDetail);
    const collectionRequest =
      request(collectionsAPI.show(params.collectionId), showCollectionDetail);
    const resourcesRequest =
      request(
        collectionsAPI.resources(params.collectionId, { }, { number: page }),
        [collectionResources, slideshowResources]
      );

    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(collectionRequest);
    const { promise: three } = dispatch(resourcesRequest);
    return Promise.all([one, two, three]);
  }

  static mapStateToProps(state) {
    const props = {
      project: select(requests.showProjectDetail, state.entityStore),
      collection: select(requests.showCollectionDetail, state.entityStore),
      collectionResources: select(requests.collectionResources, state.entityStore),
      slideshowResources: select(requests.slideshowResources, state.entityStore),
      collectionResourcesMeta: meta(requests.collectionResources, state.entityStore),
      slideshowResourcesMeta: meta(requests.slideshowResources, state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object
  };

  constructor() {
    super();
    this.pageChangeHandlerCreator = this.pageChangeHandlerCreator.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event, page) {
    const cId = this.props.collection.id;
    const pagination = { number: page };
    const filter = { };
    const action =
      request(collectionsAPI.resources(cId, filter, pagination), requests.collectionResources);
    this.props.dispatch(action);
  }

  pageChangeHandlerCreator(page) {
    return (event) => {
      this.handlePageChange(event, page);
    };
  }

  render() {
    const project = this.props.project;
    const collection = this.props.collection;
    if (!project && !collection) return null;
    return (
      <div>
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={`/browse/project/${project.id}`}
            title={project.attributes.title}
          />
        </section>
        { this.props.slideshowResources && this.props.collectionResources ?
          <ResourceCollection.Detail
            project={this.props.project}
            slideshowResources={this.props.slideshowResources}
            slideshowPagination={this.props.slideshowResourcesMeta.pagination}
            collectionResources={this.props.collectionResources}
            collectionPagination={this.props.collectionResourcesMeta.pagination}
            collectionPaginationHandler={this.pageChangeHandlerCreator}
            resourceCollection={this.props.collection}

          />
        : null }
        <section className="bg-neutral05">
          <Utility.BackLinkSecondary
            link={`/browse/project/${project.id}`}
            title={project.attributes.title}
          />
        </section>
      </div>
    );
  }
}

const CollectionDetail = connect(
    CollectionDetailContainer.mapStateToProps
)(CollectionDetailContainer);

export default CollectionDetail;
