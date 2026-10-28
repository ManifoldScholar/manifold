import { useState, useEffect, useRef, useId } from "react";
import PropTypes from "prop-types";
import { collectingAPI, requests } from "api";
import { useDispatch } from "react-redux";
import { entityStoreActions } from "actions";
import withReadingGroups from "hoc/withReadingGroups";
import Popover from "frontend/components/collecting/Popover";
import Text from "./Text";
import Icons from "./Icons";
import { inCollections } from "../helpers";
import { useCurrentUser } from "hooks";
import * as Styled from "./styles";

const COLLECTABLE_TYPE_RESTRICTED_LIST = ["journals"];

const { request } = entityStoreActions;

/**
 * Returns the toggle view. The views are:
 *
 * - `add`: uncollected, resting.
 * - `add-active`: uncollected, hovered or popover open.
 * - `remove`: collected (or collecting), resting.
 * - `remove-active`: collected, hovered; clicking removes directly.
 * - `collected-active`: collected, hovered or popover open, when the toggle
 *   opens the popover rather than removing directly.
 *
 * @param {boolean} collected
 * @param {boolean} active
 * @param {boolean} isCollecting
 * @param {boolean} hasReadingGroups
 * @returns {string}
 */
function determineView(collected, active, isCollecting, hasReadingGroups) {
  if (collected) {
    if (active) return hasReadingGroups ? "collected-active" : "remove-active";
    return "remove";
  } else if (isCollecting) {
    return "remove";
  } else {
    if (active) return "add-active";
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  // Defaulting to `true` keeps the server and first client render identical.
  const [popoverSupported, setPopoverSupported] = useState(true);

  const popoverId = useId();
  const [wrapperEl, setWrapperEl] = useState(null);
  const [popoverEl, setPopoverEl] = useState(null);

  const myCollectableReadingGroups = !Array.isArray(myReadingGroups)
    ? []
    : myReadingGroups.filter(rg => rg?.attributes?.abilities?.update);

  useEffect(() => {
    setPopoverSupported("popover" in HTMLElement.prototype);
  }, []);

  useEffect(() => {
    if (!popoverOpen || !onDialogOpen) return;
    onDialogOpen();
  }, [popoverOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentUser = useCurrentUser();

  const dispatch = useDispatch();

  const collected = inCollections(collectable, currentUser, ...myReadingGroups);

  useEffect(() => {
    setIsCollecting(false);
  }, [collected]);

  // Without native popover support the toggle degrades to the
  // no-reading-groups behavior (star/unstar "My Starred" directly), so core
  // functionality survives and the popover markup is never rendered there.
  const hasReadingGroups =
    myCollectableReadingGroups?.length > 0 && popoverSupported;
  // While the popover is open the toggle keeps its active presentation, and
  // a collected toggle with reading groups uses `collected-active` so it
  // reads as a picker rather than a remove action.
  const view = determineView(
    collected,
    hovered || popoverOpen,
    isCollecting,
    hasReadingGroups
  );
  const collectableTitle = normalizeTitle(collectable);
  const useOutlinedStarIcon = outlined && view === "add";

  function doCollect(collection = currentUser) {
    const call = collectingAPI.collect([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    const dispatched = dispatch(collectRequest);
    setHovered(false);
    setIsCollecting(true);
    return dispatched.promise.catch(error => {
      setIsCollecting(false);
      throw error;
    });
  }

  function doRemove(collection = currentUser) {
    const call = collectingAPI.remove([collectable], collection);
    const collectRequest = request(call, requests.feCollectCollectable);
    setHovered(false);
    return dispatch(collectRequest).promise.then(() => {
      if (onUncollect) onUncollect(collection);
    });
  }

  /**
   * Hides the popover. Native hide restores focus to the invoker whenever
   * focus was inside the popover. `onDialogClose` fires from the `toggle`
   * event, so every dismissal path (light dismiss, Escape, submit,
   * focus-out) reports consistently.
   */
  function closePopover() {
    if (popoverEl?.matches(":popover-open")) popoverEl.hidePopover();
  }

  function handlePopoverChange(collection, shouldCollect) {
    return shouldCollect ? doCollect(collection) : doRemove(collection);
  }

  function onClick() {
    // if user belongs to any RGs, the browser toggles the popover via the
    // button's `popovertarget`; nothing else to do here
    if (hasReadingGroups) return;

    // user belongs to no RGs;
    // if collected previously, remove;
    // otherwise collect
    collected ? doRemove() : doCollect();
  }

  function onEnter() {
    setHovered(true);
  }

  function onLeave() {
    setHovered(false);
  }

  // Holds the latest `onDialogClose` so the toggle listener below doesn't
  // need to be re-attached when the prop changes identity.
  const onDialogCloseRef = useRef(onDialogClose);
  onDialogCloseRef.current = onDialogClose;

  // Keeps React state in sync with the native popover state. The listener is
  // attached in an effect keyed on the element (from a callback ref)
  // because the popover can mount after the toggle. The native `toggle`
  // event does not bubble, so it must be bound to the popover element
  // itself.
  useEffect(() => {
    if (!popoverEl) return;
    const handleToggle = event => {
      const isOpen = event.newState === "open";
      setPopoverOpen(isOpen);
      if (!isOpen && onDialogCloseRef.current) onDialogCloseRef.current();
    };
    popoverEl.addEventListener("toggle", handleToggle);
    return () => popoverEl.removeEventListener("toggle", handleToggle);
  }, [popoverEl]);

  useEffect(() => {
    if (!wrapperEl) return;
    const handleFocusOut = event => {
      if (!popoverOpen) return;
      // Safari doesn't focus buttons on click, so a mousedown on
      // a row in the popover blurs the active element with a null
      // relatedTarget. Mouse dismissal is handled by native light dismiss, so
      // it's safe to ignore a null relatedTarget here.
      if (!event.relatedTarget) return;
      // Do nothing if new focus is still inside the wrapper
      if (wrapperEl.contains(event.relatedTarget)) return;
      closePopover();
    };
    wrapperEl.addEventListener("focusout", handleFocusOut);
    return () => wrapperEl.removeEventListener("focusout", handleFocusOut);
  }, [wrapperEl, popoverOpen, popoverEl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (popoverOpen && popoverEl) popoverEl.focus();
  }, [popoverOpen, popoverEl]);

  if (
    !currentUser ||
    COLLECTABLE_TYPE_RESTRICTED_LIST.includes(collectable?.type)
  )
    return null;

  // Ancestors (e.g. the reader header) have click handlers; clicks in the
  // popover, a React descendant of this wrapper, must not trigger them.
  return (
    <Styled.Wrapper
      ref={setWrapperEl}
      onClick={event => event.stopPropagation()}
    >
      <Styled.Toggle
        onClick={onClick}
        popovertarget={hasReadingGroups ? popoverId : undefined}
        aria-haspopup={hasReadingGroups ? "dialog" : undefined}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        $variant={inline ? "inline" : "project-cover"}
        $hidden={hiddenIfUncollected && !collected}
      >
        <Styled.Inner $view={view} $outlined={outlined}>
          <Icons useOutline={useOutlinedStarIcon} />
          <Text view={view} disclosure={hasReadingGroups} />
        </Styled.Inner>
      </Styled.Toggle>
      {hasReadingGroups && (
        <Popover
          id={popoverId}
          collectable={collectable}
          title={collectableTitle}
          readingGroups={myCollectableReadingGroups}
          currentUser={currentUser}
          onChange={handlePopoverChange}
          popoverRef={setPopoverEl}
        />
      )}
    </Styled.Wrapper>
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
