const getMembershipOptions = rgs =>
  rgs?.map(rg => {
    return {
      label: rg.attributes.name,
      value: rg.id
    };
  }) ?? [];

export const readingGroupFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.by_group"),
  value: filters?.readingGroup || "",
  onChange: e => updateFilters(e, "readingGroup"),
  options: [
    { label: t("filters.default_options.generic"), value: "" },
    ...getMembershipOptions(params.readingGroup)
  ]
});
