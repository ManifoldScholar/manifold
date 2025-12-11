export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  {
    label: "Order",
    name: "order",
    value: "title",
    options: [{ label: "Alphabetical by title", value: "title" }]
  }
];

export const INIT_FILTERS = { order: "title" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(({ label, name, options }) => ({
    label,
    name,
    ...(options && { options })
  })),
  values: { keyword: "", order: "title" }
};
