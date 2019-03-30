import config from "config";

export default function userFilters({ sticky = false } = {}) {
  const roles = Object.keys(config.app.locale.roles);
  const labels = config.app.locale.roles;
  const roleOptions = roles.map(role => {
    return {
      label: `Role: ${labels[role]}`,
      value: role
    };
  });
  roleOptions.unshift({ label: "All roles", value: "" });

  return {
    sticky,
    params: [
      {
        label: "Search...",
        name: "keyword",
        value: ""
      },
      {
        label: "Role",
        name: "role",
        options: roleOptions
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
