import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourcesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/with-confirmation";
import IconComposer from "global/components/utility/IconComposer";

import Authorize from "hoc/authorize";

const { request, flush } = entityStoreActions;

export class ResourceWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      resource: select(requests.beResource, state.entityStore)
    };
  };

  static displayName = "Resource.Wrapper";

  static propTypes = {
    resource: PropTypes.object,
    match: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    route: PropTypes.object,
    confirm: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchResource();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResource));
  }

  fetchResource = () => {
    const call = resourcesAPI.show(this.props.match.params.id);
    const resourceRequest = request(call, requests.beResource);
    this.props.dispatch(resourceRequest);
  };

  doPreview = event => {
    event.preventDefault();
    const project = this.props.resource.relationships.project;
    const previewUrl = lh.link(
      "frontendProjectResource",
      project.attributes.slug,
      this.props.resource.attributes.slug
    );
    const win = window.open(previewUrl, "_blank");
    win.focus();
  };

  doDestroy = () => {
    const call = resourcesAPI.destroy(this.props.resource.id);
    const options = { removes: this.props.resource };
    const resourceRequest = request(call, requests.beResourceDestroy, options);
    this.props.dispatch(resourceRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectResources();
    });
  };

  redirectToProjectResources() {
    const projectId = this.props.resource.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResources", projectId);
    this.props.history.push(redirectUrl);
  }

  notifyDestroy() {
    const notification = {
      level: 0,
      id: `RESOURCE_DESTROYED_${this.props.resource.id}`,
      heading: "The resource has been destroyed.",
      body: `${
        this.props.resource.attributes.title
      } has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleResourceDestroy = () => {
    const heading = "Are you sure you want to delete this resource?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.doDestroy);
  };

  renderUtility(resource) {
    return (
      <div className="utility-button-group utility-button-group--inline">
        <button onClick={this.doPreview} className="utility-button">
          <IconComposer
            icon="eyeOpen32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">Preview</span>
        </button>
        <Authorize entity={resource} ability={"delete"}>
          <button
            onClick={this.handleResourceDestroy}
            className="utility-button"
          >
            <IconComposer
              icon="delete32"
              size={26}
              iconClass="utility-button__icon utility-button__icon--notice"
            />
            <span className="utility-button__text">Delete</span>
          </button>
        </Authorize>
      </div>
    );
  }

  renderRoutes() {
    const { resource } = this.props;
    return childRoutes(this.props.route, { childProps: { resource } });
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { resource } = this.props;
    /* eslint-enable no-unused-vars */
    if (!resource) return null;
    const secondaryLinks = navigation.resource(resource);

    return (
      <div>
        <Authorize
          entity={resource}
          failureFatalError={{
            body: "You are not allowed to edit this resource."
          }}
          ability="update"
        >
          <RedirectToFirstMatch
            from={lh.link("backendResource", resource.id)}
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="resource"
            backUrl={lh.link(
              "backendProjectResources",
              resource.relationships.project.id
            )}
            backLabel={resource.relationships.project.attributes.titlePlaintext}
            utility={this.renderUtility(resource)}
            title={resource.attributes.titleFormatted}
            subtitle={resource.attributes.subtitle}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel
            sidebar={
              <Navigation.Secondary
                links={secondaryLinks}
                panel
                ariaLabel="Resource Settings"
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

export default withConfirmation(connectAndFetch(ResourceWrapperContainer));
