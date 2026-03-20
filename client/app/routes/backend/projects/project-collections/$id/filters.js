import { projectFilters } from "hoc/withFilteredLists";

const defaultProjectFilters = projectFilters();

export const FILTER_PARAMS = defaultProjectFilters.params;

export const INIT_FILTERS = FILTER_PARAMS.reduce((acc, p) => {
  if (p.value) acc[p.name] = p.value;
  return acc;
}, {});

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: FILTER_PARAMS.reduce((acc, p) => {
    acc[p.name] = p.value;
    return acc;
  }, {})
};
