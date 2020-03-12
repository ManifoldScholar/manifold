import abilities from "../structures/abilities";

const readingGroupMembership = () => ({
  type: "readingGroupMemberships",
  attributes: {
    name: "John Rambo",
    abilities: abilities()
  }
});

export default readingGroupMembership;
