import abilities from "../structures/abilities";

const readingGroup = () => ({
  type: "readingGroups",
  attributes: {
    name: "A reading group",
    privacy: "private",
    currentUserRole: "owner",
    annotationsCount: 5,
    highlightsCount: 5,
    membershipsCount: 10,
    abilities: abilities()
  }
});

export default readingGroup;
