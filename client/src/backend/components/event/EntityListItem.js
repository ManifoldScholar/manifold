import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Event from "frontend/components/event";
import EntityRow from "../list/EntitiesList/Entity/Row";

export default class EventListItem extends PureComponent {
  static displayName = "Event.ListItem";

  static propTypes = {
    entity: PropTypes.object,
    destroyHandler: PropTypes.func
  };

  triggerDestroy = event => {
    event.preventDefault();
    this.props.destroyHandler(this.props.entity);
  };

  render() {
    const event = this.props.entity;
    if (!event) return null;
    return (
      <li className="event-entity-row">
        <Event.Event
          itemClass=""
          event={event}
          hideLink
          listStyle={this.props.listStyle}
          destroyCallback={this.triggerDestroy}
        />
      </li>
    );
  }
}
