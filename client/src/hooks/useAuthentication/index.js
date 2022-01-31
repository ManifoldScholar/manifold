import { useSelector } from "react-redux";

export default function useCurrentUser(mock = false) {
  const authentication = useSelector(state => state.authentication);
  if (mock) return mock;
  return authentication;
}
