import { useSelector } from "react-redux";

export default function useCurrentUser(mock = false) {
  const user = useSelector(state => state.authentication.currentUser);
  if (mock) return mock;
  return user;
}
