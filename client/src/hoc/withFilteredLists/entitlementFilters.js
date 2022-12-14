export default function entitlementFilters({ snapshotState = false } = {}) {
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
        value: "email",
        options: [
          { label: "Alphabetical by email", value: "email" },
          { label: "By soonest expiration", value: "expiration" }
        ]
      }
    ]
  };
}
