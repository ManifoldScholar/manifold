import factory from "../factory";

export default function authentication({
  authenticated = true,
  user = null
} = {}) {
  const currentUser = user || authenticated ? factory("user") : user;

  return {
    authenticated,
    currentUser
  };
}
