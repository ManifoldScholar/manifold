import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import {
  useCurrentUser,
  useDispatchReadingGroups,
  useSelectReadingGroups,
  useDispatchMyCollection,
  useSelectMyCollection
} from "hooks";
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

function normalizeTitle(collectable) {
  if (collectable.attributes?.title) return collectable.attributes.title;
  if (collectable.label) return collectable.label;
  return "";
}

/*
 * TODO:
 * [X] get current user (& hide if not authenticated)
 * [X] get My Collection (for Dialog)
 * [] middleware updates to collectingAPI
 * [] finish wiring doCollect() and doRemove() (factor in which group)
 * [] finish wiring checkbox state for reading groups (needs middleware update)
 * [] need `collectedByCurrentUser` for text sections
 * [] optimize API fetching (expensive in projects, reader views)
 */

function CollectingToggle({
  collectable,
  inline = true,
  outlined = true,
  onDialogOpen,
  onDialogClose
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (!dialogVisible || (!onDialogOpen && !onDialogClose)) return;
    onDialogOpen();
  }, [dialogVisible]);

  useDispatchReadingGroups();
  useDispatchMyCollection();
  const myReadingGroups = useSelectReadingGroups();
  const myCollection = useSelectMyCollection();
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  const collected = get(collectable, "attributes.collectedByCurrentUser");
  const view = determineView(collected, hovered, confirmed, dialogVisible);
  const hasReadingGroups = myReadingGroups?.length > 0;
  const collectableTitle = normalizeTitle(collectable);
  const useOutlinedStarIcon = outlined && view === "add";

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
  };

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

  function onSRClick(event) {
    event.stopPropagation();
    // show dialog if user belongs to any RGs
    if (hasReadingGroups) return setDialogVisible(true);
    collected ? doRemove() : doCollect();
  }

  function onClick(event) {
    event.stopPropagation();
    // if confirmed, we're ready to remove
    if (confirmed) return doRemove();
    // show dialog if user belongs to any RGs
    if (hasReadingGroups) return setDialogVisible(true);

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

  function handleDialogChange(group, isCollected) {
    if (isCollected) return doRemove(group);
    doCollect(group);
  }

  function handleDialogClose() {
    setDialogVisible(false);
    if (onDialogClose) onDialogClose();
  }

  if (!currentUser) return null;

  return (
    <>
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
          "collecting-toggle--outlined": outlined,
          "collecting-toggle--filled-always": !outlined
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
      {dialogVisible && (
        <Dialog
          collectable={collectable}
          title={collectableTitle}
          readingGroups={myReadingGroups}
          myCollection={myCollection}
          onChange={handleDialogChange}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}

CollectingToggle.displayName = "Collecting.Toggle";

CollectingToggle.propTypes = {
  collectable: PropTypes.object.isRequired,
  onDialogOpen: PropTypes.func,
  onDialogClose: PropTypes.func,
  inline: PropTypes.bool,
  outlined: PropTypes.bool
};

export default CollectingToggle;
