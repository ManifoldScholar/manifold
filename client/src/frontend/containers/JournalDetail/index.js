import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHero from "frontend/components/composed/EntityHero";
import Journal from "frontend/components/journal";
import lh from "helpers/linkHandler";

function JournalDetailContainer({ journal, journalResponse, settings }) {
  const ogTitle = () => {
    if (!settings) return null;
    const { socialTitle, title } = journal.attributes;
    return (
      socialTitle ||
      `\u201c${title}\u201d on ${settings.attributes.general.installationName}`
    );
  };

  const ogDescription = () => {
    const { descriptionPlaintext, socialDescription } = journal.attributes;
    return socialDescription || descriptionPlaintext;
  };

  const ogImage = () => {
    const { socialImageStyles, heroStyles } = journal.attributes;
    if (socialImageStyles?.mediumLandscape)
      return socialImageStyles.mediumLandscape;
    if (heroStyles?.mediumLandscape) return heroStyles.mediumLandscape;
    return null;
  };

  if (!journalResponse) return null;

  if (journalResponse.status === 401)
    return <Redirect to={lh.link("frontend")} />;

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
      <HeadContent
        title={ogTitle()}
        description={ogDescription()}
        image={ogImage()}
      />
      <EntityHero.Journal entity={journal} />
      <Journal.IssueList journal={journal} />
      <Journal.Metadata journal={journal} />
    </>
  );
}

JournalDetailContainer.displayName = "Frontend.Containers.JournalDetail";

JournalDetailContainer.propTypes = {
  journal: PropTypes.object,
  journalResponse: PropTypes.object,
  settings: PropTypes.object
};

export default JournalDetailContainer;
