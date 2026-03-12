const EVENT_TYPES = {
  project_created: "Project Created",
  text_added: "Text Added",
  resource_added: "Resource Added"
};

export const INIT_SEARCH_PROPS = {
  params: [
    { label: "Search…", name: "keyword" },
    {
      label: "Type",
      name: "type",
      options: Object.entries(EVENT_TYPES).map(([value, label]) => ({
        label,
        value
      }))
    }
  ],
  values: { keyword: "", type: "" }
};
