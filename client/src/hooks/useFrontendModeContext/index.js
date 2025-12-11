import { useContext } from "react";
import { AppContext } from "app/contexts";

export default function useFrontendModeContext() {
  const { frontendMode } = useContext(AppContext);
  return frontendMode || {};
}
