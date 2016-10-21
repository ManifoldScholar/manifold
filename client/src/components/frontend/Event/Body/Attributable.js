import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class EventBodyAttributable extends Component {

  static displayName = "Event.Body.Attributable";

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
          <div className="event-user">
            {'@' + attr.attribution_id}
          </div>
          <div className="event-content">
            <p>
              {attr.excerpt}
            </p>
          </div>
          <datetime className="event-date">
            {attr.created_at}
          </datetime>
        </div>
      </div>
    );
  }
}
