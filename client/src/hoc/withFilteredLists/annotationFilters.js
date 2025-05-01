export default function annotationFilters({
  snapshotState = false,
  includePrivacy = true,
} = {}) {
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
      ...(includePrivacy
        ? [
            {
              label: "Privacy",
              name: "privacy",
              value: "",
              options: [
                { label: "All annotations", value: "" },
                { label: "Public annotations", value: "public" },
                { label: "Private annotations", value: "private" },
              ],
            },
          ]
        : []),
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
        ],
      },
    ],
  };
}
