import { useContext } from "react";
import { FrontendContext } from "app/contexts";

export default function useJournalSubjects() {
  const { journalSubjects } = useContext(FrontendContext);
  return journalSubjects;
}
