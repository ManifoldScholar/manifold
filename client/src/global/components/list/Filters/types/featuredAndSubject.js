const getSubjectOptions = subjects =>
  subjects.map(subject => {
    return {
      label: subject.attributes.name,
      value: subject.id
    };
  });

export const featuredAndSubjectFilter = (filters, updateFilters, params) => {
  const subjectOptions = params.subjects
    ? getSubjectOptions(params.subjects)
    : [];
  const options = params.hideFeatured
    ? [subjectOptions]
    : [{ label: params.featuredLabel, value: "featured" }, ...subjectOptions];

  if (!options.length) return null;

  return {
    label: "Filter results",
    value: filters.featured ? "featured" : filters.subject || "",
    onChange: e => updateFilters(e, "subject"),
    options: [{ label: "Show all", value: "" }, ...options]
  };
};
