import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Link } from 'react-router-dom';
import { Resource, Utility } from 'components/frontend';
import { HigherOrder } from 'components/global';
import lh from 'helpers/linkHandler';
import { entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { collectionsAPI, requests } from 'api';

const { request, flush } = entityStoreActions;

class CollectionResourceDetailContainer extends PureComponent {
  static fetchData(getState, dispatch, location, match) {
    const page = match.params.page ? match.params.page : 1;
    const collectionFetch = collectionsAPI.show(match.params.collectionId);
    const collectionResourceFetch = collectionsAPI.collectionResource(
      match.params.collectionId,
      match.params.collectionResourceId
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
    return lh.link("frontendProjectResources", pid);
  }

  collectionUrl() {
    const cid = this.props.collection.id;
    const pid = this.props.collection.attributes.projectId;
    return lh.link("frontendProjectCollection", pid, cid);
  }

  resourceUrl() {
    const cid = this.props.collection.id;
    const pid = this.props.collection.attributes.projectId;
    const crid = this.props.collectionResource.id;
    return lh.link("frontendProjectCollectionCollectionResource", pid, cid, crid);
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
            projectId={this.props.match.params.id}
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

export default connectAndFetch(CollectionResourceDetailContainer);
