import { useOutletContext } from "react-router-dom";
import Metadata from "backend/components/metadata";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export default function JournalMetadataContainer() {
  const { journal } = useOutletContext() || {};

  if (!journal) return null;

  return (
    <Authorize
      entity={journal}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <Metadata.Form
        model={journal}
        name="backend-journal-general"
        update={journalsAPI.update}
        create={journalsAPI.create}
        className="form-secondary"
      />
    </Authorize>
  );
}
