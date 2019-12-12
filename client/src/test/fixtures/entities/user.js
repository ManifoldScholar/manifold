import abilities from "../structures/abilities";
import classAbilities from "../structures/class-abilities";

const user = () => ({
  type: "users",
  attributes: {
    email: "test@cic-fake.gotcha",
    firstName: "Rowan",
    lastName: "Ida",
    fullName: "Rowan Ida",
    role: "admin",
    kind: "admin",
    avatarStyles: {},
    isCurrentUser: true,
    classAbilities: classAbilities(),
    abilities: abilities()
  }
});

export default user;
