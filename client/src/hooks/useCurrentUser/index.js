import useAuthentication from "../useAuthentication";

export default function useCurrentUser() {
  const { currentUser } = useAuthentication();
  return currentUser;
}
