import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slot from "./Slot";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { actionCalloutsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import * as Styled from "./styles";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { withTranslation } from "react-i18next";

const { request } = entityStoreActions;

class ActionCallouts extends PureComponent {
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

  onKeyboardMove = ({ callout, index, slotIndex, direction, ...rest }) => {
    const id = callout.id;
    const sourceSlotId = this.slotIds[slotIndex];
    const title = callout.attributes.title;
    const position = index + 1;
    const slotPosition = slotIndex + 1;

    let destinationSlotIndex;
    let destinationIndex;
    let announcement;
    switch (direction) {
      case "up":
        destinationSlotIndex = slotIndex;
        destinationIndex = index - 1;
        announcement = this.props.t("actions.dnd.moved_to_position", {
          title,
          position: position - 1
        });
        break;
      case "down":
        destinationSlotIndex = slotIndex;
        destinationIndex = index + 1;
        announcement = this.props.t("actions.dnd.moved_to_position", {
          title,
          position: position + 1
        });
        break;
      case "left":
        destinationSlotIndex = slotIndex - 1;
        destinationIndex = 0;
        announcement = this.props.t("actions.dnd.moved_to_group", {
          title,
          group: slotPosition - 1,
          position: 1
        });
        break;
      case "right":
        destinationSlotIndex = slotIndex + 1;
        destinationIndex = 0;
        announcement = this.props.t("actions.dnd.moved_to_group", {
          title,
          group: slotPosition + 1,
          position: 1
        });
        break;
      default:
        break;
    }

    const destinationSlotId = this.slotIds[destinationSlotIndex];

    this.moveToSlot(id, sourceSlotId, destinationSlotId, destinationIndex);

    const callback = () => {
      if (rest.callback && typeof rest.callback === "function") {
        rest.callback();
      }
      if (announcement) {
        this.announce(announcement);
      }
    };
    this.updateCallout(id, destinationSlotId, destinationIndex, callback);
  };

  get model() {
    return this.props.model;
  }

  get slotIds() {
    return Object.keys(ActionCallouts.slots);
  }

  get announce() {
    return this.props.setScreenReaderStatus;
  }

  updateCallout(id, slotId, index, callback) {
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
    this.props.dispatch(updateRequest).promise.then(() => {
      refreshCallback();
      if (callback && typeof callback === "function") {
        callback();
      }
    });
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
      <Styled.CalloutsContainer className="rbd-migration-resets">
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          {this.slotIds
            .filter(slot => this.props.actionCalloutSlots.includes(slot))
            .map((slotId, index) => {
              return (
                <Slot
                  key={slotId}
                  id={slotId}
                  {...this.findSlot(slotId)}
                  model={this.model}
                  actionCalloutEditRoute={this.props.actionCalloutEditRoute}
                  actionCalloutNewRoute={this.props.actionCalloutNewRoute}
                  actionCallouts={this.actionCalloutsBySlot(slotId)}
                  index={index}
                  slotCount={this.slotIds.length}
                  onKeyboardMove={this.onKeyboardMove}
                />
              );
            })}
        </DragDropContext>
        {this.props.renderLiveRegion("alert")}
      </Styled.CalloutsContainer>
    );
  }
}

export default withTranslation()(withScreenReaderStatus(ActionCallouts, false));
