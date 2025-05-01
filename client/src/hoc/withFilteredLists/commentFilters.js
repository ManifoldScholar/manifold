export default function commentFilters({ snapshotState = false } = {}) {
  return {
    config: {
      snapshotState,
    },
    params: [
      {
        label: "Search...",
        name: "keyword",
        value: "",
      },
      {
        label: "Flags",
        name: "flags",
        value: "",
        options: [
          { label: "With and without flags", value: "" },
          { label: "With flags", value: "true" },
        ],
      },
      {
        label: "Order",
        name: "order",
        value: "created_at DESC",
        options: [
          { label: "Newest first", value: "created_at DESC" },
          { label: "Oldest first", value: "created_at ASC" },
          { label: "By creator", value: "created_by" },
          { label: "By subject", value: "subject" },
        ],
      },
    ],
  };
}
