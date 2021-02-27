import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import IconComposer from "global/components/utility/IconComposer";
import Text from "./Text";

const { request } = entityStoreActions;

function determineView(collected, hovered, confirmed) {
  if (collected) {
    if (hovered && !confirmed) return "remove-active";
    if (hovered && confirmed) return "remove-confirm-active";
    return "remove";
  } else {
    if (hovered) return "add-active";
    return "add";
  }
}

function CollectingToggle({ collectable, inline, className }) {
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dispatch = useDispatch();

  const collected = get(collectable, "attributes.collectedByCurrentUser");
  const view = determineView(collected, hovered, confirmed);
  const collectableTitle = collectable.attributes.title;
  const useOutlinedStarIcon = inline && (view === "add" || view === "remove");

  const screenReaderText = () => {
    switch (view) {
      case "add":
      case "add-active":
        return `Collect ${collectableTitle}`;
      case "remove":
      case "remove-active":
        return `Uncollect ${collectableTitle}`;
      default:
        return null;
    }
  }

  function onSRClick() {
    collected ? doUncollect() : doCollect();
  }

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

  return (
    <div>
      <button
        className="collect-toggle collect-toggle--sr-only screen-reader-text"
        onClick={onSRClick}
      >
        {screenReaderText}
      </button>
      <button
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={classNames({
          "collect-toggle": true,
          "collect-toggle--inline": inline,
          "collect-toggle--project-cover": !inline,
          [`${className}`]: !!className,
        })}
        aria-hidden="true"
        tabIndex={-1}
      >
        <div
          className={classNames({
            "collect-toggle__inner": true,
            [`collect-toggle__inner--${view}`]: true
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
            {!useOutlinedStarIcon && (
              <IconComposer
                icon="StarFillUnique"
                size="default"
                iconClass="collect-toggle__icon collect-toggle__icon--add"
              />
            )}
            {useOutlinedStarIcon && (
              <IconComposer
                icon="StarOutlineUnique"
                size="default"
                iconClass="collect-toggle__icon collect-toggle__icon--add"
              />
            )}
          </div>
          <Text view={view} />
        </div>
      </button>
    </div>
  );
}

CollectingToggle.displayName = "Collecting.Toggle";

CollectingToggle.propTypes = {
  collectable: PropTypes.object.isRequired,
  inline: PropTypes.bool,
  className: PropTypes.string,
}

CollectingToggle.defaultProps = {
  inline: true,
}

export default CollectingToggle;
