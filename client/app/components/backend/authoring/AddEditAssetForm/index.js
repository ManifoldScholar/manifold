import { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import mergeImageAltText from "lib/react-router/helpers/mergeImageAltText";
import { useTranslation } from "react-i18next";

import * as Styled from "./styles";

export default function AddEditAssetForm({ assetId, textId, asset, fetcher }) {
  const { t } = useTranslation();

  const formatData = useCallback(
    data => {
      const attributes = mergeImageAltText(data?.attributes, "attachment");

      return asset
        ? { attributes }
        : {
            attributes: {
              ...attributes,
              sourceIdentifier:
                asset?.sourceIdentifier ??
                attributes.attachment?.filename ??
                "filename missing",
              kind: asset?.kind ?? "publication_resource"
            }
          };
    },
    [asset]
  );

  const src = `/api/proxy/ingestion_sources/${assetId}`;

  const onCopy = e => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(src);
    }
  };

  return (assetId && asset) || (!assetId && !asset) ? (
    <FormContainer.Form
      model={asset}
      fetcher={fetcher}
      formatData={formatData}
      className="form-secondary"
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.assets.name_label")}
        name="attributes.displayName"
      />
      {assetId && (
        <>
          <Form.FieldWrapper>
            <Form.Label
              label={t("texts.assets.id_label")}
              styleType="secondary"
            />
            <Styled.ReadOnlyInput readOnly disabled value={assetId} />
          </Form.FieldWrapper>
          <Styled.Wrapper>
            <Form.Label
              label={t("texts.assets.url_label")}
              styleType="secondary"
            />
            <Styled.ReadOnlyInput readOnly disabled value={src} />
            <Styled.ButtonWrapper>
              <Styled.Button onClick={onCopy} $secondary>
                {t("texts.assets.copy_button_label")}
              </Styled.Button>
            </Styled.ButtonWrapper>
          </Styled.Wrapper>
        </>
      )}
      <Form.FieldGroup
        name="attributes.attachment"
        label={t("texts.assets.upload_label")}
        instructions={t("texts.assets.upload_instructions")}
      >
        <Form.Upload
          readFrom="attributes[attachmentStyles][small]"
          name="attributes[attachment]"
          required={!asset}
          altTextName={"attributes[attachmentAltText]"}
          altTextLabel={t("texts.assets.alt_label")}
          accepts="any"
        />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={`/backend/projects/text/${textId}/assets`}
        submitLabel={asset ? "texts.toc.save_button_label" : "actions.save"}
      />
    </FormContainer.Form>
  ) : null;
}

AddEditAssetForm.displayName = "Text.Asset.AddEditForm";

AddEditAssetForm.propTypes = {
  assetId: PropTypes.string,
  textId: PropTypes.string.isRequired
};
