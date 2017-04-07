import React, { PureComponent, PropTypes } from 'react';
import { Dialog, Project, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions, notificationActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, requests } from 'api';
import get from 'lodash/get';
import { browserHistory } from 'react-router';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class ProjectDetailWrapperContainer extends PureComponent {

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
    this.props.dispatch(entityStoreActions.flush(requests.feProject));
  }

  fetchProject() {
    const call = projectsAPI.show(this.props.params.id);
    const projectRequest = request(call, requests.feProject);
    this.props.dispatch(projectRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  secondaryNavigationLinks(project) {
    return [
      {
        path: `/backend/project/${project.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/project/${project.id}/collaborators`,
        label: "People",
        key: "collaborators"
      },
      {
        path: `/backend/project/${project.id}/texts`,
        label: "Texts",
        key: "texts"
      },
      {
        path: `/backend/project/${project.id}/resources`,
        label: "Resources",
        key: "resources"
      },
      {
        path: `/backend/project/${project.id}/events`,
        label: "Activity",
        key: "events"
      },
      {
        path: `/backend/project/${project.id}/metadata`,
        label: "Metadata",
        key: "metadata"
      }
    ];
  }

  doPreview(event) {
    event.preventDefault();
    const win = window.open(`/browse/project/${this.props.project.id}`, '_blank');
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
    browserHistory.push("/backend");
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
            { path: "/backend", label: "ALL PROJECTS" }
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
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {
                React.cloneElement(
                  this.props.children,
                  { project, refresh: this.fetchProject }
                )
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  ProjectDetailWrapperContainer.mapStateToProps
)(ProjectDetailWrapperContainer);

