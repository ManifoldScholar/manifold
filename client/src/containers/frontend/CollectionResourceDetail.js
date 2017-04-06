import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Resource, Utility } from 'components/frontend';
import { linkHelpers as lh } from 'routes';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { collectionsAPI, requests } from 'api';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

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
      requests.feCollectionResource
    );
    const { promise: one } = dispatch(collectionAction);
    const { promise: two } = dispatch(collectionResourceAction);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    const props = {
      collection: select(requests.feCollection, state.entityStore),
      collectionResource: select(requests.feCollectionResource, state.entityStore)
    };
    return props;
  }

  static propTypes = {
    resource: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feCollection));
    this.props.dispatch(flush(requests.feCollectionResource));
  }

  projectUrl() {
    const pid = this.props.collection.attributes.projectId;
    return lh.frontendProjectResources(pid);
  }

  collectionUrl() {
    const cid = this.props.collection.id;
    const pid = this.props.collection.attributes.projectId;
    return lh.frontendProjectCollection(pid, cid);
  }

  resourceUrl() {
    const cid = this.props.collection.id;
    const pid = this.props.collection.attributes.projectId;
    const crid = this.props.collectionResource.id;
    return lh.frontendProjectCollectionCollectionResource(pid, cid, crid);
  }

  render() {
    if (!this.props.collectionResource) return null;
    if (!this.props.collection) return null;

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
            projectUrl={this.projectUrl()}
            resourceUrl={this.resourceUrl()}
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
