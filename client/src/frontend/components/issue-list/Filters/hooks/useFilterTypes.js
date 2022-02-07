export default function useFilterTypes(
  filters,
  setFilters,
  updateFilters,
  subjects = [],
  hideFeatured = false,
  active = { featuredAndSubject: true, sort: true }
) {
  if (!(active.featuredAndSubject || active.sort)) return [];

  const sortFilter = {
    label: "Sort results",
    value: filters.order || "",
    onChange: e => updateFilters(e, "order"),
    options: [
      {
        label: "Sort",
        value: ""
      },
      {
        label: "A–Z",
        value: "sort_title ASC"
      },
      {
        label: "Z–A",
        value: "sort_title DESC"
      }
    ]
  };

  const subjectOptions = subjects.map(subject => {
    return {
      label: subject.attributes.name,
      value: subject.id
    };
  });

  const featuredAndSubjectFilter = () => {
    const options = hideFeatured
      ? [subjectOptions]
      : [{ label: "Featured Issues", value: "featured" }, ...subjectOptions];

    if (!options.length) return null;

    return {
      label: "Filter results",
      value: !!filters.featured ?? filters.subject ?? "",
      onChange: e => updateFilters(e),
      options: [{ label: "Show all", value: "" }, ...options]
    };
  };

  if (active.featuredAndSubject && active.sort)
    return [sortFilter, featuredAndSubjectFilter];
  if (active.featuredAndSubject) return [featuredAndSubjectFilter];
  if (active.sort) return [sortFilter];
}
