import { useContext } from "react";
import { AppContext } from "app/contexts";

export default function useSettings() {
  const { settings } = useContext(AppContext);
  return settings;
}
