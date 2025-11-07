export const sortFilter = (filters, updateFilters, params, t) => {
  const includePublished = params?.entityType === "project";
  const { defaultOrder } = params ?? {};
  const includeModified =
    params?.entityType === "journal" ||
    params?.entityType === "projectCollection" ||
    params?.entityType === "journalIssue";
  const alphaSort =
    params?.entityType === "projectCollection" ? "title" : "sort_title";

  return {
    label: t("filters.labels.sort_results"),
    value: filters.order || defaultOrder || "",
    onChange: e => updateFilters(e, "order"),
    options: [
      ...(defaultOrder
        ? [
            {
              label: t("filters.sort_options.featured_then_newest"),
              value: defaultOrder
            }
          ]
        : []),
      {
        label: t("filters.sort_options.alphabetical"),
        value: `${alphaSort} ASC`
      },
      {
        label: t("filters.sort_options.reverse_alpha"),
        value: `${alphaSort} DESC`
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
