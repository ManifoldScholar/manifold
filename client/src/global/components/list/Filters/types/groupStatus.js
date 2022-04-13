export const groupStatusFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.by_status"),
  value: filters.archived || "false",
  onChange: e => updateFilters(e, "archived"),
  options: [
    {
      label: t("filters.group_status_options.active"),
      value: "false"
    },
    {
      label: t("filters.group_status_options.archived"),
      value: "true"
    }
  ]
});
