import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";
import PermissionsContainer from "backend/containers/permission";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
import Authorization from "helpers/authorization";
import Layout from "backend/components/layout";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import Hero from "backend/components/hero";
import { useFromStore } from "hooks";

const authorization = new Authorization();

export default function ProjectAccessWrapper() {
  const { t } = useTranslation();
  const { project, updateProject } = useOutletContext() || {};
  const authentication = useFromStore({ path: "authentication" });
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });

  if (!project) return null;

  const defaultIsRestricted =
    settings?.attributes?.general?.restrictedAccess === true;
  const defaultIsOpen = !defaultIsRestricted;

  const canGrantPermissions =
    authentication &&
    authorization.authorizeAbility({
      authentication,
      entity: project,
      ability: "managePermissions"
    });

  const closeUrl = lh.link("backendProjectAccess", project.id);

  return (
    <>
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        {canGrantPermissions && (
          <Layout.BackendPanel flush>
            <PermissionsContainer.List entity={project} />
          </Layout.BackendPanel>
        )}
        <Layout.BackendPanel flush={!canGrantPermissions}>
          <EntitlementsContainer.List
            entity={project}
            preList={
              <div style={{ marginBottom: 44, marginTop: 22 }}>
                <Hero.Block
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
                      placeholder={t(
                        "projects.forms.access.notice_body_placeholder"
                      )}
                    />
                    <Form.Save text={t("projects.forms.access.save")} />
                  </FormContainer.Form>
                </Hero.Block>
              </div>
            }
          />
        </Layout.BackendPanel>
      </Authorize>
      <OutletWithDrawer
        drawerProps={{
          closeUrl,
          lockScroll: "always"
        }}
        context={{
          entity: project,
          closeUrl
        }}
      />
    </>
  );
}

ProjectAccessWrapper.displayName = "Project.Access.Wrapper";
