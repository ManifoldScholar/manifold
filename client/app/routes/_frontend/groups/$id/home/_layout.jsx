import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI } from "api";
import { getEntityCollection } from "components/frontend/collecting/helpers";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "components/frontend/collecting/reading-group";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";

export const loader = async ({ params, context }) => {
  // Fetch collected items in parallel
  const results = await loadParallelLists({
    context,
    fetchFns: {
      projects: () => readingGroupsAPI.collected(params.id, "projects"),
      texts: () => readingGroupsAPI.collected(params.id, "texts"),
      textSections: () =>
        readingGroupsAPI.collected(params.id, "text_sections"),
      resourceCollections: () =>
        readingGroupsAPI.collected(params.id, "resource_collections"),
      resources: () => readingGroupsAPI.collected(params.id, "resources"),
      journalIssues: () =>
        readingGroupsAPI.collected(params.id, "journal_issues"),
      categories: () => readingGroupsAPI.categories(params.id)
    }
  });

  return {
    responses: {
      projects: results.projects ?? null,
      texts: results.texts ?? null,
      textSections: results.textSections ?? null,
      resourceCollections: results.resourceCollections ?? null,
      resources: results.resources ?? null,
      journalIssues: results.journalIssues ?? null
    },
    categories: results.categories ?? null
  };
};

export default function ReadingGroupHomepageWrapper({ loaderData }) {
  const { responses, categories } = loaderData;
  const readingGroup = useOutletContext();
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();

  const closeUrl = `/groups/${readingGroup.id}/home`;

  function handleUncollect(collection) {
    if (collection.id === readingGroup.id) {
      revalidate();
    }
  }

  const collection = getEntityCollection(readingGroup);
  const uncategorizedMappings =
    collection.attributes?.categoryMappings.$uncategorized$;

  const hasPopulatedCategories = categories?.length > 0;
  const hasUncategorized = !!uncategorizedMappings;
  const showPlaceholder = !hasPopulatedCategories && !hasUncategorized;

  const uncategorized = {
    id: "$uncategorized$",
    attributes: {
      title: t("common.uncategorized_title_case")
    }
  };

  return (
    <>
      {showPlaceholder ? (
        <CollectionPlaceholder readingGroup={readingGroup} />
      ) : (
        <>
          {hasPopulatedCategories &&
            categories.map(category => (
              <CollectionCategory
                key={category.id}
                category={category}
                mappings={collection.attributes.categoryMappings}
                responses={responses}
                onUncollect={handleUncollect}
              />
            ))}
          {hasUncategorized && (
            <CollectionCategory
              category={uncategorized}
              mappings={collection.attributes.categoryMappings}
              responses={responses}
              onUncollect={handleUncollect}
            />
          )}
        </>
      )}
      <OutletWithDrawers
        context={readingGroup}
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl
        }}
      />
    </>
  );
}
