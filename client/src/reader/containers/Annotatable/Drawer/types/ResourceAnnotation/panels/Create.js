import { useId } from "react";
import { useTranslation } from "react-i18next";
import { resourcesAPI } from "api";
import Form from "global/components/form";
import IconComputed from "global/components/icon-computed";
import ButtonGroup from "./ButtonGroup";
import * as Styled from "./styles";

const RESOURCE_KINDS = [
  "Image",
  "Video",
  "Audio",
  "File",
  "Link",
  "PDF",
  "Document",
  "Spreadsheet",
  "Presentation",
  "Interactive"
];

export default function CreateResource({ projectId, onSuccess, handleClose }) {
  const { t } = useTranslation();
  const id = useId();

  return (
    <Styled.Form
      className="form-secondary"
      name="reader-resource-create"
      model={{ attributes: {} }}
      create={data => resourcesAPI.create(projectId, data)}
      onSuccess={resource => onSuccess(resource)}
    >
      <Form.TextInput
        label={t("resources.title_label")}
        name="attributes[title]"
        placeholder={t("resources.title_placeholder")}
        wide
      />
      <Form.TextArea
        label={t("resources.descript_label")}
        name="attributes[description]"
        placeholder={t("resources.descript_placeholder")}
        wide
      />
      <fieldset>
        <Form.Label
          as="legend"
          id={`${id}_kind-picker`}
          label={t("resources.new.kind")}
        />
        <Styled.Kinds aria-describedby={`${id}_kind-picker`} role="group">
          {RESOURCE_KINDS.map(kind => {
            const safeKind = kind.toLowerCase();
            const translatedKind = t(`resources.new.${safeKind}`);

            return (
              <Styled.Kind key={safeKind} htmlFor={`${id}-${safeKind}`}>
                <Styled.KindInput
                  type="radio"
                  value={safeKind}
                  id={`${id}-${safeKind}`}
                  name="attributes[kind]"
                />
                <IconComputed.Resource size={32} icon={safeKind} />
                <Styled.KindLabel>{translatedKind}</Styled.KindLabel>
              </Styled.Kind>
            );
          })}
        </Styled.Kinds>
      </fieldset>
      <Styled.UploadGroup>
        <Form.Upload
          label={t("glossary.resource_one")}
          accepts="any"
          name="attributes[attachment]"
          instructionsSingleLine
        />
        <Form.Upload
          label={t("resources.properties.featured_image")}
          accepts="images"
          name="attributes[variantThumbnail]"
          instructionsSingleLine
        />
      </Styled.UploadGroup>
      <ButtonGroup handleClose={handleClose} />
    </Styled.Form>
  );
}
