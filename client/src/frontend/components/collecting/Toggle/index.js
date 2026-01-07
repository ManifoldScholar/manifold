import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { collectingAPI } from "api";
import withReadingGroups from "hoc/withReadingGroups";
import Dialog from "frontend/components/collecting/Dialog";
import Text from "./Text";
import Icons from "./Icons";
import { inCollections } from "../helpers";
import { useRevalidator } from "react-router";
import { useCurrentUser, useApiCallback } from "hooks";

const COLLECTABLE_TYPE_RESTRICTED_LIST = ["journals"];

function determineView(collected, hovered, isCollecting) {
  if (collected) {
    if (hovered) return "remove-active";
    return "remove";
  } else if (isCollecting) {
    return "remove";
  } else {
    if (hovered) return "add-active";
    return "add";
  }
}

function normalizeTitle(collectable) {
  const attrs = collectable?.attributes;
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
  onUncollect,
  hiddenIfUncollected
}) {
  const [hovered, setHovered] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const myCollectableReadingGroups = !Array.isArray(myReadingGroups)
    ? []
    : myReadingGroups.filter(rg => rg?.attributes?.abilities?.update);

  useEffect(() => {
    if (!dialogVisible || (!onDialogOpen && !onDialogClose)) return;
    onDialogOpen();
  }, [dialogVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentUser = useCurrentUser();
  const { revalidate } = useRevalidator();

  const collectCollectable = useApiCallback(collectingAPI.collect);
  const removeCollectable = useApiCallback(collectingAPI.remove);

  const collected = inCollections(collectable, currentUser, ...myReadingGroups);

  useEffect(() => {
    setIsCollecting(false);
  }, [collected]);

  const view = determineView(collected, hovered, isCollecting);
  const hasReadingGroups = myCollectableReadingGroups?.length > 0;
  const collectableTitle = normalizeTitle(collectable);
  const useOutlinedStarIcon = outlined && view === "add";

  const screenReaderButtonProps = () => {
    if (!hasReadingGroups) return {};
    return {
      "aria-haspopup": true,
      "aria-expanded": dialogVisible
    };
  };

  const doCollect = useCallback(
    async (collection = currentUser) => {
      try {
        await collectCollectable([collectable], collection);
        setHovered(false);
        setIsCollecting(true);
        revalidate();
      } catch (error) {
        console.error("Failed to collect:", error);
      }
    },
    [collectable, currentUser, collectCollectable, revalidate]
  );

  const doRemove = useCallback(
    async (collection = currentUser) => {
      try {
        await removeCollectable([collectable], collection);
        setHovered(false);
        revalidate();
        if (onUncollect) onUncollect(collection);
      } catch (error) {
        console.error("Failed to remove from collection:", error);
      }
    },
    [collectable, currentUser, removeCollectable, onUncollect, revalidate]
  );

  const onClick = useCallback(
    event => {
      event.stopPropagation();
      // show dialog if user belongs to any RGs
      if (hasReadingGroups) return setDialogVisible(true);

      // user belongs to no RGs;
      // if collected previously, remove;
      // otherwise collect
      collected ? doRemove() : doCollect();
    },
    [hasReadingGroups, collected, doRemove, doCollect]
  );

  function onEnter() {
    // don't change toggle presentation if user needs to open dialog
    if (collected && hasReadingGroups) return;
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
  }

  const handleDialogChange = useCallback(
    (isCollected, collection) => {
      if (isCollected) return doRemove(collection);
      doCollect(collection);
    },
    [doRemove, doCollect]
  );

  function handleDialogClose() {
    setDialogVisible(false);
    if (onDialogClose) onDialogClose();
  }

  if (
    !currentUser ||
    COLLECTABLE_TYPE_RESTRICTED_LIST.includes(collectable?.type)
  )
    return null;

  return (
    <>
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
        {...screenReaderButtonProps()}
      >
        <div
          className={classNames({
            "collecting-toggle__inner": true,
            [`collecting-toggle__inner--${view}`]: true
          })}
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
  collectable: PropTypes.object,
  readingGroups: PropTypes.array,
  onDialogOpen: PropTypes.func,
  onDialogClose: PropTypes.func,
  onUncollect: PropTypes.func,
  inline: PropTypes.bool,
  outlined: PropTypes.bool,
  hiddenIfUncollected: PropTypes.bool
};

export default withReadingGroups(CollectingToggle);
