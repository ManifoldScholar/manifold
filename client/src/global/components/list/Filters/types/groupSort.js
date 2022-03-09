export const groupSortFilter = (filters, updateFilters, params, t) => {
  return {
    label: t("filters.labels.sort_results"),
    value: filters.sort_order || "",
    onChange: e => updateFilters(e, "sort_order"),
    options: [
      {
        label: t("filters.sort_options.none_selected"),
        value: ""
      },
      {
        label: t("filters.sort_options.alphabetical"),
        value: "name_asc"
      },
      {
        label: t("filters.sort_options.reverse_alpha"),
        value: "name_desc"
      },
      {
        label: t("filters.group_sort_options.newest_first"),
        value: "created_at_desc"
      },
      {
        label: t("filters.group_sort_options.oldest_first"),
        value: "created_at_asc"
      },
      {
        label: t("filters.group_sort_options.earliest_start_date"),
        value: "course_starts_on_asc"
      },
      {
        label: t("filters.group_sort_options.latest_start_date"),
        value: "course_starts_on_desc"
      },
      {
        label: t("filters.group_sort_options.earliest_end_date"),
        value: "course_ends_on_asc"
      },
      {
        label: t("filters.group_sort_options.latest_end_date"),
        value: "course_ends_on_desc"
      }
    ]
  };
};
