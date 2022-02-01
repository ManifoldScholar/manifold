import { useContext } from "react";
import { FrontendModeContext } from "helpers/contexts";

export default function useFrontendModeContext() {
  const context = useContext(FrontendModeContext);
  if (!context) {
    throw new Error(
      `FrontendMode components cannot be rendered outside the frontend of the application.`
    );
  }
  return context;
}
