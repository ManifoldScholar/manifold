import React from "react";
import { Switch, Route } from "react-router-dom";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

// Factory is a function that takes the component as an argument and returns some
// other component. It's useful for wrapping a component with another component.
export const renderRoutes = (
  routes,
  injectProps = {},
  factory = null,
  useSwitch = true
) => {
  if (!routes) return null;

  const render = (route, additionalProps) => {
    return props => {
      const location = { props };
      if (route.withTransition) {
        return (
          <ReactCSSTransitionGroup
            transitionName={route.withTransition}
            transitionAppear
            transitionAppearTimeout={500}
            transitionLeaveTimeout={500}
            transitionEnterTimeout={250}
          >
            <route.component
              {...props}
              {...additionalProps}
              location={location}
              key={location.key}
              route={route}
            />
          </ReactCSSTransitionGroup>
        );
      }
      return <route.component {...props} {...additionalProps} route={route} />;
    };
  };

  const renderWithFactory = (route, additionalProps, factoryMethod) => {
    return props => {
      const component = (
        <route.component {...props} {...additionalProps} route={route} />
      );
      return factoryMethod(component);
    };
  };

  /* eslint-disable react/no-array-index-key */
  // We can use the array index as the key here, because the order of the routes will
  // never change after the initial mount.
  const MaybeSwitch = useSwitch ? Switch : "span";
  return (
    <MaybeSwitch>
      {routes.map((route, i) => {
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={
              factory
                ? renderWithFactory(route, injectProps, factory)
                : render(route, injectProps)
            }
          />
        );
      })}
    </MaybeSwitch>
  );
  /* eslint-enable react/no-array-index-key */
};
