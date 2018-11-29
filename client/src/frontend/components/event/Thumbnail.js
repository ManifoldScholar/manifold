import React, { Component } from "react";
import PropTypes from "prop-types";

export default class EventThumbnail extends Component {
  static displayName = "Event.Thumbnail";

  static propTypes = {
    event: PropTypes.object.isRequired
  };

  static defaultProps = {};

  getEventIcon(type) {
    const eventIconMap = {
      annotation_created: "person-word-bubble",
      project_created: "egg",
      resource_added: "cube-shine",
      text_added: "book-opening",
      tweet: "twitter"
    };

    return eventIconMap[type];
  }

  render() {
    const event = this.props.event;
    const iconClass =
      "manicon manicon-" + this.getEventIcon(event.attributes.eventType);

    return (
      <div className="event-thumbnail-primary">
        <div className="wrapper">
          <figure className="event-type">
            <i className={iconClass} aria-hidden="true" />
          </figure>
        </div>
      </div>
    );
  }
}
