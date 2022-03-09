const getTextOptions = texts =>
  texts.map(text => {
    return {
      label: text.attributes.title,
      value: text.id
    };
  });

export const textFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.by_text"),
  value: filters?.text || "",
  onChange: e => updateFilters(e, "text"),
  options: [
    { label: t("filters.default_options.text"), value: "" },
    ...getTextOptions(params.texts)
  ]
});
