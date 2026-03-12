import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { useTranslation } from "react-i18next";

function VolumeForm({ model, fetcher }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      fetcher={fetcher}
      model={model}
      className="form-secondary"
      notifyOnSuccess
    >
      <Form.NumberInput
        label={t("volumes.number_truncated")}
        focusOnMount
        name="attributes[number]"
      />
      <Form.TextInput
        wide
        label={t("common.slug")}
        name="attributes[pendingSlug]"
        placeholder={t("volumes.slug_placeholder")}
      />
      <Form.Save
        text={model ? t("volumes.update_volume") : t("volumes.create_volume")}
      />
    </FormContainer.Form>
  );
}

VolumeForm.prop_types = {
  model: PropTypes.object,
  fetcher: PropTypes.object.isRequired
};

export default VolumeForm;
