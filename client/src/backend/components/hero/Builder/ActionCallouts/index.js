import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Slot from "./Slot";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { actionCalloutsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import * as Styled from "./styles";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { withTranslation } from "react-i18next";

const { request } = entityStoreActions;

const SLOTS = {
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

const SLOT_IDS = Object.keys(SLOTS);

const slotActionCallouts = actionCallouts =>
  SLOT_IDS.reduce((map, id) => {
    const attributes = SLOTS[id].attributes;
    const compareKeys = Object.keys(attributes);
    return {
      ...map,
      [id]: actionCallouts.filter(actionCallout =>
        compareKeys.every(
          compareKey =>
            attributes[compareKey] === actionCallout.attributes[compareKey]
        )
      )
    };
  }, {});

function ActionCallouts(props) {
  const {
    model,
    dispatch,
    actionCalloutSlots,
    actionCallouts,
    actionCalloutEditRoute,
    actionCalloutNewRoute,
    t,
    setScreenReaderStatus,
    renderLiveRegion
  } = props;

  const [instanceId] = useState(() => Symbol("actionCallouts"));
  const [slotCallouts, setSlotCallouts] = useState(() =>
    slotActionCallouts(actionCallouts)
  );

  // Re-derive the per-slot grouping when a new actionCallouts list comes down
  // via props (e.g. after an API refresh), mirroring getDerivedStateFromProps.
  const [calloutsRef, setCalloutsRef] = useState(actionCallouts);
  if (calloutsRef !== actionCallouts) {
    setCalloutsRef(actionCallouts);
    setSlotCallouts(slotActionCallouts(actionCallouts));
  }

  const slotCalloutsRef = useRef(slotCallouts);
  slotCalloutsRef.current = slotCallouts;

  const moveToSlot = useCallback(
    (id, sourceSlotId, destinationSlotId, destinationIndex) => {
      setSlotCallouts(prev => {
        const source = prev[sourceSlotId].slice(0);
        const sourceIndex = source.findIndex(ac => ac.id === id);
        if (sourceIndex === -1) return prev;
        const [callout] = source.splice(sourceIndex, 1);
        const destination =
          sourceSlotId === destinationSlotId
            ? source
            : prev[destinationSlotId].slice(0);
        destination.splice(destinationIndex, 0, callout);
        return {
          ...prev,
          [sourceSlotId]: source,
          [destinationSlotId]: destination
        };
      });
    },
    []
  );

  const updateCallout = useCallback(
    (id, slotId, index, callback) => {
      const baseAttributes = SLOTS[slotId].attributes;
      const attributes = {
        ...baseAttributes,
        position: index === 0 ? "top" : index + 1
      };
      const call = actionCalloutsAPI.update(id, { attributes });
      const updateRequest = request(call, requests.beActionCalloutUpdate, {
        noTouch: true
      });

      const refreshCallback = props.refreshActionCallouts || (() => {});
      dispatch(updateRequest).promise.then(() => {
        refreshCallback();
        if (typeof callback === "function") callback();
      });
    },
    [dispatch, props.refreshActionCallouts]
  );

  const onKeyboardMove = useCallback(
    ({ callout, index, slotIndex, direction, callback }) => {
      const id = callout.id;
      const sourceSlotId = SLOT_IDS[slotIndex];
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
          announcement = t("actions.dnd.moved_to_position", {
            title,
            position: position - 1
          });
          break;
        case "down":
          destinationSlotIndex = slotIndex;
          destinationIndex = index + 1;
          announcement = t("actions.dnd.moved_to_position", {
            title,
            position: position + 1
          });
          break;
        case "left":
          destinationSlotIndex = slotIndex - 1;
          destinationIndex = 0;
          announcement = t("actions.dnd.moved_to_group", {
            title,
            group: slotPosition - 1,
            position: 1
          });
          break;
        case "right":
          destinationSlotIndex = slotIndex + 1;
          destinationIndex = 0;
          announcement = t("actions.dnd.moved_to_group", {
            title,
            group: slotPosition + 1,
            position: 1
          });
          break;
        default:
          break;
      }

      const destinationSlotId = SLOT_IDS[destinationSlotIndex];

      moveToSlot(id, sourceSlotId, destinationSlotId, destinationIndex);

      const done = () => {
        if (typeof callback === "function") callback();
        if (announcement) setScreenReaderStatus(announcement);
      };
      updateCallout(id, destinationSlotId, destinationIndex, done);
    },
    [moveToSlot, updateCallout, setScreenReaderStatus, t]
  );

  // The window-level monitor is registered once but needs the current slot
  // groupings and the move handlers on drop, so route it through a ref.
  const handleDrop = ({ source, location }) => {
    const sourceSlotId = source.data.slotId;
    const calloutId = source.data.calloutId;
    const sourceIndex = source.data.index;

    const targets = location.current.dropTargets;
    if (!targets.length) return;

    const chipTarget = targets.find(target => target.data.type === "chip");
    const slotTarget = targets.find(target => target.data.isSlot);
    const destinationSlotId =
      slotTarget?.data.slotId ?? chipTarget?.data.slotId;
    if (!destinationSlotId) return;

    const destinationList = slotCalloutsRef.current[destinationSlotId];

    let destinationIndex;
    if (chipTarget) {
      const rawIndex = destinationList.findIndex(
        c => c.id === chipTarget.data.calloutId
      );
      if (rawIndex === -1) return;
      const edge = extractClosestEdge(chipTarget.data);
      destinationIndex = edge === "bottom" ? rawIndex + 1 : rawIndex;
    } else {
      destinationIndex = destinationList.length;
    }

    // Account for the source being removed from the list before re-insertion.
    if (sourceSlotId === destinationSlotId && sourceIndex < destinationIndex) {
      destinationIndex -= 1;
    }
    if (
      sourceSlotId === destinationSlotId &&
      sourceIndex === destinationIndex
    ) {
      return;
    }

    moveToSlot(calloutId, sourceSlotId, destinationSlotId, destinationIndex);
    updateCallout(calloutId, destinationSlotId, destinationIndex);
  };
  const dropHandlerRef = useRef(handleDrop);
  dropHandlerRef.current = handleDrop;

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.instanceId === instanceId,
        onDrop: args => dropHandlerRef.current(args)
      }),
      autoScrollWindowForElements()
    );
  }, [instanceId]);

  return (
    <Styled.CalloutsContainer>
      {SLOT_IDS.filter(slot => actionCalloutSlots.includes(slot)).map(
        (slotId, index) => (
          <Slot
            key={slotId}
            id={slotId}
            {...SLOTS[slotId]}
            instanceId={instanceId}
            model={model}
            actionCalloutEditRoute={actionCalloutEditRoute}
            actionCalloutNewRoute={actionCalloutNewRoute}
            actionCallouts={slotCallouts[slotId]}
            index={index}
            slotCount={SLOT_IDS.length}
            onKeyboardMove={onKeyboardMove}
          />
        )
      )}
      {renderLiveRegion("alert")}
    </Styled.CalloutsContainer>
  );
}

ActionCallouts.displayName = "Project.Hero.Builder.ActionCallouts";

ActionCallouts.propTypes = {
  model: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  refreshActionCallouts: PropTypes.func,
  actionCalloutEditRoute: PropTypes.string.isRequired,
  actionCalloutNewRoute: PropTypes.string.isRequired,
  actionCallouts: PropTypes.array,
  actionCalloutSlots: PropTypes.array,
  t: PropTypes.func,
  setScreenReaderStatus: PropTypes.func,
  renderLiveRegion: PropTypes.func
};

export default withTranslation()(withScreenReaderStatus(ActionCallouts, false));
