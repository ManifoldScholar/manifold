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
  // Check if the current (deepest) route has drawer: true in its handle
  const currentMatch = matches[matches.length - 1];
  const isDrawerRoute = currentMatch?.handle?.drawer === true;

  if (!drawerProps) {
    return <Outlet context={context} {...outletProps} />;
  }

  return (
    <Drawer.Wrapper open={isDrawerRoute} {...drawerProps}>
      <Outlet context={context} {...outletProps} />
    </Drawer.Wrapper>
  );
}
