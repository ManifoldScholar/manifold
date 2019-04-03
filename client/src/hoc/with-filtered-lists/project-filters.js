export default function projectFilters({ snapshotState = false } = {}) {
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
        label: "Draft",
        name: "draft",
        value: "",
        options: [
          { label: "All projects", value: "" },
          { label: "Only draft projects", value: "true" },
          { label: "Only published projects", value: "false" }
        ]
      },
      {
        label: "Order",
        name: "order",
        value: "updated_at DESC",
        options: [
          { label: "Most recently updated", value: "updated_at ASC" },
          { label: "Alphabetical by title", value: "sort_title ASC" },
          { label: "Newest projects first", value: "created_at DESC" },
          { label: "Oldest projects first", value: "created_at ASC" }
        ]
      }
    ]
  };
}
