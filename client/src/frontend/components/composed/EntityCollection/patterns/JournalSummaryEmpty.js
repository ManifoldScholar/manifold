import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Warning from "frontend/components/content-block/parts/Warning/Warning";
import EntityCollection from "../EntityCollection";

export default function JournalSummaryEmpty({ journalId }) {
  const body = (
    <>
      Add <Link to={lh.link("backendJournalVolumes", journalId)}>volumes</Link>{" "}
      or <Link to={lh.link("backendJournalIssues", journalId)}>issues</Link> to
      see this page.
    </>
  );
  return (
    <EntityCollection
      BodyComponent={() => (
        <Warning
          icon="warningSign64"
          heading="This journal is currently empty."
          body={body}
        />
      )}
    />
  );
}
