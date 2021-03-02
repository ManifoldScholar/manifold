import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import { useCurrentUser, useDispatchReadingGroups, useSelectReadingGroups, useDispatchMyCollection, useSelectMyCollection } from "hooks";
import Dialog from "frontend/components/collecting/Dialog";
import Text from "./Text";
import Icons from "./Icons";

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

/*
* TODO:
* [X] get current user (& hide if not authenticated)
* [X] get My Collection (for Dialog)
* [] middleware updates to collectingAPI
* [] finish wiring doCollect() and doRemove() (factor in which group)
* [] finish wiring checkbox state for reading groups (needs middleware update)
*/

function CollectingToggle({ collectable, inline, className }) {
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useDispatchReadingGroups();
  useDispatchMyCollection();
  const myReadingGroups = useSelectReadingGroups();
  const myCollection = useSelectMyCollection();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  const collected = get(collectable, "attributes.collectedByCurrentUser");
  const view = determineView(collected, hovered, confirmed);
  const hasReadingGroups = myReadingGroups?.length > 0;
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
        return "";
    }
  }

  function onSRClick() {
    // show dialog if user belongs to any RGs
    if (hasReadingGroups) return setShowDialog(true);
    collected ? doUncollect() : doCollect();
  }

  function doCollect(group = "me") {
    const call = collectingAPI.collect([collectable]);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);
  }

  function doRemove(group = "me") {
    const call = collectingAPI.remove([collectable]);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);

    setConfirmed(false);
  }

  function onClick() {
    // if confirmed, we're ready to remove
    if (confirmed) return doRemove();
    // show dialog if user belongs to any RGs
    if (hasReadingGroups) return setShowDialog(true);

    // user belongs to no RGs;
    // if collected previously, confirm removal request;
    // otherwise collect
    collected ? setConfirmed(true) : doCollect();
  }

  function onEnter() {
    // don't change toggle presentation if user needs to open dialog
    if (collected && hasReadingGroups) return;
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
  }

  function onDialogChange(group, collected) {
    if (collected) return doRemove(group);
    doCollect(group);
  }

  if (!currentUser) return null;

  return (
    <div>
      <button
        className="sr-collecting-toggle screen-reader-text"
        onClick={onSRClick}
      >
        {screenReaderText()}
      </button>
      <button
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={classNames({
          "collecting-toggle": true,
          "collecting-toggle--inline": inline,
          "collecting-toggle--project-cover": !inline,
          [`${className}`]: !!className,
        })}
        aria-hidden="true"
        tabIndex={-1}
      >
        <div
          className={classNames({
            "collecting-toggle__inner": true,
            [`collecting-toggle__inner--${view}`]: true
          })}
          aria-hidden="true"
        >
          <Icons useOutline={useOutlinedStarIcon} />
          <Text view={view} />
        </div>
      </button>
      {showDialog && (
        <Dialog
          collectable={collectable}
          readingGroups={myReadingGroups}
          myCollection={myCollection}
          onChange={onDialogChange}
          onClose={() => setShowDialog(false)}
        />
      )}
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
