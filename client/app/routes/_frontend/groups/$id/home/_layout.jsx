import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI } from "api";
import { getEntityCollection } from "components/frontend/collecting/helpers";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import loadAllPagesParallel from "lib/react-router/loaders/loadAllPagesParallel";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "components/frontend/collecting/reading-group";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";

const collectedFetchFns = id => ({
  projects: () => readingGroupsAPI.collected(id, "projects"),
  texts: () => readingGroupsAPI.collected(id, "texts"),
  textSections: () => readingGroupsAPI.collected(id, "text_sections"),
  resourceCollections: () =>
    readingGroupsAPI.collected(id, "resource_collections"),
  resources: () => readingGroupsAPI.collected(id, "resources"),
  journalIssues: () => readingGroupsAPI.collected(id, "journal_issues")
});

export const loader = async ({ params, context }) => {
  const results = await loadParallelLists({
    context,
    fetchFns: {
      ...collectedFetchFns(params.id),
      categories: () => readingGroupsAPI.categories(params.id)
    }
  });

  const { categories, ...responses } = results;
  return { responses, categories: categories.data };
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const server = await serverLoader();
  const responses = await loadAllPagesParallel({
    signal: request.signal,
    fetchFns: collectedFetchFns(params.id),
    initials: server.responses
  });
  return { ...server, responses };
};

clientLoader.hydrate = true;

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
