import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Warning from "frontend/components/content-block/parts/Warning/Warning";
import EntityCollection from "../EntityCollection";

export default function JournalSummaryEmpty({ journalId }) {
  const { t } = useTranslation();
  const body = (
    <Trans t={t} key="messages.empty_journal_body">
      Add <Link to={lh.link("backendJournalVolumes", journalId)}>volumes</Link>{" "}
      or <Link to={lh.link("backendJournalIssues", journalId)}>issues</Link> to
      see this page.
    </Trans>
  );
  return (
    <EntityCollection
      BodyComponent={() => (
        <Warning
          icon="warningSign64"
          heading={t("messages.empty_journal_heading")}
          body={body}
        />
      )}
    />
  );
}
