import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Redirect } from "react-router-dom";
import Project from "frontend/components/project";
import { entityStoreActions, uiFrontendModeActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import BackLink from "frontend/components/back-link";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export class ProjectEventsContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const { params } = match;
    const page = params.page ? params.page : 1;
    const eventRequest = request(
      projectsAPI.events(params.id, {}, { number: page }),
      requests.feEvents
    );
    const { promise: one } = dispatch(eventRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
      events: select(requests.feEvents, state.entityStore),
      meta: meta(requests.feEvents, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    meta: PropTypes.object
  };

  componentDidMount() {
    this.props.dispatch(uiFrontendModeActions.isProjectSubpage());
  }

  projectUrl() {
    return lh.link("frontendProjectDetail", this.props.project.attributes.slug);
  }

  renderRedirect() {
    return <Redirect to={"/"} />;
  }

  render() {
    const project = this.props.project;
    if (!project) return null;
    if (project.attributes.hideActivity) return this.renderRedirect();
    const events = this.props.events;
    const eventsMeta = this.props.meta;
    if (!events) return null;
    return (
      <React.Fragment>
        <BackLink.Register
          backText="Back to Project"
          link={this.projectUrl()}
          title={project.attributes.title}
        />
        <Project.Events
          project={project}
          events={events}
          pagination={eventsMeta.pagination}
        />
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ProjectEventsContainer);
