import React, { Component } from "react";
import PropTypes from "prop-types";
import Event from "../Event";
import * as Styled from "./styles";

export default class EventList extends Component {
  static displayName = "Event.List";

  static propTypes = {
    events: PropTypes.array.isRequired
  };

  render() {
    if (!this.props.events) return null;

    return (
      <Styled.List>
        {this.props.events.map(event => {
          return <Styled.Item as={Event} event={event} key={event.id} />;
        })}
      </Styled.List>
    );
  }
}
