import { useContext } from "react";
import { FrontendContext } from "app/contexts";

export default function useFrontendModeContext() {
  const { frontendMode } = useContext(FrontendContext);
  return frontendMode ?? {};
}
