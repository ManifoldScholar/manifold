import React from "react";
import PropTypes from "prop-types";
import Metadata from "backend/components/metadata";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

export function JournalMetadataContainer({ journal }) {
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

JournalMetadataContainer.propTypes = {
  journal: PropTypes.object
};

export default JournalMetadataContainer;
