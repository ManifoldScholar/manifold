import React, { useMemo } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useListQueryParams, useFromStore } from "hooks";
import { journalVolumesAPI } from "api";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import EntityCollection from "frontend/components/entity/Collection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";

export default function JournalVolumesList() {
  const { journal } = useOutletContext() || {};
  const { id } = useParams();

  const { pagination } = useListQueryParams({ initSize: 5 });

  const { data: volumes, meta } = useFetch({
    request: [journalVolumesAPI.index, id, pagination]
  });

  const { t } = useTranslation();
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = journal?.attributes ?? {};

  const breadcrumbs = useMemo(() => {
    const nestedCrumbs = [
      {
        to: lh.link("frontendJournalDetail", slug),
        label: titlePlaintext
      },
      {
        to: lh.link("frontendJournalAllVolumes", slug),
        label: t("glossary.volume_other")
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
  }, [slug, titlePlaintext, t, libraryDisabled]);

  const headContentProps = useEntityHeadContent(journal);

  if (!journal || !volumes || !meta) return null;

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
        volumes={volumes}
        meta={meta}
      />
    </>
  );
}
