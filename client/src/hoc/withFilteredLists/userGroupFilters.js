export default function userGroupFilters({ snapshotState = false } = {}) {
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
        label: "Order",
        name: "order",
        value: "name",
        options: [
          { label: "Alphabetical by name", value: "name" },
          { label: "Newest first", value: "created_at DESC" },
          { label: "Oldest first", value: "created_at ASC" }
        ]
      }
    ]
  };
}
