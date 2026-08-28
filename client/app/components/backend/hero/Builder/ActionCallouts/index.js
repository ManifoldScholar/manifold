import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import Slot from "./Slot";
import { actionCalloutsAPI } from "api";
import { useApiCallback } from "hooks";
import ClientOnly from "components/global/utility/ClientOnly";
import * as Styled from "./styles";

const slots = {
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

const slotIds = Object.keys(slots);

function computeSlotCallouts(actionCallouts) {
  return slotIds.reduce((map, id) => {
    const attrs = slots[id].attributes;
    const compareKeys = Object.keys(attrs);
    return {
      ...map,
      [id]: actionCallouts.filter(ac =>
        compareKeys.every(key => attrs[key] === ac.attributes[key])
      )
    };
  }, {});
}

export default function ActionCallouts({
  model,
  actionCalloutEditRoute,
  actionCalloutNewRoute,
  actionCallouts,
  actionCalloutSlots
}) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const updateCallout = useApiCallback(actionCalloutsAPI.update);

  const [instanceId] = useState(() => Symbol("actionCallouts"));
  const [slotCallouts, setSlotCallouts] = useState(() =>
    computeSlotCallouts(actionCallouts)
  );

  const [calloutsRef, setCalloutsRef] = useState(actionCallouts);
  if (calloutsRef !== actionCallouts) {
    setCalloutsRef(actionCallouts);
    setSlotCallouts(computeSlotCallouts(actionCallouts));
  }

  const slotCalloutsRef = useRef(slotCallouts);
  slotCalloutsRef.current = slotCallouts;

  // Screen reader announcements
  const [srMessage, setSrMessage] = useState(null);
  const srTimeoutRef = useRef(null);

  const announce = useCallback(message => {
    setSrMessage(message);
    if (srTimeoutRef.current) clearTimeout(srTimeoutRef.current);
    srTimeoutRef.current = setTimeout(() => setSrMessage(null), 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (srTimeoutRef.current) clearTimeout(srTimeoutRef.current);
    };
  }, []);

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

  const doUpdateCallout = useCallback(
    (id, slotId, index, callback) => {
      const baseAttributes = slots[slotId].attributes;
      const attributes = {
        ...baseAttributes,
        position: index === 0 ? "top" : index + 1
      };
      updateCallout(id, { attributes }).then(() => {
        revalidate();
        if (typeof callback === "function") callback();
      });
    },
    [updateCallout, revalidate]
  );

  const onKeyboardMove = useCallback(
    ({ callout, index, slotIndex, direction, callback }) => {
      const id = callout.id;
      const sourceSlotId = slotIds[slotIndex];
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

      const destinationSlotId = slotIds[destinationSlotIndex];

      moveToSlot(id, sourceSlotId, destinationSlotId, destinationIndex);

      const done = () => {
        if (typeof callback === "function") callback();
        if (announcement) announce(announcement);
      };
      doUpdateCallout(id, destinationSlotId, destinationIndex, done);
    },
    [moveToSlot, doUpdateCallout, announce, t]
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
    doUpdateCallout(calloutId, destinationSlotId, destinationIndex);
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
    <ClientOnly>
      <Styled.CalloutsContainer>
        {slotIds
          .filter(slot => actionCalloutSlots.includes(slot))
          .map((slotId, index) => (
            <Slot
              key={slotId}
              id={slotId}
              {...slots[slotId]}
              instanceId={instanceId}
              model={model}
              actionCalloutEditRoute={actionCalloutEditRoute}
              actionCalloutNewRoute={actionCalloutNewRoute}
              actionCallouts={slotCallouts[slotId]}
              index={index}
              slotCount={slotIds.length}
              onKeyboardMove={onKeyboardMove}
            />
          ))}
        <div role="alert" aria-atomic className="screen-reader-text">
          {srMessage}
        </div>
      </Styled.CalloutsContainer>
    </ClientOnly>
  );
}

ActionCallouts.displayName = "Project.Hero.Builder.ActionCallouts";

ActionCallouts.propTypes = {
  model: PropTypes.object.isRequired,
  actionCalloutEditRoute: PropTypes.func.isRequired,
  actionCalloutNewRoute: PropTypes.func.isRequired,
  actionCallouts: PropTypes.array,
  actionCalloutSlots: PropTypes.array
};
