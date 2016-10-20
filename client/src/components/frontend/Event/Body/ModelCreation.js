import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyModelCreation extends Component {

  static displayName = "Event.Body.ModelCreation";

  static propTypes = {
    event: PropTypes.object,
  };

  render() {
    const attr = this.props.event.attributes;
    return (
      <div className="event-tile">
        <div className="event-data">
          {/* Event-data requires a classless empty div for vertical alignment */}
          <div>
            <i className="manicon manicon-book-opening"></i>
            <h5 className="event-title">
              {attr.subject_title}
            </h5>
        <span className="event-subtitle">
          {attr.subject_subtitle}
        </span>
            <datetime className="event-date">
              {'Text added ' + attr.created_at}
            </datetime>
          </div>
        </div>
        <div className="event-link"></div>
      </div>
    )
  }
}
