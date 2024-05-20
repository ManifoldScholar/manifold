import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import withReadingGroups from "hoc/withReadingGroups";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import Dialog from "frontend/components/collecting/Dialog";
import Text from "./Text";
import Icons from "./Icons";
import { inCollections } from "../helpers";
import { useCurrentUser } from "hooks";

const COLLECTABLE_TYPE_RESTRICTED_LIST = ["journals"];

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
  const attrs = collectable.attributes;
  if (!attrs) return "";

  if (attrs.titlePlaintext) return attrs.titlePlaintext;
  if (attrs.title) return attrs.title;
  if (attrs.name) {
    if (attrs.textTitle) return `${attrs.textTitle}: ${attrs.name}`;
    return attrs.name;
  }
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
  setScreenReaderStatus,
  onUncollect,
  hiddenIfUncollected
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const { t } = useTranslation();

  const myCollectableReadingGroups = useMemo(() => {
    if (!Array.isArray(myReadingGroups)) return [];
    return myReadingGroups.filter(rg => rg?.attributes?.abilities?.update);
  }, [myReadingGroups]);

  useEffect(() => {
    if (!dialogVisible || (!onDialogOpen && !onDialogClose)) return;
    onDialogOpen();
  }, [dialogVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentUser = useCurrentUser();

  const dispatch = useDispatch();

  const collected = inCollections(collectable, currentUser, ...myReadingGroups);

  useEffect(() => {
    setIsCollecting(false);
  }, [collected]);

  const view = determineView(collected, hovered, confirmed, isCollecting);
  const hasReadingGroups = myCollectableReadingGroups?.length > 0;
  const collectableTitle = normalizeTitle(collectable);
  const useOutlinedStarIcon = outlined && view === "add";

  const screenReaderButtonText = () => {
    if (hasReadingGroups)
      return t("actions.toggle_collecting", { title: collectableTitle });
    switch (view) {
      case "add":
      case "add-active":
        return t("actions.collect", { title: collectableTitle });
      case "remove":
      case "remove-active":
        return t("actions.uncollect", { title: collectableTitle });
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
    setScreenReaderStatus(t("messages.collected", { title: collectableTitle }));
  }

  function doRemove(collection = currentUser) {
    const call = collectingAPI.remove([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest).promise.then(() => {
      if (onUncollect) onUncollect(collection);
    });
    setConfirmed(false);
    setHovered(false);
    setScreenReaderStatus(
      t("messages.uncollected", { title: collectableTitle })
    );
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

  if (
    !currentUser ||
    COLLECTABLE_TYPE_RESTRICTED_LIST.includes(collectable.type)
  )
    return null;

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
          "collecting-toggle--filled-always": !outlined,
          "collecting-toggle--toc-hidden": hiddenIfUncollected && !collected
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
          readingGroups={myCollectableReadingGroups}
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
  readingGroups: PropTypes.array,
  onDialogOpen: PropTypes.func,
  onDialogClose: PropTypes.func,
  setScreenReaderStatus: PropTypes.func,
  onUncollect: PropTypes.func,
  inline: PropTypes.bool,
  outlined: PropTypes.bool,
  hiddenIfUncollected: PropTypes.bool
};

export default withReadingGroups(withScreenReaderStatus(CollectingToggle));
