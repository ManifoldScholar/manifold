import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions, uiFrontendModeActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import withSettings from "hoc/with-settings";

const { request } = entityStoreActions;

export class ProjectWrapper extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      project: grab("projects", ownProps.match.params.id, state.entityStore),
      projectResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static contextType = FrontendModeContext;

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  componentDidMount() {
    window.addEventListener("keyup", this.maybeReloadProject);
    this.checkStandaloneMode(null, this.props.project);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.maybeReloadProject);
    this.props.dispatch(uiFrontendModeActions.setFrontendModeToLibrary());
  }

  componentDidUpdate(prevProps) {
    this.checkStandaloneMode(prevProps.project, this.props.project);
  }

  checkStandaloneMode(prevProject, project) {
    if (prevProject === project) return;
    if (prevProject && project && prevProject.id === project.id) return;
    this.props.dispatch(
      uiFrontendModeActions.setMode(
        project.attributes.standaloneMode,
        project,
        this.props.location.search
      )
    );
  }

  renderRoutes() {
    const {
      route,
      project,
      projectResponse,
      settings,
      dispatch,
      fetchData
    } = this.props;

    return childRoutes(route, {
      childProps: {
        project,
        projectResponse,
        settings,
        dispatch,
        fetchData
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <RedirectToFirstMatch
          from={lh.link("frontendProject")}
          candidates={[
            {
              label: "All Projects",
              route: "frontendProjectsAll"
            }
          ]}
        />
        {this.renderRoutes()}
      </React.Fragment>
    );
  }
}

export default connectAndFetch(withSettings(ProjectWrapper));
