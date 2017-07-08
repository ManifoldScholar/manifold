import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

export default class EventBodyAdded extends Component {
  static displayName = "Event.Body.Added";

  static propTypes = {
    event: PropTypes.object,
    icon: PropTypes.string
  };

  getPrefixByType(type) {
    let output = "";

    switch (type) {
      case "TEXT_ADDED":
        output = "Text";
        break;
      case "RESOURCE_ADDED":
        output = "Resource";
        break;
      default:
        output = "";
    }

    return output;
  }

  render() {
    const attr = this.props.event.attributes;
    const iconClass = "manicon manicon-" + this.props.icon;
    const prefix = this.getPrefixByType(attr.eventType);

    return (
      <div className="event-data">
        {/* Event-data requires a classless empty div for vertical alignment */}
        <div>
          <i className={iconClass} />
          <h5
            className="event-title"
            dangerouslySetInnerHTML={{ __html: attr.subjectTitle }}
          />
          {/* Only show the subtitle (and its wrapper) if it exists */}
          {attr.subjectSubtitle
            ? <span className="event-subtitle">
                {attr.subjectSubtitle}
              </span>
            : null}
          <datetime className="event-date">
            <FormattedDate
              prefix={`${prefix} Added`}
              format="MMMM Do, YYYY"
              date={attr.createdAt}
            />
          </datetime>
        </div>
      </div>
    );
  }
}
