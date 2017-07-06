import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connectAndFetch from 'utils/connectAndFetch';
import { Dialog, Project, Navigation } from 'components/backend';
import { uiVisibilityActions, entityStoreActions, notificationActions } from 'actions';
import { select } from 'utils/entityUtils';
import { projectsAPI, requests } from 'api';
import { ProjectDetail } from 'containers/backend';
import { renderRoutes } from 'helpers/routing';
import lh from 'helpers/linkHandler';

const { request, flush } = entityStoreActions;

export class ProjectDetailWrapperContainer extends PureComponent {

  static displayName = "ProjectDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      project: select(requests.feProject, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.fetchProject = this.fetchProject.bind(this);
    this.doPreview = this.doPreview.bind(this);
    this.doDestroy = this.doDestroy.bind(this);
    this.handleProjectDestroy = this.handleProjectDestroy.bind(this);
  }

  componentDidMount() {
    this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  fetchProject() {
    const call = projectsAPI.show(this.props.match.params.id);
    const projectRequest = request(call, requests.feProject);
    this.props.dispatch(projectRequest);
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  secondaryNavigationLinks(project) {
    return [
      {
        path: lh.link("backendProject", project.id),
        label: "General",
        key: "general"
      },
      {
        path: lh.link("backendProjectCollaborators", project.id),
        label: "People",
        key: "collaborators"
      },
      {
        path: lh.link("backendProjectTexts", project.id),
        label: "Texts",
        key: "texts"
      },
      {
        path: lh.link("backendProjectResources", project.id),
        label: "Resources",
        key: "resources"
      },
      {
        path: lh.link("backendProjectCollections", project.id),
        label: "Collections",
        key: "collections"
      },
      {
        path: lh.link("backendProjectEvents", project.id),
        label: "Activity",
        key: "events"
      },
      {
        path: lh.link("backendProjectMetadata", project.id),
        label: "Metadata",
        key: "metadata"
      }
    ];
  }

  doPreview(event) {
    event.preventDefault();
    const win = window.open(lh.link("frontendProject", this.props.project.id), '_blank');
    win.focus();
  }

  doDestroy() {
    const call = projectsAPI.destroy(this.props.project.id);
    const options = { removes: this.props.project };
    const projectRequest = request(call, requests.beProjectDestroy, options);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.redirectToDashboard();
    });
  }

  redirectToDashboard() {
    this.props.history.push(lh.link("backend"));
  }

  handleProjectDestroy(event) {
    const heading = "Are you sure you want to delete this project?";
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
          onClick={this.handleProjectDestroy}
          className="button-bare-primary"
        >
          Delete <i className="manicon manicon-trashcan"></i>
        </button>
      </div>
    );
  }

  renderRoutes() {
    const { project } = this.props;
    const refresh = this.fetchProject;
    const childRoutes = renderRoutes(this.props.route.routes, { refresh, project });
    return childRoutes;
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;

    return (
      <div>
        {
          this.state.confirmation ?
            <Dialog.Confirm {...this.state.confirmation} />
            : null
        }
        <Navigation.DetailHeader
          type="project"
          breadcrumb={[
            { path: lh.link("backend"), label: "ALL PROJECTS" }
          ]}
          title={project.attributes.title}
          subtitle={project.attributes.subtitle}
          utility={this.renderUtility()}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
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

export default connectAndFetch(ProjectDetailWrapperContainer);
