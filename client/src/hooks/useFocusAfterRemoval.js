import { useCallback, useEffect, useRef } from "react";

/* Rows of an EntitiesList. Scoping to the inner `ul` keeps pagination's own
   `li` elements out of the row query. */
export const ENTITY_LIST_ITEM_SELECTOR = ".entity-list__list > li";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(", ");

/**
 * Keeps keyboard focus in place when a list item is deleted.
 *
 * Deleting a row unmounts the control that held focus, dropping focus to
 * `<body>`. Call `rememberRemoval(id)` just before the destroy request; once the
 * refreshed list commits without that id, focus moves to the equivalent control
 * on the next row (or the previous one, if the last row was removed).
 *
 * Neighbors are resolved positionally rather than by id: after the removal
 * commits, whatever now sits at the removed index *is* the next item. That way
 * rows need no per-row identifier, only the `focusSelector` marker on the
 * control worth landing on.
 *
 * @param {Array}    items           the list as currently rendered
 * @param {function} [getId]         id accessor, defaults to `item => item.id`
 * @param {string}   [itemSelector]  finds row elements within `listRef`
 * @param {string}   [focusSelector] the control to focus within the neighbor row
 * @returns {{ listRef: object, rememberRemoval: function }} attach `listRef` to
 *   an element that stays mounted when the list empties, and give it
 *   `tabIndex={-1}` so it can take focus when no rows remain.
 */
export default function useFocusAfterRemoval(
  items,
  {
    getId = item => item.id,
    itemSelector = ENTITY_LIST_ITEM_SELECTOR,
    focusSelector = '[data-id="destroy"]'
  } = {}
) {
  const listRef = useRef(null);
  const pendingRef = useRef(null);

  // Read through refs so `rememberRemoval` stays stable and the effect below
  // depends only on `items`.
  const stateRef = useRef();
  stateRef.current = { items, getId, itemSelector, focusSelector };

  const rememberRemoval = useCallback(id => {
    const { items: list, getId: idOf } = stateRef.current;
    const index = (list ?? []).findIndex(item => idOf(item) === id);
    if (index === -1) return;
    pendingRef.current = { id, index };
  }, []);

  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return undefined;

    // Wait for the render that actually drops the row. A failed request leaves
    // the item in place, so focus is never stolen.
    const stillPresent = (items ?? []).some(item => getId(item) === pending.id);
    if (stillPresent) return undefined;

    pendingRef.current = null;

    // Deletes are usually confirmed in a dialog, whose focus trap restores
    // focus to the now-removed trigger as it unmounts. Waiting a frame lets us
    // land after that.
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;

      const rows = list.querySelectorAll(itemSelector);
      const neighbor = rows[pending.index] ?? rows[pending.index - 1];
      const target =
        neighbor?.querySelector(focusSelector) ??
        neighbor?.querySelector(FOCUSABLE_SELECTOR) ??
        list;

      target.focus();
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(
    () => () => {
      pendingRef.current = null;
    },
    []
  );

  return { listRef, rememberRemoval };
}
