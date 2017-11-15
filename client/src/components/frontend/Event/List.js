import React, { Component } from "react";
import PropTypes from "prop-types";
import Event from "./Event";
import classNames from "classnames";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";

export default class EventList extends Component {
  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    columns: PropTypes.number.isRequired,
    pagination: PropTypes.object
  };

  static defaultProps = {
    columns: 2,
    limit: 10
  };

  constructor(props) {
    super(props);
    this.paginationClickHandler = this.paginationClickHandler.bind(this);
  }

  paginationClickHandler(page) {
    return lh.link(
      "frontendProjectEventsPage",
      this.props.project.attributes.slug,
      page
    );
  }

  render() {
    if (!this.props.events) return null;

    const listClass = classNames({
      "event-list-primary": this.props.columns === 2,
      "event-list-secondary": this.props.columns === 3
    });

    return (
      <div>
        <ul
          className={listClass}
          ref={eventList => {
            this.eventList = eventList;
          }}
        >
          {this.props.events.map(event => {
            return <Event event={event} key={event.id} />;
          })}
        </ul>
        {this.props.pagination
          ? <Utility.Pagination
              paginationClickHandler={this.paginationClickHandler}
              pagination={this.props.pagination}
            />
          : null}
      </div>
    );
  }
}
