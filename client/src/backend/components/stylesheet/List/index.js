import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import Stylesheet from "./Stylesheet";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { setOrderByChange } from "helpers/dnd";
import { withTranslation } from "react-i18next";

const cloneStylesheets = stylesheets => (stylesheets || []).slice(0);

function StylesheetList({
  text,
  stylesheets,
  callbacks,
  t,
  setScreenReaderStatus,
  renderLiveRegion
}) {
  const [instanceId] = useState(() => Symbol("stylesheetList"));
  const [ordered, setOrdered] = useState(() => cloneStylesheets(stylesheets));
  const [isListDragging, setIsListDragging] = useState(false);

  // Reset the internal ordering only when the parent text changes, mirroring
  // the old getDerivedStateFromProps (which keyed off props.text).
  const [textRef, setTextRef] = useState(text);
  if (textRef !== text) {
    setTextRef(text);
    setOrdered(cloneStylesheets(stylesheets));
  }

  // The window-level monitor is registered once but needs the current order and
  // persistence callback on drop, so read them through refs.
  const orderedRef = useRef(ordered);
  orderedRef.current = ordered;
  const updatePositionRef = useRef(callbacks.updatePosition);
  updatePositionRef.current = callbacks.updatePosition;

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.instanceId === instanceId,
        onDragStart: () => setIsListDragging(true),
        onDrop({ source, location }) {
          setIsListDragging(false);

          const target = location.current.dropTargets[0];
          if (!target) return;

          const list = orderedRef.current;
          const startIndex = list.findIndex(s => s.id === source.data.id);
          const indexOfTarget = list.findIndex(s => s.id === target.data.id);
          if (startIndex === -1 || indexOfTarget === -1) return;

          const reordered = reorderWithEdge({
            axis: "vertical",
            list,
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget: extractClosestEdge(target.data)
          });

          const finalIndex = reordered.findIndex(s => s.id === source.data.id);
          if (finalIndex === startIndex) return;

          setOrdered(reordered);
          updatePositionRef.current(reordered[finalIndex], finalIndex + 1);
        }
      }),
      autoScrollWindowForElements()
    );
  }, [instanceId]);

  const onKeyboardMove = useCallback(
    ({ id, title, index, direction, callback }) => {
      const list = orderedRef.current;
      const newIndex = direction === "down" ? index + 1 : index - 1;
      const stylesheet = list.find(s => s.id === id);
      if (!stylesheet || newIndex < 0 || newIndex >= list.length) return;

      const reordered = setOrderByChange(list, index, newIndex);
      setOrdered(reordered);

      const announcement = t("actions.dnd.moved_to_position", {
        title,
        position: newIndex + 1
      });
      const done = () => {
        setScreenReaderStatus(announcement);
        if (typeof callback === "function") callback();
      };
      updatePositionRef.current(stylesheet, newIndex + 1, done);
    },
    [setScreenReaderStatus, t]
  );

  return (
    <>
      <section className="ordered-records">
        <div
          className={classNames({
            "ordered-records__dropzone": true,
            "ordered-records__dropzone--active": isListDragging
          })}
        >
          {ordered.map((stylesheet, index) => (
            <Stylesheet
              index={index}
              text={text}
              callbacks={callbacks}
              stylesheet={stylesheet}
              key={stylesheet.id}
              instanceId={instanceId}
              stylesheetCount={ordered.length}
              onKeyboardMove={onKeyboardMove}
            />
          ))}
        </div>
      </section>
      {renderLiveRegion("alert")}
    </>
  );
}

StylesheetList.displayName = "Stylesheet.List";

StylesheetList.propTypes = {
  text: PropTypes.object,
  stylesheets: PropTypes.array,
  callbacks: PropTypes.object.isRequired,
  t: PropTypes.func,
  setScreenReaderStatus: PropTypes.func,
  renderLiveRegion: PropTypes.func
};

export default withTranslation()(withScreenReaderStatus(StylesheetList, false));
