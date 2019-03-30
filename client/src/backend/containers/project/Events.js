import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, eventsAPI, requests } from "api";
import { connect } from "react-redux";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Search,
  EventRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { eventFilters } from "hoc/with-filtered-lists";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;
const perPage = 6;

export class container extends PureComponent {
  static mapStateToProps = state => {
    return {
      events: select(requests.beEvents, state.entityStore),
      eventsMeta: meta(requests.beEvents, state.entityStore)
    };
  };

  static displayName = "Project.Events";

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    confirm: PropTypes.func.isRequired,
    eventsMeta: PropTypes.object,
    refresh: PropTypes.func,
    dispatch: PropTypes.func,
    entitiesListSearchProps: PropTypes.func.isRequired,
    entitiesListSearchParams: PropTypes.object.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  constructor(props) {
    super(props);
    this.lastFetchedPage = null;
  }

  componentDidMount() {
    this.fetchEvents(1);
  }

  componentDidUpdate(prevProps) {
    if (this.filtersChanged(prevProps)) return this.fetchEvents();
    if (this.eventWasModified(prevProps))
      return this.fetchEvents(this.lastFetchedPage);
  }

  filtersChanged(prevProps) {
    return (
      prevProps.entitiesListSearchParams !== this.props.entitiesListSearchParams
    );
  }

  eventWasModified(prevProps) {
    const currentModified = get(this.props, "eventsMeta.modified");
    const previousModified = get(prevProps, "eventsMeta.modified");
    if (!currentModified) return false;
    return !(currentModified && previousModified);
  }

  fetchEvents(page = 1) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const filters = this.props.entitiesListSearchParams.events;
    const action = request(
      projectsAPI.events(this.props.project.id, filters, pagination),
      requests.beEvents
    );
    this.props.dispatch(action);
  }

  handleEventDestroy = event => {
    const heading = "Are you sure you want to delete this event?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, () => this.destroyEvent(event));
  };

  destroyEvent(event) {
    const call = eventsAPI.destroy(event.id);
    const options = { removes: event };
    const eventRequest = request(call, requests.beEventDestroy, options);
    this.props.dispatch(eventRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  handleUsersPageChange(event, page) {
    this.fetchEvents(page);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handleUsersPageChange(event, page);
    };
  };

  render() {
    if (!this.props.events) return null;
    const project = this.props.project;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability="manageEvents"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <EntitiesList
            entityComponent={EventRow}
            entityComponentProps={{
              destroyHandler: this.handleEventDestroy
            }}
            entities={this.props.events}
            listStyle="tiles"
            showCount
            title="Activity"
            titleIcon="BENews64"
            unit="event"
            pagination={this.props.eventsMeta.pagination}
            callbacks={{
              onPageClick: this.pageChangeHandlerCreator
            }}
            search={
              <Search {...this.props.entitiesListSearchProps("events")} />
            }
          />
        </section>
      </Authorize>
    );
  }
}

export const ProjectEventsContainer = withFilteredLists(container, {
  events: eventFilters
});

export default withConfirmation(
  connect(ProjectEventsContainer.mapStateToProps)(ProjectEventsContainer)
);
