export const sortFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.sort_results"),
  value: filters.order || "",
  onChange: e => updateFilters(e, "order"),
  options: [
    {
      label: t("filters.sort_options.none_selected"),
      value: ""
    },
    {
      label: t("filters.sort_options.alphabetical"),
      value: "sort_title ASC"
    },
    {
      label: t("filters.sort_options.reverse_alpha"),
      value: "sort_title DESC"
    }
  ]
});
