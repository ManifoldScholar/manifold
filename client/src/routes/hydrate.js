import isString from "lodash/isString";
import isArray from "lodash/isArray";

export default function hydrate(route, registry) {
  const properties = {};
  if (isString(route.component)) {
    properties.component = registry[route.component];
  }
  if (isArray(route.routes)) {
    properties.routes = [];
    route.routes.forEach(childRoute => {
      properties.routes.push(hydrate(childRoute, registry));
    });
  }
  return { ...route, ...properties };
}
