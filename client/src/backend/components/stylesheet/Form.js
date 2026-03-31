import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { sectionsAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Collapse from "global/components/Collapse";
import SectionFields from "./SectionFields";

export default function StylesheetForm({
  stylesheet,
  textId,
  fetcher,
  cancelUrl
}) {
  const { t } = useTranslation();
  const fetchTextSections = useCallback(() => sectionsAPI.forText(textId), [
    textId
  ]);

  return (
    <section>
      <FormContainer.Form
        model={stylesheet}
        fetcher={fetcher}
        className="form-secondary"
      >
        {getModelValue => (
          <>
            {stylesheet.attributes.ingested ? (
              <Form.Instructions
                instructions={t("texts.stylesheets.edit.instructions")}
              />
            ) : null}
            <Form.TextInput
              label={t("texts.stylesheets.edit.name_label")}
              name="attributes[name]"
              placeholder={t("texts.stylesheets.edit.name_label")}
              wide
            />
            <Form.CodeArea
              label={t("texts.stylesheets.edit.source_styles_label")}
              height="300px"
              mode="css"
              name="attributes[rawStyles]"
              instructions={t(
                "texts.stylesheets.edit.source_styles_instructions"
              )}
            />
            <Form.CodeArea
              label={t("texts.stylesheets.edit.validated_styles_label")}
              name="attributes[styles]"
              mode="css"
              instructions={t(
                "texts.stylesheets.edit.validated_styles_instructions"
              )}
              readOnly
            />
            <Collapse
              initialVisible={
                !getModelValue("attributes[appliesToAllTextSections]")
              }
            >
              <SectionFields
                options={fetchTextSections}
                visible={!getModelValue("attributes[appliesToAllTextSections]")}
              />
            </Collapse>
            <Form.Save
              cancelRoute={cancelUrl}
              text={t("texts.stylesheets.edit.save")}
            />
          </>
        )}
      </FormContainer.Form>
    </section>
  );
}
