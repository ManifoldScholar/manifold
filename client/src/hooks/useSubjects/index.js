import { useContext } from "react";
import { FrontendContext } from "app/contexts";

export default function useSubjects() {
  const { subjects } = useContext(FrontendContext);
  return subjects;
}
