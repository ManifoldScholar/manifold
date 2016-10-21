import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyModelCreation extends Component {

  static displayName = "Event.Body.ModelCreation";

  static propTypes = {
    event: PropTypes.object,
    icon: PropTypes.string,
  };

  render() {
    const attr = this.props.event.attributes;
    const iconClass = 'manicon manicon-' + this.props.icon;

    return (
      <div className="event-data">
        {/* Event-data requires a classless empty div for vertical alignment */}
        <div>
          <i className={iconClass}></i>
          <h5 className="event-title">
            {attr.event_title}
          </h5>
      <span className="event-subtitle">
        {attr.event_subtitle}
      </span>
          <datetime className="event-date">
            {'Text added ' + attr.created_at}
          </datetime>
        </div>
      </div>
    );
  }
}
