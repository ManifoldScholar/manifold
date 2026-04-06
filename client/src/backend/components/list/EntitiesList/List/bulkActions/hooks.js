import React, {
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useRef
} from "react";
import { bulkActionsReducer } from "./reducer";
import isEqual from "lodash/isEqual";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

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

  const resetBulkSelection = useCallback(
    () =>
      dispatchSelection({
        type: "reset",
        payload: initSelectionState
      }),
    [initSelectionState]
  );

  const addItem = id => dispatchSelection({ type: "add", payload: id });
  const removeItem = id =>
    bulkSelection?.filters
      ? handleSelectAllUncheck(id)
      : dispatchSelection({ type: "remove", payload: id });
  const addPage = ids => dispatchSelection({ type: "addPage", payload: ids });

  const { search } = useLocation();
  const { page } = queryString.parse(search);
  const pageRef = useRef(page ?? "1");

  useEffect(() => {
    if (page && page !== pageRef.current) {
      resetBulkSelection();
    }
  }, [page, resetBulkSelection]);

  return {
    bulkActionsActive,
    toggleBulkActions,
    resetBulkSelection,
    handleSelectAll,
    handleSelectAllUncheck,
    bulkSelection,
    bulkSelectionEmpty,
    addItem,
    removeItem,
    addPage
  };
}

export const useClearBulkSelectionWithFilters = (
  baseOnReset,
  baseSetFilter,
  resetBulkSelection,
  bulkSelectionEmpty
) => {
  const setParam = useCallback(
    (param, value) => {
      baseSetFilter(param, value);

      if (!bulkSelectionEmpty) resetBulkSelection();
    },
    [bulkSelectionEmpty, resetBulkSelection, baseSetFilter]
  );

  const onReset = useCallback(() => {
    baseOnReset();

    if (!bulkSelectionEmpty) resetBulkSelection();
  }, [bulkSelectionEmpty, resetBulkSelection, baseOnReset]);

  return { setParam, onReset };
};
