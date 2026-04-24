import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation
} from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI, collectingAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "api";
import handleActionError from "lib/react-router/helpers/handleActionError";
import unauthorizedError from "lib/react-router/helpers/unauthorizedError";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import loadAllPagesParallel from "lib/react-router/loaders/loadAllPagesParallel";
import { useAuthorizeRoute } from "hooks";
import ActionBox from "components/frontend/reading-group/ActionBox";
import { CollectionEditor } from "components/frontend/collecting/reading-group";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import SearchDialog from "components/frontend/collecting/SearchDialog";
import * as Styled from "./styles";

export async function action({ request, context, params }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) return unauthorizedError();

  const requestData = await request.json();
  const { intent, ...data } = requestData;

  const mutate = async apiCall => {
    const result = await queryApi(apiCall, context);
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  };

  try {
    switch (intent) {
      case "create-category":
        return mutate(readingGroupsAPI.createCategory(params.id, data));

      case "update-category": {
        const { categoryId, ...updateData } = data;
        return mutate(
          readingGroupsAPI.updateCategory(params.id, categoryId, updateData)
        );
      }

      case "update-category-position": {
        const { categoryId, position } = data;
        return mutate(
          readingGroupsAPI.updateCategory(params.id, categoryId, {
            attributes: { position }
          })
        );
      }

      case "delete-category":
        return mutate(
          readingGroupsAPI.destroyCategory(params.id, data.categoryId)
        );

      case "update-collectables":
        return mutate(
          collectingAPI.collect(data.collectables, data.collection)
        );

      case "remove-collectable":
        return mutate(collectingAPI.remove(data.collectables, data.collection));

      default:
        return { errors: [{ detail: "Unknown intent" }] };
    }
  } catch (error) {
    return handleActionError(error, "Category operation failed");
  }
}

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

export default function ReadingGroupHomepageEdit({ loaderData }) {
  const { responses, categories } = loaderData;
  const readingGroup = useOutletContext();
  useAuthorizeRoute({ entity: readingGroup, ability: "update" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { id } = useParams();
  const location = useLocation();

  const editRoute = `/groups/${id}/edit`;

  const { name: groupName } = readingGroup.attributes ?? {};
  const showSearchDialog = location.hash === "#search";

  const handleCloseSearch = () => {
    revalidate();
    const { pathname, search = "" } = location;
    const url = `${pathname}${search}`;
    navigate(url);
  };

  return (
    <Styled.EditContainer>
      <Styled.Heading>
        {t("pages.reading_group.homepage_edit_header")}
      </Styled.Heading>
      <Styled.Instructions>
        {t("pages.reading_group.homepage_edit_instructions")}
      </Styled.Instructions>
      <Styled.Actions>
        <ActionBox
          title={t("pages.reading_group.search_title")}
          instructions={t("pages.reading_group.search_instructions")}
          actions={
            <Styled.SearchButton href="#search" className="button-tertiary">
              {t("pages.reading_group.search_button_label")}
            </Styled.SearchButton>
          }
        />
      </Styled.Actions>
      <Styled.Body>
        <CollectionEditor
          readingGroup={readingGroup}
          categories={categories}
          responses={responses}
        />
      </Styled.Body>
      <OutletWithDrawers
        context={readingGroup}
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl: editRoute
        }}
      />
      {showSearchDialog && (
        <SearchDialog heading={groupName} onClose={handleCloseSearch} />
      )}
    </Styled.EditContainer>
  );
}
