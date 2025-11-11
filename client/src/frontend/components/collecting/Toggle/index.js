import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import withReadingGroups from "hoc/withReadingGroups";
import Dialog from "frontend/components/collecting/Dialog";
import Text from "./Text";
import Icons from "./Icons";
import { inCollections } from "../helpers";
import { useCurrentUser } from "hooks";

const COLLECTABLE_TYPE_RESTRICTED_LIST = ["journals"];

const { request } = entityStoreActions;

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

  const dispatch = useDispatch();

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

  function doCollect(collection = currentUser) {
    const call = collectingAPI.collect([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest);
    setHovered(false);
    setIsCollecting(true);
  }

  function doRemove(collection = currentUser) {
    const call = collectingAPI.remove([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    dispatch(collectRequest).promise.then(() => {
      if (onUncollect) onUncollect(collection);
    });
    setHovered(false);
  }

  function onClick(event) {
    event.stopPropagation();
    // show dialog if user belongs to any RGs
    if (hasReadingGroups) return setDialogVisible(true);

    // user belongs to no RGs;
    // if collected previously, remove;
    // otherwise collect
    collected ? doRemove() : doCollect();
  }

  function onEnter() {
    // don't change toggle presentation if user needs to open dialog
    if (collected && hasReadingGroups) return;
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
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
    COLLECTABLE_TYPE_RESTRICTED_LIST.includes(collectable?.type)
  )
    return null;

  return (
    <>
      <button
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
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
