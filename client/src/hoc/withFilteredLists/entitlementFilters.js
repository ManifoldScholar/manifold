export default function entitlementFilters({ snapshotState = false } = {}) {
  return {
    config: {
      snapshotState
    },
    params: [
      {
        label: "Search by email...",
        name: "keyword",
        as: "email",
        value: ""
      },
      {
        label: "Order",
        name: "order",
        value: "default",
        options: [
          { label: "By creation date", value: "default" },
          { label: "By latest expiration", value: "expires_on_desc" },
          { label: "By soonest expiration", value: "expires_on_asc" }
        ]
      }
    ]
  };
}
