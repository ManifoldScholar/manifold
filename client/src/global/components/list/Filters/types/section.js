const getSectionOptions = sections =>
  sections.map(({ name, id }) => {
    return {
      label: name,
      value: id
    };
  });

export const sectionFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.by_section"),
  value: filters?.textSection || "",
  onChange: e => updateFilters(e, "textSection"),
  options: [
    { label: t("filters.default_options.sections"), value: "" },
    ...getSectionOptions(params.sections)
  ]
});
