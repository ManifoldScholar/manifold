import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useRevalidator } from "react-router";
import { useTranslation } from "react-i18next";
import Slot from "./Slot";
import { DragDropContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { actionCalloutsAPI } from "api";
import { useApiCallback } from "hooks";
import ClientOnly from "global/components/utility/ClientOnly";
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

  const [slotCallouts, setSlotCallouts] = useState(() =>
    computeSlotCallouts(actionCallouts)
  );
  const prevCalloutsRef = useRef(actionCallouts);

  useEffect(() => {
    if (actionCallouts !== prevCalloutsRef.current) {
      prevCalloutsRef.current = actionCallouts;
      setSlotCallouts(computeSlotCallouts(actionCallouts));
    }
  }, [actionCallouts]);

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

  const addToSlot = useCallback((actionCallout, slotId, index) => {
    setSlotCallouts(prev => {
      const arr = prev[slotId].slice(0);
      arr.splice(index, 0, actionCallout);
      return { ...prev, [slotId]: arr };
    });
  }, []);

  const removeFromSlot = useCallback((id, slotId, callback) => {
    setSlotCallouts(prev => {
      const arr = prev[slotId].slice(0);
      const index = arr.findIndex(ac => ac.id === id);
      const callout = arr.splice(index, 1)[0];
      setTimeout(() => callback(callout), 0);
      return { ...prev, [slotId]: arr };
    });
  }, []);

  const moveToSlot = useCallback(
    (id, sourceSlotId, destinationSlotId, destinationIndex) => {
      removeFromSlot(id, sourceSlotId, callout => {
        addToSlot(callout, destinationSlotId, destinationIndex);
      });
    },
    [removeFromSlot, addToSlot]
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
        if (callback && typeof callback === "function") callback();
      });
    },
    [updateCallout, revalidate]
  );

  const onDragEnd = useCallback(
    draggable => {
      if (!draggable.source || !draggable.destination) return;
      moveToSlot(
        draggable.draggableId,
        draggable.source.droppableId,
        draggable.destination.droppableId,
        draggable.destination.index
      );
      doUpdateCallout(
        draggable.draggableId,
        draggable.destination.droppableId,
        draggable.destination.index
      );
    },
    [moveToSlot, doUpdateCallout]
  );

  const onKeyboardMove = useCallback(
    ({ callout, index, slotIndex, direction, ...rest }) => {
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

      const callback = () => {
        if (rest.callback && typeof rest.callback === "function") {
          rest.callback();
        }
        if (announcement) {
          announce(announcement);
        }
      };
      doUpdateCallout(id, destinationSlotId, destinationIndex, callback);
    },
    [moveToSlot, doUpdateCallout, announce, t]
  );

  const renderLiveRegion = useCallback(
    (role = "alert") => {
      const roleProps =
        role === "alert"
          ? { role: "alert" }
          : { role: "status", "aria-live": "polite" };
      return (
        <div {...roleProps} aria-atomic className="screen-reader-text">
          {srMessage}
        </div>
      );
    },
    [srMessage]
  );

  return (
    <ClientOnly>
      <Styled.CalloutsContainer className="rbd-migration-resets">
        <DragDropContext onDragStart={() => {}} onDragEnd={onDragEnd}>
          {slotIds
            .filter(slot => actionCalloutSlots.includes(slot))
            .map((slotId, index) => {
              return (
                <Slot
                  key={slotId}
                  id={slotId}
                  {...slots[slotId]}
                  model={model}
                  actionCalloutEditRoute={actionCalloutEditRoute}
                  actionCalloutNewRoute={actionCalloutNewRoute}
                  actionCallouts={slotCallouts[slotId]}
                  index={index}
                  slotCount={slotIds.length}
                  onKeyboardMove={onKeyboardMove}
                />
              );
            })}
        </DragDropContext>
        {renderLiveRegion("alert")}
      </Styled.CalloutsContainer>
    </ClientOnly>
  );
}

ActionCallouts.displayName = "Project.Hero.Builder.ActionCallouts";

ActionCallouts.propTypes = {
  model: PropTypes.object.isRequired,
  refreshActionCallouts: PropTypes.func,
  actionCalloutEditRoute: PropTypes.func.isRequired,
  actionCalloutNewRoute: PropTypes.func.isRequired,
  actionCallouts: PropTypes.array,
  actionCalloutSlots: PropTypes.array
};
