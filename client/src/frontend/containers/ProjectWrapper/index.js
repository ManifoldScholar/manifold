import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { RedirectToFirstMatch, childRoutes } from "helpers/router";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
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
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.maybeReloadProject);
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

  get isProjectHomepage() {
    return this.props.location.pathname === this.props.match.url;
  }

  render() {
    return (
      <>
        <CheckFrontendMode
          debugLabel="ProjectWrapper"
          project={this.props.project}
          isProjectHomePage={this.isProjectHomepage}
        />
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
      </>
    );
  }
}

export default connectAndFetch(withSettings(ProjectWrapper));
