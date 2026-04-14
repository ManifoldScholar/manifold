import { useOutletContext } from "react-router";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import HeadContent from "components/global/HeadContent";
import EntityHero from "components/frontend/entity/Hero";
import EntityCollection from "components/frontend/entity/Collection";
import { FooterLink } from "components/frontend/entity/Collection/parts";
import Journal from "components/frontend/journal";
import { useSettings } from "hooks";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import Schema from "components/global/schema";

export const handle = { frontendMode: { isProjectHomepage: true } };

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
