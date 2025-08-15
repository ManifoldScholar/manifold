import { useId } from "react";
import { useTranslation } from "react-i18next";
import { resourcesAPI } from "api";
import setter from "global/components/form/setter";
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

  const Kinds = setter(({ set }) => (
    <Styled.Kinds
      label="kinds"
      aria-describedby={`${id}_kind-picker`}
      role="group"
    >
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
              onChange={() => set(safeKind)}
            />
            <IconComputed.Resource size={32} icon={safeKind} />
            <Styled.KindLabel>{translatedKind}</Styled.KindLabel>
          </Styled.Kind>
        );
      })}
    </Styled.Kinds>
  ));

  return (
    <Styled.Form
      className="form-secondary"
      name="reader-resource-create"
      model={{ attributes: {} }}
      create={data => resourcesAPI.create(projectId, data)}
      onSuccess={resource => onSuccess(resource)}
    >
      {getModelValue => {
        const kind = getModelValue("attributes[kind]");
        const isExternalVideo = !!getModelValue("attributes[subKind]");

        return (
          <>
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
              <Kinds name="attributes[kind]" />
            </fieldset>
            {(kind === "link" || kind === "interactive") && (
              <Form.TextInput
                label={t("resources.properties.url")}
                name="attributes[externalUrl]"
                placeholder={t("resources.properties.url_placeholder")}
              />
            )}
            {kind === "video" && (
              <>
                <Form.Switch
                  label={t("resources.new.video_source")}
                  name="attributes[subKind]"
                  customValues={{
                    true: "external_video",
                    false: ""
                  }}
                  wide
                  isPrimary
                />
                {isExternalVideo && (
                  <Styled.FieldGroup>
                    <Form.TextInput
                      label={t("resources.new.video_id")}
                      name="attributes[externalId]"
                      placeholder={t("resources.new.video_id_placeholder")}
                      instructions={t("resources.new.video_id_instructions")}
                    />
                    <Form.Select
                      label={t("resources.new.external_video_type")}
                      name="attributes[externalType]"
                      options={[
                        {
                          label: t("resources.new.select_source"),
                          value: ""
                        },
                        { label: "Youtube", value: "youtube" },
                        { label: "Vimeo", value: "vimeo" }
                      ]}
                    />
                  </Styled.FieldGroup>
                )}
              </>
            )}
            <Styled.FieldGroup>
              {kind !== "link" &&
                kind !== "interactive" &&
                !(kind === "video" && isExternalVideo) && (
                  <Form.Upload
                    label={t("glossary.resource_one")}
                    accepts="any"
                    name="attributes[attachment]"
                    instructionsSingleLine
                  />
                )}
              <Form.Upload
                label={t("resources.properties.featured_image")}
                accepts="images"
                name="attributes[variantThumbnail]"
                instructionsSingleLine
              />
            </Styled.FieldGroup>
            <ButtonGroup handleClose={handleClose} />
          </>
        );
      }}
    </Styled.Form>
  );
}
