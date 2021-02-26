import React, { useState } from "react";
import classNames from "classnames";
import get from "lodash/get";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";

const { request } = entityStoreActions;

export default function CollectingToggle({ collectable }) {
  const collected = get(collectable, "attributes.collectedByCurrentUser");
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dispatch = useDispatch();

  function determineView() {
    if (collected) {
      if (hovered && !confirmed) return "remove-active";
      if (hovered && confirmed) return "remove-confirm-active";
      return "remove";
    } else {
      if (hovered) return "add-active";
      return "add";
    }
  }

  function screenReaderText() {
    return "figure out some SR text here";
  }

  function onSRClick() {}

  function doCollect() {
    const call = collectingAPI.collect([collectable]);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);
  }

  function doRemove() {
    const call = collectingAPI.remove([collectable]);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);
  }

  function onClick() {
    collected ? doRemove() : doCollect();
  }

  function onEnter() {
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
  }

  return <button onClick={onClick}>{collected ? "remove" : "collect"}</button>;

  return (
    <div>
      <button
        className="collect-toggle collect-toggle--sr-only screen-reader-text"
        onClick={onSRClick}
      >
        {screenReaderText()}
      </button>
      <button
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={classNames({
          "collect-toggle": true,
          "collect-toggle--project-cover": true,
          [`collect-toggle--${determineView()}`]: true
        })}
        aria-hidden="true"
        tabIndex={-1}
      >
        <div
          className={classNames({
            "collect-toggle__inner": true,
            [`collect-toggle__inner--${determineView()}`]: true
          })}
          aria-hidden="true"
        >
          <div className="collect-toggle__icons">
            <IconComposer
              icon="MinusUnique"
              size={28}
              iconClass="collect-toggle__icon collect-toggle__icon--remove"
            />
            <IconComposer
              icon="CheckUnique"
              size={28}
              iconClass="collect-toggle__icon collect-toggle__icon--confirm"
            />
            <IconComposer
              icon="StarFillUnique"
              size="default"
              iconClass="collect-toggle__icon collect-toggle__icon--add"
            />
          </div>
          {collected ? "IN" : "OUT"}
        </div>
      </button>
    </div>
  );
}
