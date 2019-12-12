import abilities from "../structures/abilities";

const comment = () => ({
  type: "comments",
  attributes: {
    body: "Plaid clash with polka dots, I hope you ain't mad.",
    createdAt: "2017-04-24T23:25:50.161Z",
    abilities: abilities()
  },
  relationships: {
    creator: "user"
  }
});

export default comment;
