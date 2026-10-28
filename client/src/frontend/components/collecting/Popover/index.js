import { useState, useEffect, useRef, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Item from "./Item";
import { inCollection } from "../helpers";
import * as Styled from "./styles";

/**
 * Popover used to add/remove a collectable from "My Starred" and the
 * reading groups the current user can update. Replaces the old
 * `Collecting.Dialog` modal. It is a native `popover="auto"` element
 * rendered in the top layer: visibility is owned by the browser.
 *
 * Each row applies immediately when toggled; there is no submit step.
 * A row's state comes from the redux store, with an optimistic override
 * layered on top while its request is in flight so the star responds
 * instantly. If the request fails, the override is discarded and the star
 * reverts. A status region announces each applied row and shows an error if
 * the request fails.
 */
function CollectingPopover({
  id,
  collectable,
  title,
  readingGroups,
  currentUser,
  onChange,
  popoverRef
}) {
  const { t } = useTranslation();

  // Guards against setting state after the popover (or its owner, the
  // toggle) has unmounted while an onChange promise is still in flight.
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  // Intended checked state, keyed by collection id ("me" or a group id),
  // for requests that are in flight.
  const [optimistic, setOptimistic] = useState({});
  const [pendingIds, setPendingIds] = useState([]);
  const [status, setStatus] = useState(null);

  function collectionName(collection) {
    if (collection.type === "users") return t("forms.my_starred_label");
    return collection.attributes.name;
  }

  /**
   * Status announced after a row is applied.
   */
  function successMessage(collection, shouldCollect) {
    if (shouldCollect) {
      return t("messages.collection_added", {
        title,
        added: collectionName(collection)
      });
    }
    return t("messages.collection_removed", {
      title,
      removed: collectionName(collection)
    });
  }

  function isChecked(collectionId, collection) {
    if (collectionId in optimistic) return optimistic[collectionId];
    return inCollection(collection, collectable);
  }

  function settle(collectionId) {
    setPendingIds(previous => previous.filter(value => value !== collectionId));
    setOptimistic(previous => {
      // eslint-disable-next-line camelcase
      const { [collectionId]: _settled, ...rest } = previous;
      return rest;
    });
  }

  function handleChange(collectionId, collection, checked) {
    if (pendingIds.includes(collectionId)) return;

    const shouldCollect = !checked;

    setOptimistic(previous => ({ ...previous, [collectionId]: shouldCollect }));
    setPendingIds(previous => [...previous, collectionId]);
    setStatus(null);

    onChange(collection, shouldCollect)
      .then(() => {
        if (!mounted.current) return;
        settle(collectionId);
        setStatus({
          type: "success",
          text: successMessage(collection, shouldCollect)
        });
      })
      .catch(err => {
        console.error(err);
        if (!mounted.current) return;
        settle(collectionId);
        setStatus({
          type: "error",
          text: t("messages.collection_update_error")
        });
      });
  }

  const legendId = useId();
  const meChecked = isChecked("me", currentUser);

  return (
    <Styled.Popover
      ref={popoverRef}
      id={id}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      popover="auto"
    >
      <Styled.Legend id={legendId}>{t("forms.add_to")}</Styled.Legend>
      <Styled.Group role="group" aria-labelledby={legendId}>
        <Item
          label={t("forms.my_starred_label")}
          checked={meChecked}
          pending={pendingIds.includes("me")}
          onToggle={() => handleChange("me", currentUser, meChecked)}
        />
        {readingGroups.map(group => {
          const {
            id: groupId,
            attributes: { name, privacy }
          } = group;
          const checked = isChecked(groupId, group);
          return (
            <Item
              key={groupId}
              label={name}
              checked={checked}
              pending={pendingIds.includes(groupId)}
              onToggle={() => handleChange(groupId, group, checked)}
              showLock={privacy === "private"}
            />
          );
        })}
      </Styled.Group>
      {/*
        Always rendered (rather than only when `status` is set) so the
        live region already exists in the DOM before the text is
        added to it -- assistive tech only announces changes to a
        region that was present when it started watching.
      */}
      <Styled.Status
        role="status"
        aria-live="polite"
        $error={status?.type === "error"}
      >
        {status?.text ?? null}
      </Styled.Status>
    </Styled.Popover>
  );
}

CollectingPopover.displayName = "Collecting.Popover";

CollectingPopover.propTypes = {
  id: PropTypes.string,
  collectable: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  readingGroups: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  popoverRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

export default CollectingPopover;
