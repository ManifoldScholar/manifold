import React, { useMemo } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import { journalVolumesAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import Journal from "frontend/components/journal";
import { useFetch, useFromStore } from "hooks";

function VolumeDetailContainer() {
  const { journal } = useOutletContext() || {};
  const { volumeSlug: slug } = useParams();
  const { data: volume } = useFetch({
    request: [journalVolumesAPI.show, slug]
  });

  const { t } = useTranslation();
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug: journalSlug } = journal?.attributes ?? {};
  const breadcrumbs = useMemo(() => {
    const nestedCrumbs = [
      {
        to: lh.link("frontendJournalDetail", journalSlug),
        label: titlePlaintext
      },
      {
        to: lh.link("frontendVolumeDetail", journalSlug, slug),
        label: `${t("glossary.volume_one")} ${volume?.attributes?.number}`
      }
    ];
    return libraryDisabled
      ? nestedCrumbs
      : [
          {
            to: lh.link("frontendJournalsList"),
            label: t("navigation.breadcrumbs.all_journals")
          },
          ...nestedCrumbs
        ];
  }, [
    t,
    journalSlug,
    titlePlaintext,
    volume?.attributes?.number,
    slug,
    libraryDisabled
  ]);

  const headContentProps = useEntityHeadContent(
    volume,
    journal,
    t("glossary.volume_title_case_one")
  );

  return journal && volume ? (
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
      <Journal.VolumeDetail journal={journal} volume={volume} />
    </>
  ) : null;
}

VolumeDetailContainer.displayName = "Frontend.Containers.VolumeDetail";

export default VolumeDetailContainer;
