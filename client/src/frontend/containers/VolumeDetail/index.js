import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import { journalVolumesAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import Journal from "frontend/components/journal";
import { useFetch } from "hooks";
import { capitalize } from "utils/string";

function VolumeDetailContainer({ journal }) {
  const { volumeSlug: slug } = useParams();
  const { data: volume } = useFetch({
    request: [journalVolumesAPI.show, slug]
  });

  const { t } = useTranslation();

  const { titlePlaintext, slug: journalSlug } = journal?.attributes ?? {};
  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendJournalsList"),
        label: t("navigation.breadcrumbs.all_journals")
      },
      {
        to: lh.link("frontendJournalDetail", journalSlug),
        label: titlePlaintext
      },
      {
        to: lh.link("frontendVolumeDetail", journalSlug, slug),
        label: `${t("glossary.volume_one")} ${volume?.attributes?.number}`
      }
    ],
    [t, journalSlug, titlePlaintext, volume?.attributes?.number, slug]
  );

  return journal && volume ? (
    <>
      <CheckFrontendMode debugLabel="VolumeDetail" isProjectSubpage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent
        entity={volume}
        type={capitalize(t("glossary.volume_one"))}
        parentEntity={journal}
      />
      <h1 className="screen-reader-text">
        {`${journal.attributes.title}: ${capitalize(
          t("glossary.volume_one")
        )} ${volume.attributes.number}`}
      </h1>
      <EntityMasthead entity={journal} />
      <Journal.VolumeDetail journal={journal} volume={volume} />
    </>
  ) : null;
}

VolumeDetailContainer.displayName = "Frontend.Containers.VolumeDetail";

VolumeDetailContainer.propTypes = {
  journal: PropTypes.object
};

export default VolumeDetailContainer;
