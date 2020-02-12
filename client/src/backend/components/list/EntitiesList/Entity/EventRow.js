import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Event from "frontend/components/event";

export default class EventRow extends PureComponent {
  static displayName = "EntitiesList.Entity.EventRow";

  static propTypes = {
    listStyle: PropTypes.oneOf(["tiles"]),
    entity: PropTypes.object,
    destroyHandler: PropTypes.func
  };

  get itemClass() {
    return "event-entity-row__inner";
  }

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
          itemTag="div"
          itemClass={this.itemClass}
          event={event}
          hideLink
          listStyle={this.props.listStyle}
          destroyCallback={this.triggerDestroy}
        />
      </li>
    );
  }
}
