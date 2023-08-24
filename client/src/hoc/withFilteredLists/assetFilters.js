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
      // {
      //   label: "Kind",
      //   name: "kind",
      //   value: "",
      //   options: [
      //     { label: "All assets", value: "" },
      //     { label: "Cover images", value: "cover_image" },
      //     { label: "Table of contents", value: "navigation" },
      //     { label: "Text sections", value: "section" },
      //     { label: "Other", value: "publication_resource" }
      //   ]
      // },
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
