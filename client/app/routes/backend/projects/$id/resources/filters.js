export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  { label: "Tag", name: "tag", value: "", options: [] },
  { label: "Kind", name: "kind", value: "", options: [] },
  {
    label: "Order",
    name: "order",
    value: "",
    options: [
      { label: "In default order", value: "" },
      { label: "Alphabetical by title", value: "sort_title ASC" },
      { label: "Newest resources first", value: "created_at DESC" }
    ]
  }
];

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(({ label, name, options }) => ({
    label,
    name,
    ...(options && { options })
  })),
  values: { keyword: "", tag: "", kind: "", order: "" }
};
