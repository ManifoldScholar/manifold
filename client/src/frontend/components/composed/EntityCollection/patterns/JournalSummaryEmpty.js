import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Warning from "frontend/components/content-block/parts/Warning/Warning";
import EntityCollection from "../EntityCollection";

export default function JournalSummaryEmpty({ journalSlug }) {
  const { t } = useTranslation();
  /* eslint-disable react/self-closing-comp */
  const body = (
    <Trans
      i18nKey="messages.empty_journal_body"
      components={[
        <Link to={lh.link("backendJournalVolumes", journalSlug)}></Link>,
        <Link to={lh.link("backendJournalIssues", journalSlug)}></Link>
      ]}
    />
  );
  /* eslint-disable react/self-closing-comp */
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
