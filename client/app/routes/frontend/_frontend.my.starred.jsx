import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import HeadContent from "global/components/HeadContent";
import MyStarredEntityCollection from "frontend/components/entity/Collection/patterns/MyStarred";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import { useCurrentUser } from "hooks";

export const loader = async ({ request, context }) => {
  requireLogin(request, context);

  const results = await loadParallelLists({
    context,
    fetchFns: {
      projects: () => meAPI.myCollected("projects"),
      texts: () => meAPI.myCollected("texts"),
      textSections: () => meAPI.myCollected("text_sections"),
      resourceCollections: () => meAPI.myCollected("resource_collections"),
      resources: () => meAPI.myCollected("resources"),
      journalIssues: () => meAPI.myCollected("journal_issues")
    }
  });

  return {
    projects: results.projects ?? [],
    texts: results.texts ?? [],
    textSections: results.textSections ?? [],
    resourceCollections: results.resourceCollections ?? [],
    resources: results.resources ?? [],
    journalIssues: results.journalIssues ?? []
  };
};

export default function MyStarredRoute({ loaderData }) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const collection = getEntityCollection(currentUser);

  const responses = {
    projects: loaderData.projects,
    texts: loaderData.texts,
    textSections: loaderData.textSections,
    resourceCollections: loaderData.resourceCollections,
    resources: loaderData.resources,
    journalIssues: loaderData.journalIssues
  };

  return (
    <>
      <HeadContent title={t("pages.my_starred")} appendDefaultTitle />
      <MyStarredEntityCollection
        collection={collection}
        responses={responses}
      />
      <CollectionNavigation />
    </>
  );
}
