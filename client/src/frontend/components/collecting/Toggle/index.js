import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import withReadingGroups from "hoc/with-reading-groups";
import withScreenReaderStatus from "hoc/with-screen-reader-status";
import Dialog from "frontend/components/collecting/Dialog";
import Text from "./Text";
import Icons from "./Icons";
import { inCollections } from "../helpers";
import useCurrentUser from "hooks/user/use-current-user";

const { request } = entityStoreActions;

function determineView(collected, hovered, confirmed, isCollecting) {
  if (collected) {
    if (hovered && !confirmed) return "remove-active";
    if (hovered && confirmed) return "remove-confirm-active";
    return "remove";
  } else if (isCollecting) {
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

function CollectingToggle({
  collectable,
  inline = true,
  outlined = true,
  onDialogOpen,
  onDialogClose,
  readingGroups: myReadingGroups,
  userMock,
  setScreenReaderStatus,
  onUncollect
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (!dialogVisible || (!onDialogOpen && !onDialogClose)) return;
    onDialogOpen();
  }, [dialogVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log(useCurrentUser);
  const currentUser = useCurrentUser(userMock);
  console.log(currentUser);

  const dispatch = useDispatch();

  const collected = inCollections(collectable, currentUser, ...myReadingGroups);

  useEffect(() => {
    setIsCollecting(false);
  }, [collected]);

  const view = determineView(collected, hovered, confirmed, isCollecting);
  const hasReadingGroups = myReadingGroups?.length > 0;
  const collectableTitle = normalizeTitle(collectable);
  const useOutlinedStarIcon = outlined && view === "add";

  const screenReaderButtonText = () => {
    if (hasReadingGroups) return "Toggle collecting dialog";
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

  const screenReaderButtonProps = () => {
    if (!hasReadingGroups) return {};
    return {
      "aria-haspopup": true,
      "aria-expanded": dialogVisible
    };
  };

  function doCollect(collection = currentUser) {
    const call = collectingAPI.collect([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);
    setHovered(false);
    setIsCollecting(true);
    setScreenReaderStatus(`You collected ${collectableTitle}`);
  }

  function doRemove(collection = currentUser) {
    const call = collectingAPI.remove([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest).promise.then(() => {
      if (onUncollect) onUncollect(collection);
    });
    setConfirmed(false);
    setHovered(false);
    setScreenReaderStatus(`You uncollected ${collectableTitle}`);
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
    setConfirmed(false);
  }

  function handleDialogChange(isCollected, collection) {
    if (isCollected) return doRemove(collection);
    doCollect(collection);
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
        {...screenReaderButtonProps()}
      >
        {screenReaderButtonText()}
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
          currentUser={currentUser}
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
  userMock: PropTypes.object,
  readingGroups: PropTypes.array,
  onDialogOpen: PropTypes.func,
  onDialogClose: PropTypes.func,
  setScreenReaderStatus: PropTypes.func,
  onUncollect: PropTypes.func,
  inline: PropTypes.bool,
  outlined: PropTypes.bool
};

export default withReadingGroups(withScreenReaderStatus(CollectingToggle));
