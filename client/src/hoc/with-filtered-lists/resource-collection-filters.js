export default function resourceCollectionFilters({ sticky = false } = {}) {
  return {
    sticky,
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
