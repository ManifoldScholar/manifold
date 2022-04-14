const getTagOptions = tags =>
  tags.map(tag => {
    return {
      label: tag,
      value: tag
    };
  });

export const tagFilter = (filters, updateFilters, params, t) => {
  return {
    label: t("filters.labels.tag"),
    value: filters?.tag || "",
    onChange: e => updateFilters(e, "tag"),
    options: [
      { label: t("filters.default_options.tag"), value: "" },
      ...getTagOptions(params.tags)
    ]
  };
};
