import { useLocation, useNavigate, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { readingGroupContext } from "app/contexts";
import authorize from "app/routes/utility/loaders/authorize";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { GroupHeading } from "frontend/components/reading-group/headings";
import SearchDialog from "frontend/components/collecting/SearchDialog";

export const loader = async ({ params, context, request }) => {
  const fetchFn = () => readingGroupsAPI.show(params.id);
  const readingGroup = await loadEntity({ context, fetchFn });

  context.set(readingGroupContext, readingGroup);

  await authorize({
    context,
    ability: "read",
    entity: readingGroup,
    failureRedirect: "/groups",
    currentPath: new URL(request.url).pathname
  });

  return readingGroup;
};

export default function ReadingGroupDetail({ loaderData: readingGroup }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { t } = useTranslation();

  const breadcrumbProps =
    readingGroup?.attributes?.currentUserRole === "none"
      ? {
          breadcrumbs: [
            {
              to: "/groups",
              label: t("pages.public_groups")
            }
          ]
        }
      : {
          breadcrumbs: [
            {
              to: "/my/groups",
              label: t("pages.my_groups")
            }
          ]
        };

  const { name: groupName } = readingGroup.attributes ?? {};
  const showSearchDialog = location.hash === "#search";

  const closeDrawer = () => {
    const { pathname, search = "" } = location;
    const url = `${pathname}${search}`;
    navigate(url);
  };

  const handleCloseSearch = () => {
    revalidate();
    closeDrawer();
  };

  return (
    <>
      <HeadContent title={groupName} appendDefaultTitle />
      <section>
        <div className="container">
          <RegisterBreadcrumbs {...breadcrumbProps} />
          <GroupHeading readingGroup={readingGroup} location={location} />
          <Outlet
            context={{
              readingGroup,
              refresh: revalidate,
              closeDrawer
            }}
          />
          {showSearchDialog && (
            <SearchDialog heading={groupName} onClose={handleCloseSearch} />
          )}
        </div>
      </section>
    </>
  );
}
