import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation, Dialog } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { resourcesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

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
    route: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

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

  closeDialog() {
    this.setState({ confirmation: null });
  }

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

  handleResourceDestroy = event => {
    const heading = "Are you sure you want to delete this resource?";
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

  renderUtility(resource) {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <HigherOrder.Authorize entity={resource} ability={"delete"}>
          <button
            onClick={this.handleResourceDestroy}
            className="button-bare-primary"
          >
            <i className="manicon manicon-trashcan" aria-hidden="true" />
            Delete
          </button>
        </HigherOrder.Authorize>
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
    const skipId = "skip-to-resource-panel";
    const secondaryLinks = navigation.resource(resource);

    return (
      <div>
        <HigherOrder.Authorize
          entity={resource}
          failureFatalError={{
            detail: "You are not allowed to edit this resource."
          }}
          ability="update"
        >
          <RedirectToFirstMatch
            from={lh.link("backendResource", resource.id)}
            candidates={secondaryLinks}
          />

          {this.state.confirmation ? (
            <Dialog.Confirm {...this.state.confirmation} />
          ) : null}
          <Navigation.DetailHeader
            type="resource"
            breadcrumb={[
              {
                path: lh.link(
                  "backendProjectResources",
                  resource.relationships.project.id
                ),
                label: resource.relationships.project.attributes.title
              }
            ]}
            utility={this.renderUtility(resource)}
            title={resource.attributes.titleFormatted}
            titleHtml
            subtitle={resource.attributes.subtitle}
            secondaryLinks={secondaryLinks}
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

export default connectAndFetch(ResourceWrapperContainer);
