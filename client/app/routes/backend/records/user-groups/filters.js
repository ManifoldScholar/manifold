export const FILTER_PARAMS = [
  {
    label: "Search...",
    name: "keyword",
    value: ""
  },
  {
    label: "Order",
    name: "order",
    value: "name",
    options: [
      { label: "Alphabetical by name", value: "name" },
      { label: "Newest first", value: "created_at DESC" },
      { label: "Oldest first", value: "created_at ASC" }
    ]
  }
];

export const INIT_FILTERS = { order: "name" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", order: "name" }
};
