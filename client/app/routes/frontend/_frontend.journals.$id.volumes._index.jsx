import { useOutletContext } from "react-router";
import { journalVolumesAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadList from "app/routes/utility/loaders/loadList";
import { useSettings } from "hooks";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import EntityCollection from "frontend/components/entity/Collection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { useTranslation } from "react-i18next";

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = (ignoredFilters, pagination) =>
    journalVolumesAPI.index(params.id, pagination);

  return loadList({
    request,
    context,
    fetchFn
  });
};

// Can adjust the api, but for now issues are included with
// journal response not volume
const appendIssues = (volumes, issues) =>
  volumes.map(volume => {
    const volumeIssues = issues.filter(
      issue => issue.relationships?.journalVolume?.id === volume.id
    );

    return {
      ...volume,
      relationships: {
        ...volume.relationships,
        journalIssues: volumeIssues
      }
    };
  });

export default function JournalVolumesListRoute({ loaderData }) {
  const { data: volumes, meta } = loaderData;
  const journal = useOutletContext();

  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = journal.attributes;

  const nestedCrumbs = [
    {
      to: `/journals/${slug}`,
      label: titlePlaintext
    },
    {
      to: `/journals/${slug}/volumes`,
      label: t("glossary.volume_other")
    }
  ];
  const breadcrumbs = libraryDisabled
    ? nestedCrumbs
    : [
        {
          to: "/journals",
          label: t("navigation.breadcrumbs.all_journals")
        },
        ...nestedCrumbs
      ];

  const headContentProps = useEntityHeadContent(journal);

  return (
    <>
      <h1 className="screen-reader-text">
        {`${titlePlaintext}: ${t("glossary.volume_title_case_other")}`}
      </h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <EntityMasthead entity={journal} />
      <EntityCollection.JournalVolumes
        title={`${titlePlaintext}: ${t("glossary.volume_title_case_other")}`}
        journal={journal}
        volumes={appendIssues(volumes, journal.relationships?.journalIssues)}
        meta={meta}
      />
    </>
  );
}
