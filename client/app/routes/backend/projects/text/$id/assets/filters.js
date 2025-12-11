export const INIT_SEARCH_PROPS = {
  params: [
    { label: "Search...", name: "keyword" },
    {
      label: "Type",
      name: "format",
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
      options: [
        { label: "By recently updated", value: "updated_at DESC" },
        { label: "Newest first", value: "created_at DESC" },
        { label: "Oldest first", value: "created_at ASC" },
        { label: "By name", value: "name" }
      ]
    }
  ],
  values: { keyword: "", format: "", order: "updated_at DESC" }
};
