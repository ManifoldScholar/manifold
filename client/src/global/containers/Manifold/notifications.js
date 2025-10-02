const loginNotification = {
  id: "authenticationError",
  level: 2,
  heading: "errors.access_denied",
  body: "errors.access_denied.authentication",
  scope: "authentication"
};

const unauthorizedNotification = {
  id: "authorizationError",
  level: 2,
  heading: "Access Denied",
  body:
    "The page you were trying to view is restricted to users who have been granted access."
};

export default {
  loginNotification,
  unauthorizedNotification
};
