import { useSelector } from "react-redux";

export default function useAuthentication() {
  return useSelector(state => state.authentication);
}
