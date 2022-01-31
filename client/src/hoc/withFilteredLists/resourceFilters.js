function defaultParams({ snapshotState = false } = {}) {
  return {
    config: {
      snapshotState
    },
    params: [
      {
        label: "Search...",
        name: "keyword",
        value: ""
      },
      {
        label: "Tag",
        name: "tag",
        options: []
      },
      {
        label: "Kind",
        name: "kind",
        options: []
      },
      {
        hidden: true,
        label: "Resource Collection",
        name: "resourceCollection",
        value: ""
      },
      {
        label: "Order",
        name: "order",
        value: "title",
        options: [
          { label: "Alphabetical by title", value: "title" },
          { label: "Newest resources first", value: "created_at" }
        ]
      }
    ]
  };
}

function dynamicParams(searchProps, project) {
  if (!project) return searchProps;

  const tagFilterOptions = () => {
    const tags = project.attributes.resourceTags || [];
    const options = tags.map(t => ({ label: `Tag: ${t}`, value: t }));
    options.unshift({ label: "Select a tag", value: "" });
    return options;
  };

  const kindFilterOptions = () => {
    const tags = project.attributes.resourceKinds || [];
    const options = tags.map(k => ({ label: `Type: ${k}`, value: k }));
    options.unshift({ label: "Select a type", value: "" });
    return options;
  };

  const searchParams = () => {
    const { params } = searchProps;
    const tag = params.find(p => p.name === "tag");
    tag.options = tagFilterOptions();
    const kind = params.find(p => p.name === "kind");
    kind.options = kindFilterOptions();
    return params;
  };

  return { ...searchProps, params: searchParams() };
}

export default {
  defaultParams,
  dynamicParams
};
