import abilities from "../structures/abilities";

const readingGroupMembership = () => ({
  type: "readingGroupMemberships",
  attributes: {
    abilities: abilities()
  }
});

export default readingGroupMembership;
