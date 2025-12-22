import { useOutletContext } from "react-router";
import { journalIssuesAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadList from "app/routes/utility/loaders/loadList";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import { useListFilters, useListSearchParams, useSettings } from "hooks";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityMasthead from "frontend/components/entity/Masthead";
import EntityCollection from "frontend/components/entity/Collection";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { useTranslation } from "react-i18next";

const FILTER_RESET = { order: "sort_title DESC" };

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = (filters, pagination) =>
    journalIssuesAPI.journalIndex(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn,
    options: {
      defaultFilters: FILTER_RESET
    }
  });
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    journalIssuesAPI.journalIndex(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__journalIssuesHydrated",
    fetchFn,
    options: {
      defaultFilters: FILTER_RESET
    }
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function JournalIssuesListRoute({ loaderData }) {
  const { data: issues, meta } = loaderData;
  const journal = useOutletContext();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET
  });

  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = journal.attributes;
  const containerTitle = `${titlePlaintext}: ${t(
    "glossary.issue_truncated_title_case_other"
  )}`;

  const nestedCrumbs = [
    {
      to: `/journals/${slug}`,
      label: titlePlaintext
    },
    {
      to: `/journals/${slug}/issues`,
      label: t("navigation.breadcrumbs.issues")
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

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: { journal_id: journal.id, order: "sort_title DESC" },
    options: {
      entityType: "journalIssue",
      sort: true
    }
  });

  return (
    <>
      <h1 className="screen-reader-text">{containerTitle}</h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <EntityMasthead entity={journal} />
      <EntityCollection.Issues
        title={containerTitle}
        issues={issues}
        issuesMeta={meta}
        parentView
        filterProps={filterProps}
      />
    </>
  );
}
