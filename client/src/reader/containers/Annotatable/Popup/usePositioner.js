import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import throttle from "lodash/throttle";

export default function usePositioner({
  popupRef,
  selectionState,
  annotatableRef
}) {
  const { selection, popupTriggerX, popupTriggerY } = selectionState;

  const selectionRect = selection?.range
    ? selection.range.getBoundingClientRect()
    : null;

  const popupDimensions = useCallback(() => {
    if (!popupRef)
      throw new Error("Cannot get popupDimensions without a popupRef");

    const measureableNode = popupRef.firstChild ?? popupRef;
    return {
      height: measureableNode.offsetHeight,
      width: measureableNode.offsetWidth
    };
  }, [popupRef]);

  const isPositionable = useCallback(() => {
    if (!selection) return false;
    if (!annotatableRef) return false;
    if (!selection.range) return false;
    if (!selectionRect) return false;
    if (!popupRef) return false;
    return true;
  }, [selection, annotatableRef, selectionRect, popupRef]);

  const scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset;

  const annotatableRect = useCallback(() => {
    if (!annotatableRef)
      throw new Error("Cannot get annotatableRect without an annotatableRef");
    const el = annotatableRef.querySelector(".manifold-text-section");
    return el.getBoundingClientRect();
  }, [annotatableRef]);

  const margin = annotatableRect().left;

  const hasTriggers =
    popupTriggerX !== null &&
    popupTriggerX !== undefined &&
    popupTriggerY !== null &&
    popupTriggerY !== undefined;

  const shouldPreferBottom =
    Math.abs(selectionRect.bottom - popupTriggerY) <
    Math.abs(popupTriggerY - selectionRect.top);

  const validateLeft = (left, minLeft, maxLeft) => {
    let out = left;
    if (isNaN(out)) out = minLeft;
    if (out < minLeft) out = minLeft;
    if (out > maxLeft) out = maxLeft;
    return out;
  };

  const minAndMaxLeft = useCallback(
    (rect, popupWidth) => {
      const minLeft = Math.max(margin * -1 + 25, rect.left - popupWidth / 2);
      const maxLeft = margin + annotatableRect.width - popupWidth * 0.5;
      return { minLeft, maxLeft };
    },
    [margin, annotatableRect]
  );

  const withUnit = value => {
    if (value === "auto") return value;
    return `${Math.round(value)}px`;
  };

  const updatePosition = useCallback(() => {
    if (!isPositionable()) return { direction: "up", style: {} };

    try {
      const { height: popupHeight, width: popupWidth } = popupDimensions();
      const { minLeft, maxLeft } = minAndMaxLeft(selectionRect, popupWidth);

      // Get crossbrowser document scrollTop
      const topVisiblePosition = scrollTop + 100;
      const bottomVisiblePosition = scrollTop + window.innerHeight;
      const popupTopEdgeIfUp = scrollTop + selectionRect.top - popupHeight;
      const popupBottomEdgeIfDown =
        scrollTop + selectionRect.bottom + popupHeight;
      const topCollisionPossible = popupTopEdgeIfUp < topVisiblePosition;
      const bottomCollisionPossible =
        popupBottomEdgeIfDown > bottomVisiblePosition;

      let left;
      let top;
      let bottom;
      let currentDirection = "up";

      if (hasTriggers) {
        left = popupTriggerX - popupWidth / 2;
      } else {
        // If there's no click event, we're probably responding to a window resizing, in which
        // case we can try to keep the left position as is.
        left = popupRef.getBoundingClientRect().left;
      }

      left = validateLeft(left, minLeft, maxLeft);

      // Hardcode offset so that the tail of the popup doesn't sit right on top of
      // the text.
      if (
        topCollisionPossible ||
        (shouldPreferBottom && !bottomCollisionPossible)
      ) {
        currentDirection = "down";
        const naturalBottomPosition =
          window.pageYOffset + selectionRect.bottom + 50;
        top = naturalBottomPosition;
        bottom = "auto";
      } else {
        top = "auto";
        const naturalTopPosition = window.pageYOffset + selectionRect.top - 30;
        bottom = window.innerHeight - naturalTopPosition;
      }

      const styleProps = {
        position: "absolute",
        top: withUnit(top),
        bottom: withUnit(bottom),
        left: withUnit(left)
      };

      return { direction: currentDirection, style: styleProps };
    } catch (error) {
      /* eslint-disable no-console */
      console.log("There was an error positioning the annotation popup");
      console.log(error);
      /* eslint-enable no-console */
      return { direction: "up", style: {} };
    }
  }, [
    popupRef,
    scrollTop,
    selectionRect,
    hasTriggers,
    isPositionable,
    minAndMaxLeft,
    popupDimensions,
    shouldPreferBottom,
    popupTriggerX
  ]);

  const [values, setValues] = useState({ direction: "up", style: {} });

  useEffect(() => {
    const onResize = throttle(() => {
      setValues(updatePosition());
    }, 400);
    window.addEventListener("resize", onResize);

    return window.removeEventListener("resize", onResize);
  }, [updatePosition]);

  useEffect(() => {
    if (!values.style.top) {
      const { direction, style } = updatePosition();
      setValues({ direction, style });
    }
  }, [updatePosition, values.style.top]);

  return values;
}
