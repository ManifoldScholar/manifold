import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
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
import withFilteredLists, { eventFilters } from "hoc/withFilteredLists";

import Authorize from "hoc/Authorize";

const { request } = entityStoreActions;
const perPage = 6;

class ProjectEventsContainerImplementation extends PureComponent {
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
    entitiesListSearchParams: PropTypes.object.isRequired,
    t: PropTypes.func
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
    const t = this.props.t;
    const heading = t("modals.delete_event");
    const message = t("modals.confirm_body");
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
    const { project, t, eventsMeta } = this.props;
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
            title={t("projects.activity")}
            titleIcon="BENews64"
            titleStyle="bar"
            titleTag="h2"
            unit={t("glossary.event", {
              count: eventsMeta?.pagination?.totalCount
            })}
            pagination={eventsMeta.pagination}
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

export const ProjectEventsContainer = withFilteredLists(
  ProjectEventsContainerImplementation,
  {
    events: eventFilters()
  }
);

export default withTranslation()(
  withConfirmation(
    connect(ProjectEventsContainer.mapStateToProps)(ProjectEventsContainer)
  )
);
