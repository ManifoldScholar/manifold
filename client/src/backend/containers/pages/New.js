import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { pagesAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PageHeader from "backend/components/layout/PageHeader";
import Layout from "backend/components/layout";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";

const DEFAULT_PAGE = {
  attributes: { isExternalLink: false, kind: "default" }
};

export default function PagesNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = page => {
    const path = lh.link("backendRecordsPage", page.id);
    navigate(path);
  };

  return (
    <Authorize
      failureNotification={{
        body: t("records.pages.unauthorized_create")
      }}
      failureRedirect
      entity="page"
      ability="create"
    >
      <PageHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={t("records.pages.back_label")}
        title={t("records.pages.new_header")}
        note={t("records.pages.new_instructions")}
        icon="ResourceDocument64"
      />
      <Layout.BackendPanel>
        <section>
          <FormContainer.Form
            onSuccess={handleSuccess}
            model={DEFAULT_PAGE}
            name="backend-page-create"
            update={pagesAPI.update}
            create={pagesAPI.create}
            className="form-secondary"
          >
            {getModelValue => {
              const isExternal = getModelValue("attributes[isExternalLink]");

              return (
                <>
                  <Form.TextInput
                    focusOnMount
                    label={t("records.pages.title_label")}
                    name="attributes[title]"
                    placeholder={t("records.pages.title_placeholder")}
                  />
                  <Form.Switch
                    label={t("records.pages.switch_label")}
                    name="attributes[isExternalLink]"
                  />
                  {isExternal ? (
                    <Form.TextInput
                      validation={["required"]}
                      label={t("records.pages.external_label")}
                      name="attributes[externalLink]"
                      placeholder={t("records.pages.external_placeholder")}
                      instructions={t("records.pages.external_instructions")}
                    />
                  ) : (
                    <Form.TextInput
                      validation={["required"]}
                      label={t("records.pages.slug_label")}
                      name="attributes[slug]"
                      placeholder={t("records.pages.slug_placeholder")}
                      instructions={t("records.pages.slug_instructions")}
                    />
                  )}
                  <Form.Save text={t("records.pages.submit_label")} />
                </>
              );
            }}
          </FormContainer.Form>
        </section>
      </Layout.BackendPanel>
    </Authorize>
  );
}

PagesNew.displayName = "Pages.New";
