import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { ingestionSourcesAPI } from "api";
import { useHistory } from "react-router-dom";
import * as Styled from "./styles";

export default function AddEditAssetForm({ assetId, textId, model, refresh }) {
  const { t } = useTranslation();
  const history = useHistory();

  const formatData = useCallback(
    data => {
      const displayName = data.name;
      const attachment =
        typeof data.attachment === "object" ? data.attachment : null;
      const attributes = {
        ...(displayName && { displayName }),
        ...(attachment && { attachment })
      };
      return displayName || attachment
        ? {
            attributes: {
              ...attributes,
              sourceIdentifier:
                model?.sourceIdentifier ?? data.attachment.filename,
              kind: model?.kind ?? "publication_resource"
            }
          }
        : {};
    },
    [model]
  );

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendTextAssets", textId));
  }, [history, textId, refresh]);

  const origin = typeof window !== "undefined" ? window.location.origin : null;
  const src = origin
    ? `${origin}/api/proxy/ingestion_sources/${assetId}`
    : `/api/proxy/ingestion_sources/${assetId}`;

  const onCopy = e => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(src);
    }
  };

  const createAsset = data => {
    return ingestionSourcesAPI.create(textId, data);
  };

  const { displayName, sourceIdentifier } = model?.attributes ?? {};

  const nameDefault = displayName ?? sourceIdentifier;

  return (assetId && model) || (!assetId && !model) ? (
    <FormContainer.Form
      model={model}
      name={assetId ? "be-asset-update" : "be-asset-create"}
      create={createAsset}
      update={ingestionSourcesAPI.update}
      formatData={formatData}
      onSuccess={onSuccess}
      className="form-secondary"
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.assets.name_label")}
        instructions={t("texts.assets.name_instructions")}
        renderValue={undefined}
        value={nameDefault}
        name="name"
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
        name="attachment"
        label={t("texts.assets.upload_label")}
        instructions={t("texts.assets.upload_instructions")}
      >
        <Form.Upload
          fileNameFrom="attributes[attachmentData][metadata][filename]"
          value={
            model
              ? `http://manifold.lvh/system/${model?.attributes?.attachmentData.id}`
              : undefined
          }
        />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextAssets", textId)}
        submitLabel={model ? "texts.toc.save_button_label" : "actions.save"}
      />
    </FormContainer.Form>
  ) : null;
}

AddEditAssetForm.displayName = "Text.Asset.AddEditForm";

AddEditAssetForm.propTypes = {
  assetId: PropTypes.string,
  textId: PropTypes.string.isRequired
};
