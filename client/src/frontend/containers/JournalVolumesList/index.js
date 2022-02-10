import React from "react";
import { useParams } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import { journalVolumesAPI } from "api";
import EntityHeadContent from "frontend/components/atomic/EntityHeadContent";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import lh from "helpers/linkHandler";

export default function JournalVolumesList({ journal }) {
  const { id } = useParams();
  const [pagination, setPageNumber] = usePaginationState(1, 5);
  const { data: volumes, meta } = useFetch({
    request: [journalVolumesAPI.index, id, pagination]
  });

  if (!journal || !volumes || !meta) return null;

  const { titlePlaintext } = journal.attributes;

  return (
    <>
      <h1 className="screen-reader-text">{`${titlePlaintext}: Volumes`}</h1>
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: journal.attributes.titlePlaintext
          },
          {
            to: lh.link("frontendJournalAllVolumes", journal.id),
            label: "Volumes"
          }
        ]}
      />
      <EntityHeadContent entity={journal} />
      <EntityMasthead entity={journal} />
      <EntityCollection.JournalVolumes
        title={`${titlePlaintext}: Volumes`}
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
