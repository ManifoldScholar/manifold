import { data } from "react-router";
import Authorization from "helpers/authorization";
import { useAuthentication } from "hooks";

const authorization = new Authorization();

export default function useAuthorizeRoute({
  entity,
  ability,
  message = "errors.access_denied.authorization_admin"
}) {
  const authentication = useAuthentication();

  if (!authorization.authorize({ authentication, entity, ability })) {
    throw data({ message }, { status: 403 });
  }
}
