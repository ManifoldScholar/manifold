export default function readingGroupFilters({ snapshotState = false } = {}) {
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
        value: "created_at DESC",
        options: [
          { label: "Newest first", value: "created_at DESC" },
          { label: "Oldest first", value: "created_at ASC" },
          { label: "By creator", value: "created_by" }
        ]
      }
    ]
  };
}
