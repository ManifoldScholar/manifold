import { Outlet, useMatches } from "react-router-dom";
import Drawer from "global/containers/drawer";

export default function OutletWithDrawer({
  drawerProps,
  context,
  ...outletProps
}) {
  const matches = useMatches();

  // In v6, matches array includes all matched routes from root to leaf
  // The last match is the deepest route, previous matches are parents
  const currentMatch = matches[matches.length - 1];
  const parentMatch = matches[matches.length - 2];

  // Drawer should be open if we have a child route match beyond the parent
  // This works because v6 matches are inclusive (parent + child both match)
  const hasChildMatch =
    matches.length > 1 && currentMatch.pathname !== parentMatch?.pathname;

  // Alternative: Check if current route has drawer: true in handle
  // This is more explicit and reliable if you mark drawer routes
  // const isDrawerRoute = currentMatch?.handle?.drawer === true;
  // const hasChildMatch = isDrawerRoute && matches.length > 1;

  if (!drawerProps) {
    return <Outlet context={context} {...outletProps} />;
  }

  // Note: v6 doesn't modify location.state the same way as v5
  // The noScroll state handling may need to be done differently
  // Consider using context or a different state management approach

  return (
    <Drawer.Wrapper open={hasChildMatch} {...drawerProps}>
      <Outlet context={context} {...outletProps} />
    </Drawer.Wrapper>
  );
}
