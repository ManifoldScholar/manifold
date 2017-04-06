import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Text, Navigation, Dialog } from 'components/backend';
import { uiVisibilityActions, entityStoreActions, notificationActions } from 'actions';
import { select } from 'utils/entityUtils';
import { resourcesAPI, requests } from 'api';
import get from 'lodash/get';
import lh from 'helpers/linkHandler';
import { renderRoutes } from 'helpers/routing';

const { request, flush } = entityStoreActions;

class ResourceDetailWrapperContainer extends PureComponent {

  static displayName = "ResourceDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      resource: select(requests.beResource, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    resource: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.fetchResource = this.fetchResource.bind(this);
    this.doPreview = this.doPreview.bind(this);
    this.doDestroy = this.doDestroy.bind(this);
    this.handleResourceDestroy = this.handleResourceDestroy.bind(this);
  }

  componentDidMount() {
    this.fetchResource();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beResource));
  }

  fetchResource() {
    const call = resourcesAPI.show(this.props.match.params.id);
    const resourceRequest = request(call, requests.beResource);
    this.props.dispatch(resourceRequest);
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  doPreview(event) {
    event.preventDefault();
    const projectId = this.props.resource.relationships.project.id;
    const previewUrl = lh.link("frontendProjectResource", projectId, this.props.resource.id);
    const win = window.open(previewUrl, '_blank');
    win.focus();
  }

  doDestroy() {
    const call = resourcesAPI.destroy(this.props.resource.id);
    const options = { removes: this.props.resource };
    const resourceRequest = request(call, requests.beResourceDestroy, options);
    this.props.dispatch(resourceRequest).promise.then(() => {
      this.notifyDestroy();
      this.redirectToProjectResources();
    });
  }

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
      body: `${this.props.resource.attributes.title} has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleResourceDestroy(event) {
    const heading = "Are you sure you want to delete this resource?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(() => {
      this.doDestroy(event);
      this.closeDialog();
    }, () => { this.closeDialog(); });
  }

  secondaryNavigationLinks(resource, kind) {
    const externalVideo = resource.attributes.externalVideo;
    const out = [
      {
        path: lh.link("backendResource", resource.id),
        label: "General",
        key: "general"
      },
      {
        path: lh.link("backendResourceMetadata", resource.id),
        label: "Metadata",
        key: "metadata"
      }
    ];
    if (
      kind === 'image' ||
      kind === 'audio' ||
      kind === "pdf" ||
      (kind === 'video' && !externalVideo)) {
      out.splice(1, 0, {
        path: lh.link("backendResourceVariants", resource.id),
        label: "Variants",
        key: "variants"
      });
    }
    return out;
  }

  renderUtility() {
    return (
      <div>
        <button
          onClick={this.doPreview}
          className="button-bare-primary"
        >
          Preview <i className="manicon manicon-eye-outline"></i>
        </button>
        <button
          onClick={this.handleResourceDestroy}
          className="button-bare-primary"
        >
          Delete <i className="manicon manicon-trashcan"></i>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { resource } = this.props;
    const childRoutes = renderRoutes(this.props.route.routes, { resource });
    return childRoutes;
  }

  render() {
    const { resource, match } = this.props;
    if (!resource) return null;

    return (
      <div>
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            { path: lh.link("backend"), label: "ALL PROJECTS" },
            {
              path: lh.link("backendProjectResources", resource.relationships.project.id),
              label: resource.relationships.project.attributes.title
            }
          ]}
          utility={this.renderUtility()}
          title={resource.attributes.titleFormatted}
          titleHtml
          subtitle={resource.attributes.subtitle}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource, resource.attributes.kind)}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource, resource.attributes.kind)}
              />
            </aside>
            <div className="panel">
              {this.renderRoutes()}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ResourceDetailWrapperContainer);
