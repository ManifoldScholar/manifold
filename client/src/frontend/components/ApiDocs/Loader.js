import React from "react";
import Loadable from "react-loadable";

const SwaggerUI = Loadable({
  loader: () => {
    if (__SERVER__) return Promise.resolve(() => null);
    return import(/* webpackChunkName: "swagger-ui" */ "./SwaggerUi").then(
      swagger => {
        return swagger.default;
      }
    );
  },
  render(SwaggerUIComponent, props) {
    return <SwaggerUIComponent {...props} />;
  },
  loading: () => {
    return null;
  }
});

export default SwaggerUI;
