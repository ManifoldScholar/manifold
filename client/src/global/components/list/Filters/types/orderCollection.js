export const orderCollectionFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.order_collection"),
  value: filters?.sortBy || "",
  onChange: e => updateFilters(e, "sortBy"),
  options: [
    {
      label: t("filters.collection_sort_options.created_at_desc"),
      value: "created_at_desc"
    },
    {
      label: t("filters.collection_sort_options.created_at_asc"),
      value: "created_at_asc"
    },
    {
      label: t("filters.collection_sort_options.updated_at_desc"),
      value: "updated_at_desc"
    },
    {
      label: t("filters.collection_sort_options.updated_at_asc"),
      value: "updated_at_asc"
    },
    {
      label: t("filters.collection_sort_options.title_asc"),
      value: "title_asc"
    },
    {
      label: t("filters.collection_sort_options.title_desc"),
      value: "title_desc"
    },
    {
      label: t("filters.collection_sort_options.publication_date_desc"),
      value: "publication_date_desc"
    },
    {
      label: t("filters.collection_sort_options.publication_date_asc"),
      value: "publication_date_asc"
    }
  ]
});
