export const orderCollectionFilter = (filters, updateFilters) => ({
  label: "Order Collection By:",
  value: filters?.sortBy || "",
  onChange: e => updateFilters(e, "sortBy"),
  options: [
    { label: "Date Created (Newest First)", value: "created_at_desc" },
    { label: "Date Created (Oldest First)", value: "created_at_asc" },
    { label: "Last Updated (Newest First)", value: "updated_at_desc" },
    { label: "Last Updated (Oldest First)", value: "updated_at_asc" },
    { label: "Title A to Z", value: "title_asc" },
    { label: "Title Z to A", value: "title_desc" },
    {
      label: "Publication Date (Newest First)",
      value: "publication_date_desc"
    },
    {
      label: "Publication Date (Oldest First)",
      value: "publication_date_asc"
    }
  ]
});
