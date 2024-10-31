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
        label: "Privacy",
        name: "privacy",
        value: "",
        options: [
          { label: "All reading groups", value: "" },
          { label: "Public groups", value: "public" },
          { label: "Private groups", value: "private" },
          { label: "Anonymous groups", value: "anonymous" }
        ]
      },
      {
        label: "Flags",
        name: "flags",
        value: "",
        options: [
          { label: "With and without flags", value: "" },
          { label: "With flagged annotations", value: "true" }
        ]
      },
      {
        label: "Order",
        name: "sort_order",
        value: "created_at_desc",
        options: [
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
