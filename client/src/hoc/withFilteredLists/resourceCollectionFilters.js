export default function resourceCollectionFilters({
  snapshotState = false
} = {}) {
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
        value: "title",
        options: [{ label: "Alphabetical by title", value: "title" }]
      }
    ]
  };
}
