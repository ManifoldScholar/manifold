export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  {
    label: "Privacy",
    name: "privacy",
    value: "",
    options: [
      { label: "All annotations", value: "" },
      { label: "Public annotations", value: "public" },
      { label: "Private annotations", value: "private" }
    ]
  },
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

export const INIT_FILTERS = {
  formats: ["annotation"],
  order: "created_at DESC"
};

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", privacy: "", flags: "", order: "created_at DESC" }
};
