import { useOutletContext, useFetcher } from "react-router";
import { usersAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Properties from "backend/components/user/Properties";

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(usersAPI.update(params.id, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function UserPropertiesRoute() {
  const { user } = useOutletContext();
  const fetcher = useFetcher();

  return <Properties user={user} fetcher={fetcher} />;
}
