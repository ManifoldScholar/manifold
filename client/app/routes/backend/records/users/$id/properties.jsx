import { useOutletContext, useFetcher } from "react-router";
import { usersAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Properties from "backend/components/user/Properties";

export const action = formAction({
  mutation: ({ data, params }) => usersAPI.update(params.id, data)
});

export default function UserPropertiesRoute() {
  const { user } = useOutletContext();
  const fetcher = useFetcher();

  return <Properties user={user} fetcher={fetcher} />;
}
