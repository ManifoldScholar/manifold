import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import get from "lodash/get";
import lh from "helpers/linkHandler";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;

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

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func,
    standaloneMode: PropTypes.shape({
      project: PropTypes.object
    })
  };

  componentDidMount() {
    window.addEventListener("keyup", this.maybeReloadProject);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    window.removeEventListener("keyup", this.maybeReloadProject);
  }

  get standaloneMode() {
    // Will return true if standaloneMode.project.id in the store matches
    // the current project.id; otherwise will return false
    const { project: currentProject, standaloneMode } = this.props;

    if (
      !standaloneMode ||
      !standaloneMode.project ||
      !currentProject.attributes.standalone
    )
      return false;

    if (standaloneMode.project.id === currentProject.id) return true;

    return false;
  }

  maybeReloadProject = event => {
    // ctrl + r
    if (event.ctrlKey && event.keyCode === 82) {
      if (!this.props.fetchData) return;
      this.props.fetchData(this.props);
    }
  };

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
        fetchData,
        standaloneMode: this.standaloneMode
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
