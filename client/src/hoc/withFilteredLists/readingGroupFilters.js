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
        name: "sort_order",
        value: "default",
        options: [
          {
            label: "Sort",
            value: "default"
          },
          {
            label: "A-Z",
            value: "name_asc"
          },
          {
            label: "Z-A",
            value: "name_desc"
          },
          { label: "Newest first", value: "created_at_desc" },
          { label: "Oldest first", value: "created_at_asc" }
        ]
      }
    ]
  };
}
