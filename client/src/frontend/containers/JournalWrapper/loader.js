import { redirect } from "react-router";
import dataLoader from "helpers/router/loaders/dataLoader";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";

export default async function loader({ params, context }) {
  const { id } = params;

  if (id === "all") {
    throw redirect(lh.link("frontendJournalsList"));
  }

  await dataLoader({
    request: [journalsAPI.show, id],
    context
  });

  return { journalId: id };
}
