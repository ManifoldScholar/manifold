const getKindOptions = kinds =>
  kinds.map(kind => {
    return {
      label: kind,
      value: kind
    };
  });

export const kindFilter = (filters, updateFilters, params, t) => {
  return {
    label: t("filters.labels.by_kind"),
    value: filters?.kind || "",
    onChange: e => updateFilters(e, "kind"),
    options: [
      { label: t("filters.default_options.type"), value: "" },
      ...getKindOptions(params.kinds)
    ]
  };
};
