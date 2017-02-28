import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { collectionsAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class CollectionResourceDetailContainer extends PureComponent {
  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const collectionFetch = collectionsAPI.show(params.collectionId);
    const collectionResourceFetch = collectionsAPI.collectionResource(
      params.collectionId,
      params.collectionResourceId
    );
    const collectionAction = request(collectionFetch, requests.feCollection);
    const collectionResourceAction = request(
      collectionResourceFetch,
      requests.feCollectionResources
    );
    const { promise: one } = dispatch(collectionAction);
    const { promise: two } = dispatch(collectionResourceAction);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const props = {
      collection: select(requests.feCollection, state.entityStore),
      collectionResource: select(requests.feCollectionResources, state.entityStore)
    };
    return props;
  }

  static propTypes = {
    project: PropTypes.object,
    resource: PropTypes.object
  };

  collectionUrl() {
    const cid = this.props.collection.id;
    const pid = this.props.collection.relationships.project.id;
    return `/browse/project/${pid}/collection/${cid}`;
  }

  render() {
    return (
      <div>
        {this.props.collection ?
          <Utility.BackLinkPrimary
            backText="Back to Collection"
            link={this.collectionUrl()}
            title={this.props.collection.attributes.title}
          /> : null
        }
        {this.props.collectionResource ?
          <Resource.Detail
            projectId={this.props.params.id}
            resource={this.props.collectionResource.relationships.resource}
          /> : null
        }
        {this.props.collection ?
          <section className="bg-neutral05">
            <Utility.BackLinkSecondary
              link={this.collectionUrl()}
              backText="Back to Collection"
            />
          </section> : null
        }

      </div>
    );
  }
}

const CollectionResourceDetail = connect(
  CollectionResourceDetailContainer.mapStateToProps
)(CollectionResourceDetailContainer);

export default CollectionResourceDetail;
