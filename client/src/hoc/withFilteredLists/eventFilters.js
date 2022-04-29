// To be localized in v8. Moving enum here, so we can remove localeOld from translation files. -LD

const EVENT_TYPES = {
  project_created: "Project Created",
  text_added: "Text Added",
  text_annotated: "Text Annotated",
  resource_added: "Resource Added",
  comment_created: "Comment Created",
  tweet: "Tweet"
};

export default function eventFilters({ snapshotState = false } = {}) {
  const eventOptions = Object.keys(EVENT_TYPES).map(key => {
    return {
      label: `Type is "${EVENT_TYPES[key]}"`,
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
