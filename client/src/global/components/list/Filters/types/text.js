const getTextOptions = texts =>
  texts.map(text => {
    return {
      label: text.attributes.title,
      value: text.id
    };
  });

export const textFilter = (filters, updateFilters, params) => ({
  label: "Filter by text",
  value: filters?.text || "",
  onChange: e => updateFilters(e, "text"),
  options: [{ label: "All texts", value: "" }, ...getTextOptions(params.texts)]
});
