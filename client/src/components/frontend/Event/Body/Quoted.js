import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyQuoted extends Component {

  static displayName = "Event.Body.Quoted";

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
          <div className="event-content">
            <p>
              {attr.excerpt}
            </p>
          </div>
          <div className="event-user">
            {attr.attribution}
          </div>
          {/* TODO: Include machine readable date-time */}
          <datetime className="event-date">
            {attr.created_at}
          </datetime>
        </div>
      </div>
    );
  }
}
