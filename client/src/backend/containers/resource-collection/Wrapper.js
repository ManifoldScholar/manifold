import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourceCollectionsAPI, requests, projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/with-confirmation";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/authorize";
import { Link } from "react-router-dom";

const { request, flush } = entityStoreActions;

export class ResourceCollectionWrapperContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      resourceCollection: select(
        requests.beResourceCollection,
        state.entityStore
      ),
      project: select(requests.beProject, state.entityStore)
    };
  };

  static displayName = "ResourceCollection.Wrapper";

  static propTypes = {
    resourceCollection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchCollection();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResourceCollection));
  }

  componentDidUpdate(prevProps) {
    if (this.props.resourceCollection && !prevProps.resourceCollection) {
      const projectId = this.props.resourceCollection.attributes.projectId;
      this.fetchProject(projectId);
    }
  }

  fetchProject = id => {
    const call = projectsAPI.show(id);
    const projectRequest = request(call, requests.beProject);
    this.props.dispatch(projectRequest);
  };

  fetchCollection = () => {
    const call = resourceCollectionsAPI.show(this.props.match.params.id);
    const resourceCollectionRequest = request(
      call,
      requests.beResourceCollection
    );
    this.props.dispatch(resourceCollectionRequest);
  };

  previewUrl() {
    return lh.link(
      "frontendProjectResourceCollection",
      this.props.resourceCollection.relationships.project.attributes.slug,
      this.props.resourceCollection.attributes.slug
    );
  }

  doDestroy = () => {
    const call = resourceCollectionsAPI.destroy(
      this.props.resourceCollection.id
    );
    const options = { removes: this.props.resourceCollection };
    const resourceCollectionRequest = request(
      call,
      requests.beResourceCollectionDestroy,
      options
    );
    this.props.dispatch(resourceCollectionRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectCollections();
    });
  };

  redirectToProjectCollections() {
    const projectId = this.props.resourceCollection.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResourceCollections", projectId);
    this.props.history.push(redirectUrl);
  }

  notifyDestroy() {
    const notification = {
      level: 0,
      id: `RESOURCE_COLLECTION_DESTROYED_${this.props.resourceCollection.id}`,
      heading: "The resource collection has been destroyed.",
      body: `${this.props.resourceCollection.attributes.title} has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleCollectionDestroy = () => {
    const heading = "Are you sure you want to delete this resource collection?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.doDestroy);
  };

  renderUtility() {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link to={this.previewUrl()} className="utility-button">
          <IconComposer
            icon="eyeOpen32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">Preview</span>
        </Link>
        <button
          onClick={this.handleCollectionDestroy}
          className="utility-button"
        >
          <IconComposer
            icon="delete32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">Delete</span>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { resourceCollection, project } = this.props;
    return childRoutes(this.props.route, {
      childProps: { resourceCollection, project }
    });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { resourceCollection, match } = this.props;
    /* eslint-enable no-unused-vars */
    if (!resourceCollection) return null;
    const secondaryLinks = navigation.resourceCollection(resourceCollection);

    return (
      <div>
        <Authorize
          entity={resourceCollection}
          failureFatalError={{
            body: "You are not allowed to edit this resource collection."
          }}
          ability="update"
        >
          <RedirectToFirstMatch
            from={lh.link("backendResourceCollection", resourceCollection.id)}
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="resourceCollection"
            backUrl={lh.link(
              "backendProjectResourceCollections",
              resourceCollection.relationships.project.id
            )}
            backLabel={
              resourceCollection.relationships.project.attributes.titlePlaintext
            }
            utility={this.renderUtility()}
            title={resourceCollection.attributes.title}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel
            sidebar={
              <Navigation.Secondary
                links={secondaryLinks}
                panel
                ariaLabel="Resource Collection Settings"
              />
            }
          >
            <div>{this.renderRoutes()}</div>
          </Layout.BackendPanel>
        </Authorize>
      </div>
    );
  }
}

export default withConfirmation(
  connectAndFetch(ResourceCollectionWrapperContainer)
);
