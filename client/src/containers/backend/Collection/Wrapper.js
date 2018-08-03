import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation, Dialog } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { collectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

const { request, flush } = entityStoreActions;

export class CollectionWrapperContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      collection: select(requests.beCollection, state.entityStore)
    };
  };

  static displayName = "Collection.Wrapper";

  static propTypes = {
    collection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    this.fetchCollection();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beCollection));
  }

  fetchCollection = () => {
    const call = collectionsAPI.show(this.props.match.params.id);
    const collectionRequest = request(call, requests.beCollection);
    this.props.dispatch(collectionRequest);
  };

  closeDialog() {
    this.setState({ confirmation: null });
  }

  doPreview = event => {
    event.preventDefault();
    const previewUrl = lh.link(
      "frontendProjectCollection",
      this.props.collection.relationships.project.attributes.slug,
      this.props.collection.attributes.slug
    );
    const win = window.open(previewUrl, "_blank");
    win.focus();
  };

  doDestroy = () => {
    const call = collectionsAPI.destroy(this.props.collection.id);
    const options = { removes: this.props.collection };
    const collectionRequest = request(
      call,
      requests.beCollectionDestroy,
      options
    );
    this.props.dispatch(collectionRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectCollections();
    });
  };

  redirectToProjectCollections() {
    const projectId = this.props.collection.relationships.project.id;
    const redirectUrl = lh.link("backendProjectCollections", projectId);
    this.props.history.push(redirectUrl);
  }

  notifyDestroy() {
    const notification = {
      level: 0,
      id: `COLLECTION_DESTROYED_${this.props.collection.id}`,
      heading: "The collection has been destroyed.",
      body: `${
        this.props.collection.attributes.title
      } has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleCollectionDestroy = event => {
    const heading = "Are you sure you want to delete this collection?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(event);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  renderUtility() {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          Preview{" "}
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
        </button>
        <button
          onClick={this.handleCollectionDestroy}
          className="button-bare-primary"
        >
          Delete <i className="manicon manicon-trashcan" aria-hidden="true" />
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { collection } = this.props;
    return childRoutes(this.props.route, { childProps: { collection } });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { collection, match } = this.props;
    /* eslint-enable no-unused-vars */
    if (!collection) return null;
    const skipId = "skip-to-collection-panel";
    const secondaryLinks = navigation.collection(collection);

    return (
      <div>
        <HigherOrder.Authorize
          entity={collection}
          failureFatalError={{
            detail: "You are not allowed to edit this collection."
          }}
          ability="update"
        >
          <RedirectToFirstMatch
            from={lh.link("backendCollection", collection.id)}
            candidates={secondaryLinks}
          />
          {this.state.confirmation ? (
            <Dialog.Confirm {...this.state.confirmation} />
          ) : null}
          <Navigation.DetailHeader
            type="collection"
            breadcrumb={[
              {
                path: lh.link(
                  "backendProjectCollections",
                  collection.relationships.project.id
                ),
                label: collection.relationships.project.attributes.title
              }
            ]}
            utility={this.renderUtility()}
            title={collection.attributes.title}
            secondaryLinks={secondaryLinks}
            titleHtml
          />
          <section className="backend-panel">
            <Utility.SkipLink skipId={skipId} />
            <div className="container">
              <Navigation.Secondary links={secondaryLinks} panel />
              <div id={skipId} className="panel">
                {this.renderRoutes()}
              </div>
            </div>
          </section>
        </HigherOrder.Authorize>
      </div>
    );
  }
}

export default connectAndFetch(CollectionWrapperContainer);
