import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectList from "frontend/components/project-list";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";

const { request } = entityStoreActions;
const perPage = 20;

export class HomeProjectsContainer extends Component {
  // This method is called by the Home Container, since its fetchData is exposed to the
  // SSR because it's a top-level route. Code is here so that it's closer to where it's
  // actually used.
  static fetchProjects(getState, dispatch) {
    const filters = {
      standaloneModeEnforced: false,
      order: "sort_title, title"
    };
    const pagination = {
      number: 1,
      size: perPage
    };
    const projectsRequest = request(
      projectsAPI.index(filters, pagination),
      requests.feProjectsFiltered
    );
    const { promise } = dispatch(projectsRequest);
    return promise;
  }

  static mapStateToProps(state) {
    return {
      projects: select(requests.feProjectsFiltered, state.entityStore),
      authentication: state.authentication
    };
  }

  static propTypes = {
    projects: PropTypes.array,
    authentication: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func
  };

  showPlaceholder() {
    const { location, projects } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!projects || projects.length === 0) return true;
  }

  render() {
    if (this.showPlaceholder()) return <ProjectList.Placeholder />;

    return (
      <section className="bg-neutral05">
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer size={56} icon="projects64" />
              <div className="body">
                <h2 className="title">{"Our Projects"}</h2>
              </div>
            </div>
          </header>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            dispatch={this.props.dispatch}
            projects={this.props.projects}
            limit={16}
            viewAllUrl={lh.link("frontendProjectsAll")}
          />
        </div>
      </section>
    );
  }
}

export default connectAndFetch(HomeProjectsContainer);
