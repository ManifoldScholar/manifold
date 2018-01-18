import React from "react";
import { Switch, Route } from "react-router-dom";
import DrawerSwitch from "./DrawerSwitch";
import Passthrough from "./Passthrough";

const renderChildRoutes = (route, renderOptions) => {
  const defaultOptions = {
    switch: true,
    childProps: {},
    drawer: false,
    drawerProps: {},
    dialog: false,
    dialogProps: {},
    factory: null
  };
  const routeOptions = route.options || {};
  const options = Object.assign(
    {},
    defaultOptions,
    routeOptions,
    renderOptions
  );
  const childRoutes = route.routes;

  const defaultRender = childRoute => props =>
    <childRoute.component
      {...props}
      {...options.childProps}
      route={childRoute}
    />;

  const factoryRender = childRoute => props =>
    options.factory(defaultRender(childRoute)(props));

  const render = options.factory ? factoryRender : defaultRender;

  let mapped = null;
  /* eslint-disable react/no-array-index-key */
  // We can use the array index as the key here, because the order of the routes will
  // never change after the initial mount.
  if (childRoutes) {
    mapped = childRoutes.map((childRoute, i) => {
      const { component, ...props } = childRoute;
      return <Route key={i} {...props} render={render(childRoute)} />;
    });
  }
  /* eslint-enable react/no-array-index-key */

  // By default, wrap child routes in a switch
  let Wrapper = Switch;
  let wrapperProps = {};

  // If switch is disabled, we render all matching child routes.
  if (!options.switch) Wrapper = Passthrough;

  // If a drawer is requested, we wrap the children in a drawer version of the switch.
  if (options.drawer) {
    Wrapper = DrawerSwitch;
    wrapperProps = Object.assign({}, wrapperProps, options.drawerProps);
  }

  return (
    <Wrapper {...wrapperProps}>
      {mapped}
    </Wrapper>
  );
};

export default renderChildRoutes;
