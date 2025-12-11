export function bulkActionsReducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, ids: [...state.ids, action.payload] };
    case "remove":
      return { ...state, ids: state.ids.filter(id => id !== action.payload) };
    case "addPage":
      return { filters: null, ids: action.payload };
    case "removeAndClear":
      return { filters: null, ids: action.payload };
    case "setFilters":
      return { ids: [], filters: action.payload };
    case "reset":
      return action.payload;
    default:
  }
}
