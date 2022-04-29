// To be localized in v8. Moving enum here, so we can remove localeOld from translation files. -LD

const ROLES = {
  admin: "Admin",
  editor: "Editor",
  project_creator: "Project Creator",
  marketeer: "Marketeer",
  reader: "Reader"
};

export default function userFilters({ snapshotState = false } = {}) {
  const roles = Object.keys(ROLES);
  const labels = ROLES;
  const roleOptions = roles.map(role => {
    return {
      label: `Role: ${labels[role]}`,
      value: role
    };
  });
  roleOptions.unshift({ label: "All roles", value: "" });

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
