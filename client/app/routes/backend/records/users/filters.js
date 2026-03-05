const ROLES = {
  admin: "Admin",
  editor: "Editor",
  project_creator: "Project Creator",
  marketeer: "Marketeer",
  reader: "Reader"
};

const roleOptions = [
  { label: "All roles", value: "" },
  ...Object.entries(ROLES).map(([value, label]) => ({
    label: `Role: ${label}`,
    value
  }))
];

const orderOptions = [
  { label: "Alphabetical by first name", value: "first_name" },
  { label: "Alphabetical by last name", value: "last_name" }
];

export const FILTER_PARAMS = [
  { label: "Search...", name: "keyword", value: "" },
  { label: "Role", name: "role_name", options: roleOptions },
  {
    label: "Order",
    name: "order",
    value: "last_name",
    options: orderOptions
  }
];

export const INIT_FILTERS = { order: "last_name" };

export const INIT_SEARCH_PROPS = {
  params: FILTER_PARAMS.map(p => ({
    label: p.label,
    name: p.name,
    options: p.options
  })),
  values: { keyword: "", role_name: "", order: "last_name" }
};
