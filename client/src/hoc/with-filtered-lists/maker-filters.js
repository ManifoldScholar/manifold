export default function makerFilters({ snapshotState = false } = {}) {
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
        value: "last_name",
        options: [
          { label: "Alphabetical by first name", value: "first_name" },
          { label: "Alphabetical by last name", value: "last_name" }
        ]
      }
    ]
  };
}
