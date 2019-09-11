import React from "react";
import { Route } from "react-router-dom";
import ChildSwitch from "./ChildSwitch";
import DrawerSwitch from "./DrawerSwitch";
import Passthrough from "./Passthrough";
import { CSSTransition } from "react-transition-group";

const renderChildRoutes = (route, renderOptions) => {
  const defaultOptions = {
    slot: null,
    requireChild: true,
    switch: true,
    childProps: {},
    drawer: false,
    drawerProps: {},
    factory: null
  };
  const routeOptions = route.options || {};
  const options = {
    ...defaultOptions,
    ...routeOptions,
    ...renderOptions
  };
  const childRoutes = route.routes;

  const defaultRender = childRoute => props => {
    const adjustedProps = { ...props };

    if (options.drawer) {
      adjustedProps.location.state = {
        ...props.location.state,
        noScroll: true
      };
    }

    let rendered = (
      <childRoute.component
        {...adjustedProps}
        {...options.childProps}
        route={childRoute}
      />
    );

    if (childRoute.transition) {
      rendered = (
        <CSSTransition
          classNames={childRoute.transition}
          appear
          timeout={{ appear: 500, enter: 250, exit: 500 }}
        >
          {rendered}
        </CSSTransition>
      );
    }
    return rendered;
  };

  const factoryRender = childRoute => props =>
    options.factory(defaultRender(childRoute)(props));

  const render = options.factory ? factoryRender : defaultRender;

  let mapped = null;
  /* eslint-disable react/no-array-index-key */
  // We can use the array index as the key here, because the order of the routes will
  // never change after the initial mount.
  if (childRoutes) {
    const filteredChildRoutes = childRoutes.filter(childRoute => {
      if (!options.slot && !childRoute.slot) return true;
      return options.slot === childRoute.slot;
    });
    mapped = filteredChildRoutes.map((childRoute, i) => {
      const { component, ...props } = childRoute;
      return <Route key={i} {...props} render={render(childRoute)} />;
    });
  }
  /* eslint-enable react/no-array-index-key */

  // By default, wrap child routes in a switch
  let Wrapper = ChildSwitch;
  let wrapperProps = {
    parentRoute: route
  };

  // If switch is disabled, we render all matching child routes.
  if (!options.switch) Wrapper = Passthrough;

  // If a drawer is requested, we wrap the children in a drawer version of the switch.
  if (options.drawer) {
    Wrapper = DrawerSwitch;
    wrapperProps = { ...wrapperProps, ...options.drawerProps };
  }
  return <Wrapper {...wrapperProps}>{mapped}</Wrapper>;
};

export default renderChildRoutes;
