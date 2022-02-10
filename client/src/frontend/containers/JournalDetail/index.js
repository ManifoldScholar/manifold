import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityHero from "frontend/components/composed/EntityHero";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { FooterLink } from "frontend/components/composed/EntityCollection/parts";
import Journal from "frontend/components/journal";
import { journalVolumesAPI, journalIssuesAPI } from "api";
import { useFetch, usePaginationState } from "hooks";
import lh from "helpers/linkHandler";

function JournalDetailContainer({ journal }) {
  const [issuesPagination] = usePaginationState(1, 8);
  const [volumesPagination] = usePaginationState(1, 5);

  const { data: volumes } = useFetch({
    request: [journalVolumesAPI.index, journal.id, volumesPagination]
  });

  const issuesFilter = useMemo(
    () => ({ journal_id: journal.id, volume_is_nil: true }),
    [journal.id]
  );

  const { data: issues } = useFetch({
    request: [journalIssuesAPI.index, issuesFilter, issuesPagination]
  });

  if (!journal) return null;

  const {
    titlePlaintext,
    journalIssuesCount,
    journalVolumesCount,
    journalIssuesWithoutVolumeCount
  } = journal.attributes;

  return journal ? (
    <>
      <CheckFrontendMode debugLabel="JournalDetail" isProjectHomePage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: titlePlaintext
          }
        ]}
      />
      <EntityHeadContent entity={journal} />
      <EntityHero.Journal entity={journal} />
      <EntityCollection.JournalVolumes
        volumes={volumes}
        journal={journal}
        countProps={{
          count: journalIssuesCount,
          unit: "issue",
          customTemplate: (count, unit) => (
            <Journal.IssueCount
              count={count}
              unit={unit}
              categoryCount={journalVolumesCount}
              uncategorized={journalIssuesWithoutVolumeCount}
            />
          )
        }}
        FooterComponent={() => (
          <FooterLink
            to={lh.link("frontendJournalAllVolumes", journal.id)}
            label="See all volumes"
          />
        )}
      />
      <EntityCollection.JournalIssues
        issues={issues}
        journal={journal}
        FooterComponent={() => (
          <FooterLink
            to={lh.link("frontendJournalAllIssues", journal.id)}
            label="See all issues"
          />
        )}
      />
      <Journal.Metadata journal={journal} />
    </>
  ) : null;
}

JournalDetailContainer.displayName = "Frontend.Containers.JournalDetail";

JournalDetailContainer.propTypes = {
  journal: PropTypes.object,
  response: PropTypes.object
};

export default JournalDetailContainer;
