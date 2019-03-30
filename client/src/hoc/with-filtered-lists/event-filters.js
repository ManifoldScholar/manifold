import config from "config";

export default function eventFilters({ sticky = false } = {}) {
  const eventOptions = Object.keys(config.app.locale.event_types).map(key => {
    return {
      label: `Type is "${config.app.locale.event_types[key]}"`,
      value: key
    };
  });

  return {
    sticky,
    params: [
      {
        label: "Search...",
        name: "keyword",
        value: ""
      },
      {
        label: "Type",
        name: "type",
        options: eventOptions
      }
    ]
  };
}
