const event = () => ({
  type: "events",
  attributes: {
    eventType: "text_added",
    eventTitle: "Text Added",
    eventSubtitle: "It was added",
    subjectType: "Text",
    subjectTitle: "New Text",
    createdAt: "2017-04-24T23:25:50.161Z",
    subjectSlug: "subject-slug",
    projectSlug: "project-slug"
  }
});
export default event;
