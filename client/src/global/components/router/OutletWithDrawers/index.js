import { Outlet, useMatches } from "react-router";
import Drawer from "global/components/drawer";

/**
 * This component handles variations of child routes in drawers.
 * The base drawer case — all child routes are drawers with the same drawer props —
 * could be rendered directly in the route module with no conditionals:
 *    <Drawer>
 *      <Outlet />
 *    </Drawer>
 *
 * But we have 3 other configurations:
 *  1. A single layout with both drawer and non-drawer child routes, e.g.
 *     backend projects/projects/project-collections
 *  2. A layout with drawers different focus trap props, e.g. backend
 *     project/texts/ingestions. focus-trap-react does not accept new
 *     focusTrapOptions after initialization, so prop updates are ignored.
 *  3. A layout with drawers with different enter/exit animations. This is
 *     specific to the backend projects/text/:id/sections route for the
 *     editor drawer. All drawer styles need to be rendered off screen
 *     in the layout in order to preserve the animation through route change.
 *     Conditionally rendering the drawer after route change breaks the
 *     animation.
 */

export default function OutletWithDrawers({
  drawerProps,
  drawerCondition = true,
  context,
  ...outletProps
}) {
  const matches = useMatches();

  // In framework mode, matches array includes all matched routes from root to leaf
  // The last match is the deepest route, previous matches are parents
  // Check if the current (deepest) route has drawer in its handle
  const currentMatch = matches[matches.length - 1];
  const currentDrawer = currentMatch?.handle?.drawer;

  const drawers = Array.isArray(drawerProps)
    ? drawerProps
    : [{ context: "backend", ...drawerProps }];

  return (
    <>
      {!drawerCondition && <Outlet context={context} {...outletProps} />}
      {drawers.map(drawer => {
        const match =
          typeof currentDrawer === "string"
            ? drawer.context === currentDrawer
            : !!currentDrawer;
        const open = drawerCondition && match;
        /* eslint-disable no-nested-ternary */
        const renderOutlet = drawerCondition
          ? currentDrawer
            ? open
            : drawer.context === "backend"
          : false;
        return (
          <Drawer.Wrapper open={open} {...drawer}>
            {renderOutlet && <Outlet context={context} {...outletProps} />}
          </Drawer.Wrapper>
        );
      })}
    </>
  );
}
