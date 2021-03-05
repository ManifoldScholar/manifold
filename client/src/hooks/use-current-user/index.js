import { useSelector } from "react-redux";

export default function useCurrentUser() {
  const user = useSelector(state =>
    state.authentication.authenticated ? state.authentication.currentUser : null
  );

  return user;
}
