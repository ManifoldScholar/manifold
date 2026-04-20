import { useOutletContext } from "react-router";
import { permissionsAPI, entitlementsAPI } from "api";
import { queryApi } from "api";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import EntitlementsList from "components/backend/entitlements/List";
import Authorization from "helpers/authorization";
import Layout from "components/backend/layout";
import { useAuthentication } from "hooks";
import Permissions from "components/backend/journal/Permissions";

const authorization = new Authorization();

export const loader = async ({ request, context, params }) => {
  const entity = { type: "journals", id: params.id };

  const [permissions, entitlements] = await Promise.all([
    loadList({
      request,
      context,
      fetchFn: () => permissionsAPI.index(entity),
      options: { skipPagination: true, skipFilters: true }
    }),
    loadList({
      request,
      context,
      fetchFn: (filters, pagination) =>
        entitlementsAPI.index(entity, filters, pagination),
      options: {
        defaultPagination: { page: 1, perPage: 20 }
      }
    })
  ]);

  return {
    permissions: permissions.data ?? [],
    entitlements
  };
};

export async function action({ request, context, params }) {
  const data = await request.json();
  const entity = { type: "journals", id: params.id };

  try {
    if (data.intent === "createPermission") {
      const result = await queryApi(
        permissionsAPI.create(entity, data.permission),
        context
      );
      if (result?.errors) return { errors: result.errors };
      return { success: true };
    }

    if (data.intent === "deletePermission") {
      await queryApi(
        permissionsAPI.destroy(entity, data.permissionId),
        context
      );
      return { success: true };
    }

    return { errors: [{ detail: "Unknown intent" }] };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function JournalAccessLayout({ loaderData }) {
  const journal = useOutletContext();
  const authentication = useAuthentication();

  const { permissions, entitlements } = loaderData;
  const closeUrl = `/backend/journals/${journal.id}/access`;

  const canGrantPermissions = authorization.authorizeAbility({
    authentication,
    entity: journal,
    ability: "managePermissions"
  });

  return (
    <>
      {canGrantPermissions && <Permissions permissions={permissions} />}
      <Layout.BackendPanel flush={!canGrantPermissions}>
        <EntitlementsList
          entity={journal}
          entities={entitlements.data}
          meta={entitlements.meta}
        />
      </Layout.BackendPanel>
      <OutletWithDrawers drawerProps={{ closeUrl, lockScroll: "always" }} />
    </>
  );
}
