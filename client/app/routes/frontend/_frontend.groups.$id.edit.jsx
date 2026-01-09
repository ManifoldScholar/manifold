import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation
} from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import authorize from "app/routes/utility/loaders/authorize";
import loadParallelLists from "app/routes/utility/loaders/loadParallelLists";
import ActionBox from "frontend/components/reading-group/ActionBox";
import { CollectionEditor } from "frontend/components/collecting/reading-group";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import SearchDialog from "frontend/components/collecting/SearchDialog";
import * as Styled from "frontend/containers/ReadingGroup/Homepage/styles";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

export const loader = async ({ params, request, context }) => {
  const fetchFn = () => readingGroupsAPI.show(params.id);
  const readingGroup = await loadEntity({ context, fetchFn });

  await authorize({
    context,
    ability: "update",
    entity: readingGroup,
    failureRedirect: `/groups/${params.id}`,
    currentPath: new URL(request.url).pathname
  });

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

export default function ReadingGroupHomepageEdit({ loaderData }) {
  const { responses, categories } = loaderData;
  const readingGroup = useOutletContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { id } = useParams();
  const location = useLocation();

  const editRoute = `/groups/${id}/edit`;
  const closeDrawer = () => navigate(editRoute);

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
          refresh={revalidate}
        />
      </Styled.Body>
      <OutletWithDrawer
        context={{
          readingGroup,
          closeDrawer
        }}
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
