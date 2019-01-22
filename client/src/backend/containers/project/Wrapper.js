import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import withConfirmation from "hoc/with-confirmation";
import Utility from "global/components/utility";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/authorize";
import get from "lodash/get";

const { request, flush } = entityStoreActions;

export class ProjectWrapperContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      projectResponse: get(state.entityStore.responses, requests.beProject),
      project: select(requests.beProject, state.entityStore)
    };
  };

  static displayName = "Project.Wrapper";

  static propTypes = {
    projectResponse: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    route: PropTypes.object,
    location: PropTypes.object
  };

  componentDidMount() {
    this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beProject));
  }

  fetchProject = () => {
    const call = projectsAPI.show(this.props.match.params.id);
    const options = { force: true };
    const projectRequest = request(call, requests.beProject, options);
    this.props.dispatch(projectRequest);
  };

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

  handleProjectDestroy = () => {
    const heading = "Are you sure you want to delete this project?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.doDestroy);
  };

  renderUtility(project) {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <Authorize entity={project} ability={"delete"}>
          <button
            onClick={this.handleProjectDestroy}
            className="button-bare-primary"
          >
            <i className="manicon manicon-trashcan" aria-hidden="true" />
            Delete
          </button>
        </Authorize>
      </div>
    );
  }

  renderRoutes() {
    const { project, projectResponse } = this.props;
    const refresh = this.fetchProject;
    return childRoutes(this.props.route, {
      childProps: { refresh, project, projectResponse }
    });
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;
    const skipId = "skip-to-project-panel";
    const secondaryLinks = navigation.project(project);

    return (
      <div>
        <Authorize
          entity={project}
          failureFatalError={{
            detail: "You are not allowed to edit this project."
          }}
          ability={["update", "manageResources"]}
        >
          <RedirectToFirstMatch
            from={lh.link("backendProject", project.id)}
            candidates={secondaryLinks}
          />
          <Navigation.DetailHeader
            type="project"
            title={project.attributes.titleFormatted}
            subtitle={project.attributes.subtitle}
            utility={this.renderUtility(project)}
            secondaryLinks={secondaryLinks}
          />
          <Layout.BackendPanel
            sidebar={<Navigation.Secondary links={secondaryLinks} panel />}
          >
            <Utility.SkipLink skipId={skipId} />
            <div id={skipId}>{this.renderRoutes()}</div>
          </Layout.BackendPanel>
        </Authorize>
      </div>
    );
  }
}

export default withConfirmation(connectAndFetch(ProjectWrapperContainer));
