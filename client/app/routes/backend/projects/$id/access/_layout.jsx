import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router";
import { permissionsAPI, entitlementsAPI, projectsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitlementsContainer from "backend/containers/entitlements";
import EntitiesList, {
  Button,
  PermissionRow
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import Layout from "backend/components/layout";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import HeroBlock from "backend/components/hero/Builder/Block";
import { useAuthentication, useSettings, useApiCallback } from "hooks";

const authorization = new Authorization();

export const loader = async ({ request, context, params }) => {
  const entity = { type: "projects", id: params.id };

  const [permissions, entitlements] = await Promise.all([
    queryApi(permissionsAPI.index(entity), context),
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

export async function action({ request, context, params }) {
  const data = await request.json();
  const entity = { type: "projects", id: params.id };

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

export default function ProjectAccessLayout({ loaderData }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const { permissionId } = useParams();
  const authentication = useAuthentication();
  const settings = useSettings();

  const { permissions, entitlements } = loaderData;
  const closeUrl = `/backend/projects/${project.id}/access`;

  const updateProject = useApiCallback(projectsAPI.update);

  const defaultIsRestricted =
    settings?.attributes?.general?.restrictedAccess === true;
  const defaultIsOpen = !defaultIsRestricted;

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
        <div style={{ marginBottom: 44, marginTop: 22 }}>
          <HeroBlock
            title={t("projects.forms.access.title")}
            description={t("projects.forms.access.description")}
            initialVisible={defaultIsRestricted}
          >
            <FormContainer.Form
              style={{ paddingTop: 24, paddingBottom: 24 }}
              model={project}
              name="backend-project-update"
              update={updateProject}
              className="form-secondary"
            >
              {defaultIsOpen && (
                <Form.Switch
                  label={t("projects.forms.access.restricted_label")}
                  name="attributes[restrictedAccess]"
                  wide
                />
              )}
              {defaultIsRestricted && (
                <Form.Switch
                  label={t("projects.forms.access.open_access_label")}
                  name="attributes[openAccess]"
                  wide
                />
              )}
              <Form.TextInput
                label={t("projects.forms.access.notice_header_label")}
                name="attributes[restrictedAccessHeading]"
                placeholder={t(
                  "projects.forms.access.notice_header_placeholder"
                )}
                wide
              />
              <Form.TextArea
                label={t("projects.forms.access.notice_body_label")}
                name="attributes[restrictedAccessBody]"
                placeholder={t("projects.forms.access.notice_body_placeholder")}
              />
              <Form.Save text={t("projects.forms.access.save")} />
            </FormContainer.Form>
          </HeroBlock>
        </div>
        <EntitlementsContainer.List
          entity={project}
          entities={entitlements.data}
          meta={entitlements.meta}
        />
      </Layout.BackendPanel>
      <OutletWithDrawer
        drawerProps={{ closeUrl, lockScroll: "always" }}
        context={{ entity: project, closeUrl }}
      />
    </>
  );
}
