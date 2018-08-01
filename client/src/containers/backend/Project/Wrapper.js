import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog, Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

export class ProjectWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      project: select(requests.feProject, state.entityStore)
    };
  };

  static displayName = "Project.Wrapper";

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  fetchProject = () => {
    const call = projectsAPI.show(this.props.match.params.id);
    const projectRequest = request(call, requests.feProject);
    this.props.dispatch(projectRequest);
  };

  closeDialog() {
    this.setState({ confirmation: null });
  }

  secondaryNavigationLinks(project) {
    return [
      {
        path: lh.link("backendProjectGeneral", project.id),
        label: "General",
        key: "general",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectProjectPage", project.id),
        label: "Appearance",
        key: "projectPage",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectPermissions", project.id),
        label: "Permissions",
        key: "permissions",
        entity: project,
        ability: "managePermissions"
      },
      {
        path: lh.link("backendProjectCollaborators", project.id),
        label: "People",
        key: "collaborators",
        entity: project,
        ability: "updateMakers"
      },
      {
        path: lh.link("backendProjectTexts", project.id),
        label: "Texts",
        key: "texts",
        entity: project,
        ability: "manageTexts"
      },
      {
        path: lh.link("backendProjectResources", project.id),
        label: "Resources",
        key: "resources",
        entity: project,
        ability: "manageResources"
      },
      {
        path: lh.link("backendProjectCollections", project.id),
        label: "Collections",
        key: "collections",
        entity: project,
        ability: "manageCollections"
      },
      {
        path: lh.link("backendProjectEvents", project.id),
        label: "Activity",
        key: "events",
        entity: project,
        ability: "manageEvents"
      },
      {
        path: lh.link("backendProjectMetadata", project.id),
        label: "Metadata",
        key: "metadata",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectSocial", project.id),
        label: "Social Integrations",
        key: "social",
        entity: project,
        ability: "manageSocials"
      },
      {
        path: lh.link("backendProjectLog", project.id),
        label: "Log",
        key: "log",
        entity: project,
        ability: "readLog"
      }
    ];
  }

  doPreview = event => {
    event.preventDefault();
    const win = window.open(
      lh.link("frontendProject", this.props.project.attributes.slug),
      "_blank"
    );
    win.focus();
  };

  doDestroy = () => {
    const call = projectsAPI.destroy(this.props.project.id);
    const options = { removes: this.props.project };
    const projectRequest = request(call, requests.beProjectDestroy, options);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.redirectToDashboard();
    });
  };

  redirectToDashboard() {
    this.props.history.push(lh.link("backend"));
  }

  handleProjectDestroy = event => {
    const heading = "Are you sure you want to delete this project?";
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

  renderUtility(project) {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          Preview{" "}
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
        </button>
        <HigherOrder.Authorize entity={project} ability={"delete"}>
          <button
            onClick={this.handleProjectDestroy}
            className="button-bare-primary"
          >
            Delete <i className="manicon manicon-trashcan" aria-hidden="true" />
          </button>
        </HigherOrder.Authorize>
      </div>
    );
  }

  renderRoutes() {
    const { project } = this.props;
    const refresh = this.fetchProject;
    return childRoutes(this.props.route, { childProps: { refresh, project } });
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;
    const skipId = "skip-to-project-panel";

    return (
      <HigherOrder.Authorize
        entity={project}
        failureFatalError={{
          detail: "You are not allowed to edit this project."
        }}
        ability={["update", "manageResources"]}
      >
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}

        <RedirectToFirstMatch
          from={lh.link("backendProject", project.id)}
          candidates={this.secondaryNavigationLinks(project)}
        />

        <Navigation.DetailHeader
          type="project"
          breadcrumb={[{ path: lh.link("backend"), label: "ALL PROJECTS" }]}
          title={project.attributes.title}
          subtitle={project.attributes.subtitle}
          utility={this.renderUtility(project)}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Utility.SkipLink skipId={skipId} />
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Utility.SkipLink skipId={skipId} />
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
              />
            </aside>
            <div id={skipId} className="panel">
              {this.renderRoutes()}
            </div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(ProjectWrapperContainer);
