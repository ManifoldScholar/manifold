import React, { useState, useReducer, useMemo, useCallback } from "react";
import { bulkActionsReducer } from "./reducer";
import isEqual from "lodash/isEqual";

export default function useBulkActions(records, filters) {
  const [bulkActionsActive, setBulkActionsActive] = useState(false);

  const toggleBulkActions = useCallback(
    () => setBulkActionsActive(!bulkActionsActive),
    [bulkActionsActive, setBulkActionsActive]
  );

  const initSelectionState = useMemo(
    () => ({
      ids: [],
      filters: null
    }),
    []
  );

  const [bulkSelection, dispatchSelection] = useReducer(
    bulkActionsReducer,
    initSelectionState
  );

  const bulkSelectionEmpty = isEqual(initSelectionState, bulkSelection);

  const visibleIds = useMemo(() => records?.map(a => a.id), [records]);

  const handleSelectAll = useCallback(() => {
    const { order, ...selectionFilters } = filters;
    return dispatchSelection({
      type: "setFilters",
      payload: selectionFilters
    });
  }, [filters]);

  const handleSelectAllUncheck = removeId => {
    dispatchSelection({
      type: "removeAndClear",
      payload: visibleIds.filter(id => id !== removeId)
    });
  };

  const resetBulkSelection = () =>
    dispatchSelection({
      type: "reset",
      payload: initSelectionState
    });

  const addItem = id => dispatchSelection({ type: "add", payload: id });
  const removeItem = id =>
    bulkSelection?.filters
      ? handleSelectAllUncheck(id)
      : dispatchSelection({ type: "remove", payload: id });

  return {
    bulkActionsActive,
    toggleBulkActions,
    resetBulkSelection,
    handleSelectAll,
    handleSelectAllUncheck,
    bulkSelection,
    bulkSelectionEmpty,
    addItem,
    removeItem
  };
}
