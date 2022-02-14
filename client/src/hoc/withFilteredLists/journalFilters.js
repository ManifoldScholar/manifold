export default function journalFilters({ snapshotState = false } = {}) {
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
          { label: "All journals", value: "" },
          { label: "Only draft journals", value: "true" },
          { label: "Only published journals", value: "false" }
        ]
      },
      {
        label: "Order",
        name: "order",
        value: "updated_at DESC",
        options: [
          { label: "Most recently updated", value: "updated_at ASC" },
          { label: "Alphabetical by title", value: "sort_title ASC" },
          { label: "Newest journals first", value: "created_at DESC" },
          { label: "Oldest journals first", value: "created_at ASC" }
        ]
      }
    ]
  };
}
