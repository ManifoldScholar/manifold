export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  {
    label: "Flags",
    name: "flags",
    value: "",
    options: [
      { label: "With and without flags", value: "" },
      { label: "With flags", value: "true" }
    ]
  },
  {
    label: "Order",
    name: "order",
    value: "created_at DESC",
    options: [
      { label: "Newest first", value: "created_at DESC" },
      { label: "Oldest first", value: "created_at ASC" },
      { label: "By creator", value: "created_by" }
    ]
  }
];

export const INIT_FILTERS = { order: "created_at DESC" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", flags: "", order: "created_at DESC" }
};
