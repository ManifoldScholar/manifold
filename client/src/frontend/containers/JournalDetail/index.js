import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityHero from "frontend/components/composed/EntityHero";
import Journal from "frontend/components/journal";
import lh from "helpers/linkHandler";

function JournalDetailContainer({ journal, response }) {
  // if (!response) return null;

  if (response?.status === 401) return <Redirect to={lh.link("frontend")} />;

  if (!journal) return null;

  return (
    <>
      <CheckFrontendMode debugLabel="JournalDetail" isProjectHomePage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "Back to All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: journal.attributes.titlePlaintext
          }
        ]}
      />
      <EntityHeadContent entity={journal} />
      <EntityHero.Journal entity={journal} />
      <Journal.IssueList journal={journal} />
      <Journal.Metadata journal={journal} />
    </>
  );
}

JournalDetailContainer.displayName = "Frontend.Containers.JournalDetail";

JournalDetailContainer.propTypes = {
  journal: PropTypes.object,
  response: PropTypes.object
};

export default JournalDetailContainer;
