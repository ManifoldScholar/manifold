import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog, Navigation, Layout } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";

const { request, flush } = entityStoreActions;

export class ProjectWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      project: select(requests.beProject, state.entityStore)
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
    this.props.dispatch(flush(requests.beProject));
  }

  fetchProject = () => {
    const call = projectsAPI.show(this.props.match.params.id);
    const projectRequest = request(call, requests.beProject);
    this.props.dispatch(projectRequest);
  };

  closeDialog() {
    this.setState({ confirmation: null });
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
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <HigherOrder.Authorize entity={project} ability={"delete"}>
          <button
            onClick={this.handleProjectDestroy}
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
    const { project } = this.props;
    const refresh = this.fetchProject;
    return childRoutes(this.props.route, { childProps: { refresh, project } });
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;
    const skipId = "skip-to-project-panel";
    const secondaryLinks = navigation.project(project);

    return (
      <div>
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
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="project"
            title={project.attributes.title}
            subtitle={project.attributes.subtitle}
            utility={this.renderUtility(project)}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel>
            <Utility.SkipLink skipId={skipId} />
            <Navigation.Secondary links={secondaryLinks} panel />
            <div id={skipId} className="panel">
              {this.renderRoutes()}
            </div>
          </Layout.BackendPanel>
        </HigherOrder.Authorize>
      </div>
    );
  }
}

export default connectAndFetch(ProjectWrapperContainer);
