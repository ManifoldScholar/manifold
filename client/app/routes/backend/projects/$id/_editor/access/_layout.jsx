import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router";
import { permissionsAPI, entitlementsAPI, projectsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import EntitlementsList from "components/backend/entitlements/List";
import EntitiesList, {
  Button,
  PermissionRow
} from "components/backend/list/EntitiesList";
import Authorization from "helpers/authorization";
import Layout from "components/backend/layout";
import AccessForm from "components/backend/project/access/AccessForm";
import { useAuthentication } from "hooks";

const authorization = new Authorization();

export const loader = async ({ request, context, params }) => {
  const entity = { type: "projects", id: params.id };

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
      options: { defaultPagination: { page: 1, perPage: 20 } }
    })
  ]);

  return { permissions: permissions.data ?? [], entitlements };
};

export const action = formAction({
  mutation: ({ data, params }) => projectsAPI.update(params.id, data)
});

export default function ProjectAccessLayout({ loaderData }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const { permissionId } = useParams();
  const authentication = useAuthentication();

  const { permissions, entitlements } = loaderData;
  const closeUrl = `/backend/projects/${project.id}/access`;

  const canGrantPermissions = authorization.authorizeAbility({
    authentication,
    entity: project,
    ability: "managePermissions"
  });

  const getPermissionPath = (_resourceId, permId) =>
    `/backend/projects/${project.id}/access/permissions/${permId}`;

  return (
    <>
      {canGrantPermissions && (
        <Layout.BackendPanel flush>
          <section>
            <EntitiesList
              title={t("projects.permissions.header")}
              instructions={t("projects.permissions.instructions")}
              titleStyle="section"
              entities={permissions}
              entityComponent={PermissionRow}
              entityComponentProps={{
                active: permissionId,
                getPermissionPath
              }}
              buttons={[
                <Button
                  path={`/backend/projects/${project.id}/access/permissions/new`}
                  text={t("projects.permissions.button_label")}
                  type="add"
                  authorizedTo="createPermissions"
                  authorizedFor={project}
                />
              ]}
            />
          </section>
        </Layout.BackendPanel>
      )}
      <Layout.BackendPanel flush={!canGrantPermissions}>
        <AccessForm project={project} />
        <EntitlementsList
          entity={project}
          entities={entitlements.data}
          meta={entitlements.meta}
        />
      </Layout.BackendPanel>
      <OutletWithDrawers
        drawerProps={{ closeUrl, lockScroll: "always" }}
        context={permissions}
      />
    </>
  );
}
