export const sortFilter = (filters, updateFilters) => ({
  label: "Sort results",
  value: filters.order || "",
  onChange: e => updateFilters(e, "order"),
  options: [
    {
      label: "Sort",
      value: ""
    },
    {
      label: "A–Z",
      value: "sort_title ASC"
    },
    {
      label: "Z–A",
      value: "sort_title DESC"
    }
  ]
});
