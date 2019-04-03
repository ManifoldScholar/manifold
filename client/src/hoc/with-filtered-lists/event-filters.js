import config from "config";

export default function eventFilters({ snapshotState = false } = {}) {
  const eventOptions = Object.keys(config.app.locale.event_types).map(key => {
    return {
      label: `Type is "${config.app.locale.event_types[key]}"`,
      value: key
    };
  });

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
        label: "Type",
        name: "type",
        options: eventOptions
      }
    ]
  };
}
