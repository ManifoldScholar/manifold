import React, { Component, PropTypes } from 'react';
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

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class CollectionDetailContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const collectionRequest =
      request(collectionsAPI.show(params.collectionId), requests.showCollectionDetail);
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(collectionRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore),
      collection: select(requests.showCollectionDetail, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    collection: PropTypes.object
  };

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
        <ResourceCollection.Detail
          project={this.props.project}
          resourceCollection={this.props.collection}
        />
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
