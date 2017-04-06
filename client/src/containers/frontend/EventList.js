import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Project, ResourceList } from 'components/frontend';
import { HigherOrder } from 'components/global';
import { entityStoreActions } from 'actions';
import { select, meta } from 'utils/entityUtils';
import { projectsAPI, requests } from 'api';

const { request } = entityStoreActions;

class ProjectEventsContainer extends Component {

  static fetchData(getState, dispatch, location, match) {
    const { params } = match;
    const page = params.page ? params.page : 1;
    const projectRequest =
        request(projectsAPI.show(params.id), requests.feProject);
    const eventRequest =
      request(projectsAPI.events(params.id, {}, { number: page }), requests.feEvents);
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(eventRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.feProject, state.entityStore),
      events: select(requests.feEvents, state.entityStore),
      meta: meta(requests.feEvents, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    meta: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const events = this.props.events;
    const eventsMeta = this.props.meta;
    if (!events) return null;
    return (
      <Project.Events
        project={project}
        events={events}
        pagination={eventsMeta.pagination}
      />
    );
  }
}

export default connectAndFetch(ProjectEventsContainer);
