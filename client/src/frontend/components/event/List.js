import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import Event from "./Event";

export default class EventList extends Component {
  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    pagination: PropTypes.object
  };

  static defaultProps = {
    limit: 10
  };

  paginationClickHandler = page => {
    return lh.link(
      "frontendProjectEventsPage",
      this.props.project.attributes.slug,
      page
    );
  };

  render() {
    if (!this.props.events) return null;

    return (
      <div className="entity-section-wrapper__body">
        <ul
          className="event-list"
          ref={eventList => {
            this.eventList = eventList;
          }}
        >
          {this.props.events.map(event => {
            return (
              <Event
                event={event}
                key={event.id}
                itemClass="event-list__item"
              />
            );
          })}
        </ul>
        {this.props.pagination ? (
          <div className="entity-section-wrapper__pagination">
            <Utility.Pagination
              paginationClickHandler={this.paginationClickHandler}
              pagination={this.props.pagination}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
