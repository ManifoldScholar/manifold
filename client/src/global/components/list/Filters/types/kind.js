import humps from "humps";

const getKindOptions = (kinds, t) =>
  kinds.map(kind => {
    const i18nKey = humps.decamelize(kind, { separator: "_" }).toLowerCase();
    return {
      label: t(`resources.kinds.${i18nKey}`),
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
      ...getKindOptions(params.kinds, t)
    ]
  };
};
