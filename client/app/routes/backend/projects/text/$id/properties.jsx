import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import { textsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const formatData = data => ({
  ...data,
  attributes: mergeImageAltText(data?.attributes, "cover")
});

export const action = formAction({
  mutation: ({ data, params }) => textsAPI.update(params.id, data)
});

export default function TextProperties() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const text = useOutletContext();

  return (
    <section>
      <FormContainer.Form
        model={text}
        fetcher={fetcher}
        className="form-secondary"
        formatData={formatData}
      >
        <Form.FieldGroup label={t("texts.properties.header")}>
          <Form.TextInput
            wide
            label={t("texts.properties.title_label")}
            name="attributes[title]"
            placeholder={t("texts.properties.title_placeholder")}
          />
          <Form.TextInput
            wide
            label={t("texts.properties.subtitle_label")}
            name="attributes[subtitle]"
            placeholder={t("texts.properties.subtitle_placeholder")}
          />
          <Form.DatePicker
            label={t("texts.properties.pub_date_label")}
            name="attributes[publicationDate]"
          />
          <Form.TextInput
            wide
            label={t("texts.properties.slug_label")}
            name="attributes[pendingSlug]"
            placeholder={t("texts.properties.slug_placeholder")}
          />
          <Form.TextArea
            wide
            label={t("texts.properties.descript_label")}
            name="attributes[description]"
            placeholder={t("texts.properties.descript_placeholder")}
          />
          <Form.Upload
            wide
            layout="portrait"
            label={t("texts.properties.cover_label")}
            accepts="images"
            readFrom="attributes[coverStyles][small]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
            altTextName={"attributes[coverAltText]"}
            altTextLabel={t("hero.cover_image_alt_label")}
          />
        </Form.FieldGroup>
        <Form.FieldGroup label={t("texts.properties.presentation_header")}>
          <Form.Switch
            wide
            instructions={t("texts.properties.published_instructions")}
            label={t("texts.properties.published_label")}
            name="attributes[published]"
          />
          <Form.TextInput
            wide
            label={t("texts.properties.section_label")}
            name="attributes[sectionKind]"
            placeholder={t("texts.properties.section_placeholder")}
            instructions={t("texts.properties.section_instructions")}
          />
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("journals.forms.properties.social_header")}
          instructions={t("texts.properties.social_instructions")}
        >
          <Form.TextInput
            label={t("journals.forms.properties.social_card_label")}
            name="attributes[socialTitle]"
            placeholder={t("journals.forms.properties.social_card_placeholder")}
            instructions={t(
              "journals.forms.properties.social_card_instructions"
            )}
          />
          <Form.TextArea
            wide
            label={t("journals.forms.properties.social_description_label")}
            name="attributes[socialDescription]"
            placeholder={t(
              "journals.forms.properties.social_description_placeholder"
            )}
          />
          <Form.Upload
            layout="portrait"
            label={t("journals.forms.properties.social_image_label")}
            accepts="images"
            readFrom="attributes[socialImageStyles][small]"
            name="attributes[socialImage]"
            remove="attributes[removeSocialImage]"
            instructions={t("texts.properties.social_image_instructions")}
          />
        </Form.FieldGroup>
        <Form.FieldGroup label={t("texts.properties.access_header")}>
          <Form.Switch
            wide
            label={t("texts.properties.ignore_label")}
            instructions={t("texts.properties.ignore_instructions")}
            name="attributes[ignoreAccessRestrictions]"
          />
        </Form.FieldGroup>
        <Form.Save text={t("texts.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}
