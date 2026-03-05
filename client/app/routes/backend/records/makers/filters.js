export const FILTER_PARAMS = [
  {
    label: "Search...",
    name: "keyword",
    value: ""
  },
  {
    label: "Order",
    name: "order",
    value: "last_name",
    options: [
      { label: "Alphabetical by first name", value: "first_name" },
      { label: "Alphabetical by last name", value: "last_name" }
    ]
  }
];

export const INIT_FILTERS = { order: "last_name" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", order: "last_name" }
};
