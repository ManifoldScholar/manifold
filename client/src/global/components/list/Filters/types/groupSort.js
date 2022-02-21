export const groupSortFilter = (filters, updateFilters) => {
  return {
    label: "Sort results",
    value: filters.sort_order || "",
    onChange: e => updateFilters(event, "sort_order"),
    options: [
      {
        label: "Sort by:",
        value: ""
      },
      {
        label: "A–Z",
        value: "name_asc"
      },
      {
        label: "Z–A",
        value: "name_desc"
      },
      {
        label: "Newest groups first",
        value: "created_at_asc"
      },
      {
        label: "Oldest groups first",
        value: "created_at_desc"
      },
      {
        label: "Earliest course start date",
        value: "course_starts_on_asc"
      },
      {
        label: "Latest course start date",
        value: "course_starts_on_desc"
      },
      {
        label: "Earliest course end date",
        value: "course_ends_on_asc"
      },
      {
        label: "Latest course end date",
        value: "course_ends_on_desc"
      }
    ]
  };
};
