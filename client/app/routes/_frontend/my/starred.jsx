import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "lib/react-router/loaders/requireLogin";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import loadAllPagesParallel from "lib/react-router/loaders/loadAllPagesParallel";
import HeadContent from "components/global/HeadContent";
import MyStarredEntityCollection from "components/frontend/entity/Collection/patterns/MyStarred";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import { getEntityCollection } from "components/frontend/collecting/helpers";
import { useAuthentication } from "hooks";

const fetchFns = {
  projects: () => meAPI.myCollected("projects"),
  texts: () => meAPI.myCollected("texts"),
  textSections: () => meAPI.myCollected("text_sections"),
  resourceCollections: () => meAPI.myCollected("resource_collections"),
  resources: () => meAPI.myCollected("resources"),
  journalIssues: () => meAPI.myCollected("journal_issues")
};

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return loadParallelLists({ context, fetchFns });
};

export const clientLoader = async ({ request, serverLoader }) => {
  const server = await serverLoader();
  return loadAllPagesParallel({
    signal: request.signal,
    fetchFns,
    initials: server
  });
};

clientLoader.hydrate = true;

export default function MyStarredRoute({ loaderData }) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();

  const collection = getEntityCollection(currentUser);

  const responses = {
    projects: loaderData.projects.data,
    texts: loaderData.texts.data,
    textSections: loaderData.textSections.data,
    resourceCollections: loaderData.resourceCollections.data,
    resources: loaderData.resources.data,
    journalIssues: loaderData.journalIssues.data
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
