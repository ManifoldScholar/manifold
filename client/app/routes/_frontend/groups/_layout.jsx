import { Outlet, redirect } from "react-router";
import { routerContext } from "app/contexts";

export const loader = async ({ context }) => {
  const { settings } = context.get(routerContext) ?? {};

  if (settings?.attributes?.general?.disablePublicReadingGroups) {
    throw redirect("/my/groups");
  }

  return null;
};

export default function PublicReadingGroupsLayout() {
  return <Outlet />;
}
