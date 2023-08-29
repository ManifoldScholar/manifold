export const sortChronFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.sort_results"),
  value: filters.order || "",
  onChange: e => updateFilters(e, "order"),
  options: [
    {
      label: t("filters.sort_options.none_selected"),
      value: ""
    },
    {
      label: t("filters.collection_sort_options.created_at_asc"),
      value: "created_at ASC"
    },
    {
      label: t("filters.collection_sort_options.created_at_desc"),
      value: "created_at DESC"
    }
  ]
});
