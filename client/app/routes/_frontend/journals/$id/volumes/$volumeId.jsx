import { useOutletContext } from "react-router";
import { journalVolumesAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import HeadContent from "components/global/HeadContent";
import EntityMasthead from "components/frontend/entity/Masthead";
import Journal from "components/frontend/journal";
import { useSettings } from "hooks";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export const handle = { frontendMode: { isProjectSubpage: true } };

export const loader = async ({ params, request, context }) => {
  const fetchFn = () => journalVolumesAPI.show(params.volumeId);
  return loadEntity({ context, fetchFn, request });
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
  const { volumeId } = useParams();
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
      to: `/journals/${journalSlug}/volumes/${volumeId}`,
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
