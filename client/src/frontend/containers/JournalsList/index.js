import React from "react";
import { journalsAPI } from "api";
import GlobalUtility from "global/components/utility";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useFilterState, usePaginationState } from "hooks";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";

export default function JournalsListContainer() {
  const [filters] = useFilterState();
  const [pagination, setPageNumber] = usePaginationState(1, 8);
  const { data: journals, meta } = useFetch({
    request: [journalsAPI.index, filters, pagination]
  });

  const { t } = useTranslation();

  if (!journals || !meta) return null;

  const showPagination = meta.pagination?.totalPages > 1;

  return (
    <>
      <HeadContent title={t("titles.journals_all")} appendDefaultTitle />
      <CheckFrontendMode debugLabel="JournalsList" />
      <h1 className="screen-reader-text">{t("glossary.journal_other")}</h1>
      {!!journals.length &&
        journals.map((journal, index) => (
          <EntityCollection.JournalSummary
            key={journal.id}
            journal={journal}
            bgColor={index % 2 === 1 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
      {!journals.length && <EntityCollectionPlaceholder.Journals />}
      {showPagination && (
        <section>
          <div className="container">
            <GlobalUtility.Pagination
              paginationClickHandler={page => () => setPageNumber(page)}
              pagination={meta.pagination}
            />
          </div>
        </section>
      )}
      <CollectionNavigation />
    </>
  );
}
