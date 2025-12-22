import { useOutletContext } from "react-router";
import { journalVolumesAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import Journal from "frontend/components/journal";
import { useSettings } from "hooks";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export const loader = async ({ params, context }) => {
  const fetchFn = () => journalVolumesAPI.show(params.volumeSlug);
  return loadEntity({ context, fetchFn });
};

// Can adjust the api, but for now issues are included with
// journal response not volume
const appendIssues = (volume, issues) => ({
  ...volume,
  relationships: {
    ...volume.relationships,
    journalIssues: issues.filter(
      issue => issue.relationships?.journalVolume?.id === volume.id
    )
  }
});

export default function VolumeDetailRoute({ loaderData: volume }) {
  const journal = useOutletContext();
  const { volumeSlug } = useParams();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug: journalSlug } = journal.attributes;
  const nestedCrumbs = [
    {
      to: `/journals/${journalSlug}`,
      label: titlePlaintext
    },
    {
      to: `/journals/${journalSlug}/volumes/${volumeSlug}`,
      label: `${t("glossary.volume_one")} ${volume.attributes.number}`
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

  const headContentProps = useEntityHeadContent(
    volume,
    journal,
    t("glossary.volume_title_case_one")
  );

  return (
    <>
      <CheckFrontendMode debugLabel="VolumeDetail" isProjectSubpage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <h1 className="screen-reader-text">
        {`${journal.attributes.title}: ${t("glossary.volume_title_case_one")} ${
          volume.attributes.number
        }`}
      </h1>
      <EntityMasthead entity={journal} />
      <Journal.VolumeDetail
        journal={journal}
        volume={appendIssues(volume, journal.relationships?.journalIssues)}
      />
    </>
  );
}
