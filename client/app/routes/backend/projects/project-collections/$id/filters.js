import { FILTER_PARAMS } from "app/routes/backend/projects/filters";

export { FILTER_PARAMS };

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
