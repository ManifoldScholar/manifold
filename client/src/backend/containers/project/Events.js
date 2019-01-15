import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "backend/components/list";
import Event from "backend/components/event";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectsAPI, eventsAPI, requests } from "api";
import { connect } from "react-redux";
import get from "lodash/get";
import config from "config";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;
const perPage = 6;

export class ProjectEventsContainer extends PureComponent {
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
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: {}
    };
    this.lastFetchedPage = null;
  }

  componentDidMount() {
    this.fetchEvents(1);
  }

  componentDidUpdate(prevProps) {
    this.maybeReload(prevProps.eventsMeta);
  }

  maybeReload(prevEventMeta) {
    const currentModified = get(this.props, "eventsMeta.modified");
    const previousModified = get(prevEventMeta, "modified");
    if (!currentModified) return;
    if (currentModified && previousModified) return;
    this.fetchEvents(this.lastFetchedPage);
  }

  fetchEvents(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      projectsAPI.events(this.props.project.id, this.state.filter, pagination),
      requests.beEvents
    );
    this.props.dispatch(action);
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, () => {
      this.fetchEvents(1);
    });
  };

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
          <header className="section-heading-secondary">
            <h3>
              {"Events"}{" "}
              <i className="manicon manicon-bugle" aria-hidden="true" />
            </h3>
          </header>
          <List.Searchable
            entities={this.props.events}
            singularUnit="event"
            pluralUnit="events"
            listClassName="vertical-list-primary tile-list"
            pagination={this.props.eventsMeta.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
            paginationClass="secondary"
            entityComponent={Event.ListItem}
            filterChangeHandler={this.filterChangeHandler}
            destroyHandler={this.handleEventDestroy}
            filterOptions={{
              type: {
                options: project.attributes.eventTypes,
                labels: config.app.locale.event_types
              }
            }}
          />
        </section>
      </Authorize>
    );
  }
}

export default withConfirmation(
  connect(ProjectEventsContainer.mapStateToProps)(ProjectEventsContainer)
);
