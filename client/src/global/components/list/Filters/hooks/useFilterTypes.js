import filterTypes from "../types";

export default function getFilterTypes(selection) {
  const { filters, updateFilters, active = [], params = {} } = selection;
  if (!active.length) return [];

  const activeFilters = active.map(type =>
    filterTypes[type](filters, updateFilters, params)
  );

  return activeFilters;
}
