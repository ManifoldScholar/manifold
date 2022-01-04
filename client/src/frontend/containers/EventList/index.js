import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Redirect } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/composed/EntityCollection";
import HeadContent from "global/components/HeadContent";

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
      eventsMeta: meta(requests.feEvents, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    eventsMeta: PropTypes.object
  };

  get project() {
    return this.props.project;
  }

  get projectUrl() {
    return lh.link("frontendProjectDetail", this.project.attributes.slug);
  }

  get events() {
    return this.props.events;
  }

  get eventsMeta() {
    return this.props.eventsMeta;
  }

  paginationClickHandler = page => {
    return lh.link(
      "frontendProjectEventsPage",
      this.props.project.attributes.slug,
      page
    );
  };

  renderRedirect() {
    return <Redirect to={"/"} />;
  }

  render() {
    if (!this.project) return null;
    if (this.project.attributes.hideActivity) return this.renderRedirect();
    if (!this.events) return null;
    return (
      <>
        <HeadContent
          title={`${this.project.attributes.titlePlaintext} | Events`}
          description={this.project.attributes.description}
          image={this.project.attributes.avatarStyles.mediumSquare}
          appendTitle
        />
        <CheckFrontendMode
          debugLabel="EventList"
          project={this.project}
          isProjectSubpage
        />
        <RegisterBreadcrumbs
          breadcrumbs={[
            {
              to: this.projectUrl,
              label: `Back to Project: ${this.project.attributes.title}`
            }
          ]}
        />
        <EntityCollection.Events
          events={this.events}
          eventsMeta={this.eventsMeta}
          paginationProps={{
            paginationClickHandler: this.paginationClickHandler
          }}
        />
      </>
    );
  }
}

export default connectAndFetch(EventList);
