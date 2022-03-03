import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, usePaginationState } from "hooks";
import { journalVolumesAPI } from "api";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";
import { capitalize } from "utils/string";

export default function JournalVolumesList({ journal }) {
  const { id } = useParams();
  const [pagination, setPageNumber] = usePaginationState(1, 5);
  const { data: volumes, meta } = useFetch({
    request: [journalVolumesAPI.index, id, pagination]
  });

  const { t } = useTranslation();
  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendJournalsList"),
        label: t("navigation.breadcrumbs.all_journals")
      },
      {
        to: lh.link("frontendJournalDetail", journal.id),
        label: journal.attributes.titlePlaintext
      },
      {
        to: lh.link("frontendJournalAllVolumes", journal.id),
        label: t("glossary.volume_other")
      }
    ],
    [journal.id, journal.attributes.titlePlaintext, t]
  );

  if (!journal || !volumes || !meta) return null;

  const { titlePlaintext } = journal.attributes;

  return (
    <>
      <h1 className="screen-reader-text">
        {`${titlePlaintext}: ${capitalize(t("glossary.volume_other"))}`}
      </h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityHeadContent entity={journal} />
      <EntityMasthead entity={journal} />
      <EntityCollection.JournalVolumes
        title={`${titlePlaintext}: ${capitalize(t("glossary.volume_other"))}`}
        journal={journal}
        volumes={volumes}
        meta={meta}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
      />
    </>
  );
}
