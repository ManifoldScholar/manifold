import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slot from "./Slot";
import { DragDropContext } from "react-beautiful-dnd";
import { actionCalloutsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import * as Styled from "./styles";

const { request } = entityStoreActions;

export default class ActionCallouts extends PureComponent {
  static displayName = "Project.Hero.Builder.ActionCallouts";

  static propTypes = {
    model: PropTypes.object.isRequired,
    refreshActionCallouts: PropTypes.func,
    actionCalloutEditRoute: PropTypes.string.isRequired,
    actionCalloutNewRoute: PropTypes.string.isRequired,
    actionCallouts: PropTypes.array,
    actionCalloutSlots: PropTypes.array
  };

  static getDerivedStateFromProps(props, state) {
    if (props.actionCallouts === state.actionCallouts) return null;

    const slotCallouts = ActionCallouts.slotActionCallouts(
      props.actionCallouts
    );
    return { slotCallouts, actionCallouts: props.actionCallouts };
  }

  static slotActionCallouts(actionCallouts) {
    /* eslint-disable no-param-reassign */
    const out = Object.keys(ActionCallouts.slots).reduce((map, id) => {
      const attributes = ActionCallouts.slots[id].attributes;
      const compareKeys = Object.keys(attributes);
      map[id] = actionCallouts.filter(actionCallout =>
        compareKeys.every(compareKey => {
          const match =
            attributes[compareKey] === actionCallout.attributes[compareKey];
          return match;
        })
      );
      return map;
    }, {});
    return out;
    /* eslint-enable no-param-reassign */
  }

  static slots = {
    "left-button": {
      title: "layout.left_side",
      attributes: { location: "left", button: true }
    },
    "right-button": {
      title: "layout.right_side",
      attributes: { location: "right", button: true }
    },
    "left-link": {
      title: "layout.left_side",
      attributes: { location: "left", button: false }
    },
    "right-link": {
      title: "layout.right_side",
      attributes: { location: "right", button: false }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      slotCallouts: ActionCallouts.slotActionCallouts(props.actionCallouts),
      response: props.actionCalloutsResponse
    };
  }

  onDragEnd = draggable => {
    if (!draggable.source || !draggable.destination) return;
    this.moveToSlot(
      draggable.draggableId,
      draggable.source.droppableId,
      draggable.destination.droppableId,
      draggable.destination.index
    );
    this.updateCallout(
      draggable.draggableId,
      draggable.destination.droppableId,
      draggable.destination.index
    );
  };

  onDragStart = () => {};

  get model() {
    return this.props.model;
  }

  get slotIds() {
    return Object.keys(ActionCallouts.slots);
  }

  updateCallout(id, slotId, index) {
    const baseAttributes = this.findSlot(slotId).attributes;
    const attributes = {
      ...baseAttributes,
      position: index === 0 ? "top" : index + 1
    };
    const call = actionCalloutsAPI.update(id, { attributes });
    const options = { noTouch: true };
    const updateRequest = request(
      call,
      requests.beActionCalloutUpdate,
      options
    );

    const { refreshActionCallouts } = this.props;
    const refreshCallback = refreshActionCallouts || (() => {});
    this.props
      .dispatch(updateRequest)
      .promise.then(refreshCallback, refreshCallback);
  }

  moveToSlot(id, sourceSlotId, destinationSlotId, destinationIndex) {
    this.removeFromSlot(id, sourceSlotId, callout => {
      this.addToSlot(callout, destinationSlotId, destinationIndex);
    });
  }

  replaceSlotInState(slotId, slotCallouts, callback = null) {
    const state = {
      slotCallouts: { ...this.state.slotCallouts, [slotId]: slotCallouts }
    };
    this.setState(state, callback);
  }

  addToSlot(actionCallout, slotId, index) {
    const slotCallouts = this.state.slotCallouts[slotId].slice(0);
    slotCallouts.splice(index, 0, actionCallout);
    this.replaceSlotInState(slotId, slotCallouts);
  }

  removeFromSlot(id, slotId, callback = null) {
    const slotCallouts = this.state.slotCallouts[slotId].slice(0);
    const index = slotCallouts.findIndex(ac => ac.id === id);
    const callout = slotCallouts.splice(index, 1)[0];
    this.replaceSlotInState(slotId, slotCallouts, () => callback(callout));
  }

  findSlot(slotId) {
    return ActionCallouts.slots[slotId];
  }

  actionCalloutsBySlot(slotId) {
    return this.state.slotCallouts[slotId];
  }

  render() {
    return (
      <Styled.CalloutsContainer>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          {this.slotIds
            .filter(slot => this.props.actionCalloutSlots.includes(slot))
            .map(slotId => {
              return (
                <Slot
                  key={slotId}
                  id={slotId}
                  {...this.findSlot(slotId)}
                  model={this.model}
                  actionCalloutEditRoute={this.props.actionCalloutEditRoute}
                  actionCalloutNewRoute={this.props.actionCalloutNewRoute}
                  actionCallouts={this.actionCalloutsBySlot(slotId)}
                />
              );
            })}
        </DragDropContext>
      </Styled.CalloutsContainer>
    );
  }
}
