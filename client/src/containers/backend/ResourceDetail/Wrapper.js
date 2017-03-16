import React, { PureComponent, PropTypes } from 'react';
import { Text, Navigation, Dialog } from 'components/backend';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions, notificationActions } from 'actions';
import { entityUtils } from 'utils';
import { resourcesAPI, requests } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
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
    this.props.dispatch(entityStoreActions.flush(requests.beResource));
  }

  fetchResource() {
    const call = resourcesAPI.show(this.props.params.id);
    const resourceRequest = request(call, requests.beResource);
    this.props.dispatch(resourceRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  doPreview(event) {
    event.preventDefault();
    const projectId = this.props.resource.relationships.project.id;
    const previewUrl = `/browse/project/${projectId}/resource/${this.props.resource.id}`;
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
    const redirectURL = `/backend/project/${projectId}/resources`;
    browserHistory.push(redirectURL);
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

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  secondaryNavigationLinks(resource) {
    return [
      {
        path: `/backend/resource/${resource.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/resource/${resource.id}/content`,
        label: "Content",
        key: "content"
      },
      {
        path: `/backend/resource/${resource.id}/metadata`,
        label: "Metadata",
        key: "metadata"
      }
    ];
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

  render() {
    if (!this.props.resource) return null;
    const { resource } = this.props;

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
            { path: "/backend", label: "ALL PROJECTS" },
            {
              path: `/backend/project/${resource.relationships.project.id}/resources`,
              label: resource.relationships.project.attributes.title
            }
          ]}
          utility={this.renderUtility()}
          title={resource.attributes.title}
          subtitle={resource.attributes.subtitle}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource)}
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {React.cloneElement(this.props.children, { resource })}
            </div>
          </div>
        </section>

      </div>
    );
  }
}

export default connect(
  ResourceDetailWrapperContainer.mapStateToProps
)(ResourceDetailWrapperContainer);

