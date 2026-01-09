import { useLocation, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { redirect } from "react-router";
import { readingGroupsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import authorize from "app/routes/utility/loaders/authorize";
import { hasItemsInCollection } from "frontend/components/collecting/helpers";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { GroupHeading } from "frontend/components/reading-group/headings";

export const loader = async ({ params, context, request }) => {
  const fetchFn = () => readingGroupsAPI.show(params.id);
  const readingGroup = await loadEntity({ context, fetchFn });

  await authorize({
    context,
    ability: "read",
    entity: readingGroup,
    failureRedirect: "/groups",
    currentPath: new URL(request.url).pathname
  });

  /*
  Some RGs may choose to only use annotation features and not do any collecting.
  In such cases we'll just redirect to the annotations page (except for moderators,
  who have collecting privileges) rather than show the empty homepage.
  */
  const url = new URL(request.url);
  const isIndexRoute =
    url.pathname === `/groups/${params.id}` ||
    url.pathname === `/groups/${params.id}/`;
  if (isIndexRoute) {
    const canUpdateGroup = readingGroup?.attributes?.abilities?.update;
    const showHomepage = canUpdateGroup || hasItemsInCollection(readingGroup);

    if (!showHomepage) {
      throw redirect(`/groups/${params.id}/annotations`);
    }
  }

  return readingGroup;
};

export default function ReadingGroupDetail({ loaderData: readingGroup }) {
  const location = useLocation();
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

  return (
    <>
      <HeadContent title={groupName} appendDefaultTitle />
      <section>
        <div className="container">
          <RegisterBreadcrumbs {...breadcrumbProps} />
          <GroupHeading readingGroup={readingGroup} location={location} />
          <Outlet context={readingGroup} />
        </div>
      </section>
    </>
  );
}
