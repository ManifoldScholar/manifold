const getMembershipOptions = rgms =>
  rgms.map(rgm => {
    return {
      label: rgm.attributes.name,
      value: rgm.id
    };
  });

export const membershipFilter = (filters, updateFilters, params) => ({
  label: "Filter by member",
  value: filters?.readingGroupMembership || "",
  onChange: e => updateFilters(e, "readingGroupMembership"),
  options: [
    { label: "All members", value: "" },
    ...getMembershipOptions(params.memberships)
  ]
});
