import { useOutletContext, useFetcher } from "react-router";
import { usersAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Properties from "components/backend/user/Properties";

export const action = formAction({
  mutation: ({ data, params }) => usersAPI.update(params.id, data)
});

export default function UserPropertiesRoute() {
  const { user } = useOutletContext();
  const fetcher = useFetcher();

  return <Properties user={user} fetcher={fetcher} />;
}
