import { useContext } from "react";
import { AppContext } from "app/contexts";

export default function useAuthentication() {
  const { auth } = useContext(AppContext);
  return {
    authenticated: !!auth?.user,
    currentUser: auth?.user ?? null,
    authToken: auth?.authToken ?? null
  };
}
