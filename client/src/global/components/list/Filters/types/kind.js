import capitalize from "lodash/capitalize";

const getKindOptions = kinds =>
  kinds.map(kind => {
    return {
      label: capitalize(kind),
      value: kind
    };
  });

export const kindFilter = (filters, updateFilters, params) => {
  return {
    label: "Kind",
    value: filters?.kind || "",
    onChange: e => updateFilters(e, "kind"),
    options: [{ label: "Type:", value: "" }, ...getKindOptions(params.kinds)]
  };
};
