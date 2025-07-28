export default function assetFilters({ snapshotState = false } = {}) {
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
        label: "Format",
        name: "format",
        value: "",
        options: [
          { label: "All assets", value: "" },
          { label: "Images", value: "image" },
          { label: "Videos", value: "video" },
          { label: "PDFs", value: "pdf" }
        ]
      },
      {
        label: "Order",
        name: "order",
        value: "updated_at DESC",
        options: [
          { label: "By recently updated", value: "updated_at DESC" },
          { label: "By name", value: "name" },
          { label: "Newest first", value: "created_at DESC" },
          { label: "Oldest first", value: "created_at ASC" }
        ]
      }
    ]
  };
}
