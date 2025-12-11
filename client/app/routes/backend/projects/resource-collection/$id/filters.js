import { capitalize } from "lodash-es";

export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  { label: "Tag", name: "tag", options: [] },
  { label: "Kind", name: "kind", options: [] },
  {
    hidden: true,
    label: "Resource Collection",
    name: "resourceCollection",
    value: ""
  },
  {
    label: "Order",
    name: "order",
    value: "",
    options: [
      { label: "In default order", value: "" },
      { label: "Alphabetical by title", value: "sort_title ASC" },
      { label: "Newest resources first", value: "created_at DESC" }
    ]
  }
];

export const INIT_FILTERS = {};

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options,
    hidden: p.hidden
  })),
  values: FILTER_PARAMS.reduce((acc, p) => {
    acc[p.name] = p.value ?? "";
    return acc;
  }, {})
};

export function dynamicSearchProps(project) {
  if (!project) return INIT_SEARCH_PROPS;

  const tags = project.attributes.resourceTags || [];
  const tagOptions = [
    { label: "All", value: "" },
    ...tags.map(t => ({ label: t, value: t }))
  ];

  const kinds = project.attributes.resourceKinds || [];
  const kindOptions = [
    { label: "All", value: "" },
    ...kinds.map(k => ({ label: capitalize(k), value: k }))
  ];

  const params = INIT_SEARCH_PROPS.params.map(p => {
    if (p.name === "tag") return { ...p, options: tagOptions };
    if (p.name === "kind") return { ...p, options: kindOptions };
    return p;
  });

  return { ...INIT_SEARCH_PROPS, params };
}
