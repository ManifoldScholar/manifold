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
      ANNOTATION_ADDED: "person-word-bubble",
      PROJECT_CREATED: "egg",
      RESOURCE_ADDED: "cube-shine",
      TEXT_ADDED: "book-opening",
      TWEET: "twitter"
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
            <i className={iconClass} />
          </figure>
        </div>
      </div>
    );
  }
}
