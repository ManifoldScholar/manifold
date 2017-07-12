import React from "react";
import { Switch, Route } from "react-router-dom";

// Factory is a function that takes the component as an argument and returns some
// other component. It's useful for wrapping a component with another component.
export const renderRoutes = (routes, injectProps = {}, factory = null) => {
  if (!routes) return null;

  const render = (route, additionalProps) => {
    return props => {
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
  return (
    <Switch>
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
    </Switch>
  );
  /* eslint-enable react/no-array-index-key */
};
