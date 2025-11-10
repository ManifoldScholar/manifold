export const sortFilter = (filters, updateFilters, params, t) => {
  const includePublished = params?.entityType === "project";
  const includeModified = params?.entityType === "journal";

  return {
    label: t("filters.labels.sort_results"),
    value: filters.order || "",
    onChange: e => updateFilters(e, "order"),
    options: [
      {
        label: t("filters.sort_options.alphabetical"),
        value: "sort_title ASC"
      },
      {
        label: t("filters.sort_options.reverse_alpha"),
        value: "sort_title DESC"
      },
      {
        label: t("filters.collection_sort_options.created_at_asc"),
        value: "created_at ASC"
      },
      {
        label: t("filters.collection_sort_options.created_at_desc"),
        value: "created_at DESC"
      },
      ...(includePublished
        ? [
            {
              label: t("filters.sort_options.published_asc"),
              value: "publication_date ASC"
            },
            {
              label: t("filters.sort_options.published_desc"),
              value: "publication_date DESC"
            }
          ]
        : []),
      ...(includeModified
        ? [
            {
              label: t("filters.sort_options.modified_asc"),
              value: "updated_at ASC"
            },
            {
              label: t("filters.sort_options.modified_desc"),
              value: "updated_at DESC"
            }
          ]
        : [])
    ]
  };
};
