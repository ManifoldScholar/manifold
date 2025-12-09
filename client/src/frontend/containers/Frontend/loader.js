import dataLoader from "helpers/router/loaders/dataLoader";
import { subjectsAPI, requests } from "api";

const SUBJECT_FILTERS = { used: true };
const JOURNAL_SUBJECT_FILTERS = { usedJournal: true };

export default async function loader({ context }) {
  // Fetch both subject lists in parallel
  const [subjectsResult, journalSubjectsResult] = await Promise.all([
    dataLoader({
      request: [subjectsAPI.index, SUBJECT_FILTERS, null, true],
      context,
      requestKey: requests.feSubjects
    }),
    dataLoader({
      request: [subjectsAPI.index, JOURNAL_SUBJECT_FILTERS, null, true],
      context,
      requestKey: requests.feJournalSubjects
    })
  ]);

  return {
    subjectsRequestKey: subjectsResult.requestKey,
    journalSubjectsRequestKey: journalSubjectsResult.requestKey
  };
}
