import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { stylesheetsAPI, requests, sectionsAPI } from "api";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import FormContainer from "global/containers/form";
import Collapse from "global/components/Collapse";
import SectionFields from "./SectionFields";
import { useFetch } from "hooks";

const DEFAULT_STYLESHEET = {
  attributes: {},
  relationships: { textSections: [] }
};

export default function StylesheetEditContainer() {
  const { t } = useTranslation();
  const { id, stylesheet: stylesheetId } = useParams();
  const navigate = useNavigate();
  const { text } = useOutletContext() || {};

  const isNew = !stylesheetId;
  const isEdit = !isNew;

  const { data: fetchedStylesheet } = useFetch({
    request: [stylesheetsAPI.show, stylesheetId],
    options: { requestKey: requests.beStylesheetShow },
    condition: !!stylesheetId
  });

  const stylesheet = isNew ? DEFAULT_STYLESHEET : fetchedStylesheet;

  const redirectToStylesheet = newStylesheet => {
    const path = lh.link(
      "BackendTextStylesheetEdit",
      text?.id,
      newStylesheet.id
    );
    navigate(path);
  };

  const create = attributes => {
    return stylesheetsAPI.create(id, attributes);
  };

  const fetchTextSections = () => {
    return sectionsAPI.forText(text?.id);
  };

  if (isEdit && !stylesheet) return null;

  const name = isNew
    ? requests.beStylesheetCreate
    : requests.beStylesheetUpdate;

  return (
    <section>
      <FormContainer.Form
        model={stylesheet}
        name={name}
        update={stylesheetsAPI.update}
        create={create}
        onSuccess={redirectToStylesheet}
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
              cancelRoute={lh.link("backendTextStyles", id)}
              text={t("texts.stylesheets.edit.save")}
            />
          </>
        )}
      </FormContainer.Form>
    </section>
  );
}

StylesheetEditContainer.displayName = "Stylesheet.Edit";
