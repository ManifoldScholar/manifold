export const FILTER_PARAMS = [
  { label: "Search by email...", name: "keyword", as: "email", value: "" },
  {
    label: "Order",
    name: "order",
    value: "default",
    options: [
      { label: "By creation date", value: "default" },
      { label: "By latest expiration", value: "expires_on_desc" },
      { label: "By soonest expiration", value: "expires_on_asc" }
    ]
  }
];

export const INIT_FILTERS = { order: "default" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    as: p.as,
    options: p.options
  })),
  values: { keyword: "", order: "default" }
};
