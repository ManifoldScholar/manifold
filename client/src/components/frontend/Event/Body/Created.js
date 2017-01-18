import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FormattedDate from 'components/global/FormattedDate';

export default class EventBodyCreated extends Component {

  static displayName = "Event.Body.Created";

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
            {attr.eventTitle}
          </h5>
          {/* Only show the subtitle (and its wrapper) if it exists */}
          {attr.subjectSubtitle ?
              <span className="event-subtitle">
              {attr.subjectSubtitle}
            </span> : null
          }
          <datetime className="event-date">
            {attr.subjectType === "Project" ?
              <FormattedDate
                prefix="Started"
                format="MMMM Do, YYYY"
                date={attr.createdAt}
              />
            : null}
          </datetime>
        </div>
      </div>
    );
  }
}
