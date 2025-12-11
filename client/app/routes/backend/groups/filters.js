export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  {
    label: "Privacy",
    name: "privacy",
    value: "",
    options: [
      { label: "All reading groups", value: "" },
      { label: "Public groups", value: "public" },
      { label: "Private groups", value: "private" },
      { label: "Anonymous groups", value: "anonymous" }
    ]
  },
  {
    label: "Flags",
    name: "flags",
    value: "",
    options: [
      { label: "With and without flags", value: "" },
      { label: "With flagged annotations", value: "true" }
    ]
  },
  {
    label: "Order",
    name: "sort_order",
    value: "created_at_desc",
    options: [
      { label: "A-Z", value: "name_asc" },
      { label: "Z-A", value: "name_desc" },
      { label: "Newest first", value: "created_at_desc" },
      { label: "Oldest first", value: "created_at_asc" }
    ]
  }
];

export const INIT_FILTERS = { sort_order: "created_at_desc" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", privacy: "", flags: "", sort_order: "created_at_desc" }
};
