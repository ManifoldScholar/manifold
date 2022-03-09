const getMembershipOptions = rgms =>
  rgms.map(rgm => {
    return {
      label: rgm.attributes.name,
      value: rgm.id
    };
  });

export const membershipFilter = (filters, updateFilters, params, t) => ({
  label: t("filters.labels.by_member"),
  value: filters?.readingGroupMembership || "",
  onChange: e => updateFilters(e, "readingGroupMembership"),
  options: [
    { label: t("filters.default_options.members"), value: "" },
    ...getMembershipOptions(params.memberships)
  ]
});
