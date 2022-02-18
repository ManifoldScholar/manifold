import capitalize from "lodash/capitalize";

const getTagOptions = tags =>
  tags.map(tag => {
    return {
      label: capitalize(tag),
      value: tag
    };
  });

export const tagFilter = (filters, updateFilters, params) => {
  return {
    label: "Tag",
    value: filters?.tag || "",
    onChange: e => updateFilters(e, "tag"),
    options: [{ label: "Tag:", value: "" }, ...getTagOptions(params.tags)]
  };
};
