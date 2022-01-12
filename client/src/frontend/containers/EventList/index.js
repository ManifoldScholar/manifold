import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Redirect } from "react-router-dom";
import Project from "frontend/components/project";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

const { request } = entityStoreActions;

export class EventList extends Component {
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
      <>
        <CheckFrontendMode
          debugLabel="EventList"
          project={project}
          isProjectSubpage
        />
        <RegisterBreadcrumbs
          breadcrumbs={[
            {
              to: this.projectUrl(),
              label: `Back to Project: ${project.attributes.title}`
            }
          ]}
        />
        <Project.Events
          project={project}
          events={events}
          pagination={eventsMeta.pagination}
        />
      </>
    );
  }
}

export default connectAndFetch(EventList);
