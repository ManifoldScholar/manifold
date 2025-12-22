import { useOutletContext } from "react-router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityHero from "frontend/components/entity/Hero";
import EntityCollection from "frontend/components/entity/Collection";
import { FooterLink } from "frontend/components/entity/Collection/parts";
import Journal from "frontend/components/journal";
import { useSettings } from "hooks";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import Schema from "global/components/schema";

export default function JournalDetailRoute() {
  const journal = useOutletContext();
  const {
    journalVolumes: volumes = [],
    journalIssues: issues = []
  } = journal.relationships;
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = journal.attributes;
  const breadcrumbs = libraryDisabled
    ? null
    : [
        {
          to: "/journals",
          label: t("navigation.breadcrumbs.all_journals")
        },
        {
          to: `/journals/${slug}`,
          label: titlePlaintext
        }
      ];

  const headContentProps = useEntityHeadContent(journal);

  const {
    journalIssuesCount,
    journalVolumesCount,
    journalIssuesWithoutVolumeCount
  } = journal.attributes;

  return (
    <>
      <CheckFrontendMode debugLabel="JournalDetail" isProjectHomePage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <EntityHero.Journal entity={journal} />
      {!volumes?.length && !issues?.length && (
        <Authorize entity={journal} ability="update">
          <EntityCollection.JournalSummaryEmpty journalSlug={slug} />
        </Authorize>
      )}
      <EntityCollection.JournalVolumes
        volumes={volumes}
        journal={journal}
        countProps={{
          count: journalIssuesCount,
          unit: t("glossary.issue", { count: journalIssuesCount }),
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
            to={`/journals/${slug}/volumes`}
            label={t("navigation.see_all_volumes")}
          />
        )}
      />
      <EntityCollection.JournalIssues
        issues={issues}
        journal={journal}
        countProps={
          !journalVolumesCount
            ? {
                count: journalIssuesCount,
                unit: t("glossary.issue", { count: journalIssuesCount }),
                customTemplate: (count, unit) => (
                  <Journal.IssueCount
                    count={count}
                    unit={unit}
                    categoryCount={journalVolumesCount}
                    uncategorized={journalIssuesWithoutVolumeCount}
                  />
                )
              }
            : null
        }
        FooterComponent={() => (
          <FooterLink
            to={`/journals/${slug}/issues`}
            label={t("navigation.see_all_issues")}
          />
        )}
      />
      <Journal.Metadata journal={journal} />
      <Schema.Journal journal={journal} />
    </>
  );
}
