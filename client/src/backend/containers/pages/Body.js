import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { pagesAPI } from "api";

export default function PagesBody() {
  const { t } = useTranslation();
  const outletContext = useOutletContext() || {};
  const { page, onSuccess } = outletContext;

  if (!page) return null;

  return (
    <section>
      <FormContainer.Form
        model={page}
        onSuccess={onSuccess}
        name="backend-page-update"
        update={pagesAPI.update}
        create={pagesAPI.create}
        className="form-secondary"
      >
        <Form.TextArea
          label={t("records.pages.body_label")}
          height={300}
          name="attributes[body]"
          placeholder={t("records.pages.body_placeholder")}
          instructions={t("records.pages.body_instructions")}
        />
        <Form.Save text={t("records.pages.submit_label")} />
      </FormContainer.Form>
    </section>
  );
}

PagesBody.displayName = "Pages.Body";
