const getSectionOptions = sections =>
  sections.map(({ name, id }) => {
    return {
      label: name,
      value: id
    };
  });

export const sectionFilter = (filters, updateFilters, params) => ({
  label: "Filter by text section",
  value: filters?.textSection || "",
  onChange: e => updateFilters(e, "textSection"),
  options: [
    { label: "All sections", value: "" },
    ...getSectionOptions(params.sections)
  ]
});
