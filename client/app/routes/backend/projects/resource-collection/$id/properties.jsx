import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import { resourceCollectionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const formatData = data => ({
  ...data,
  attributes: mergeImageAltText(data?.attributes, "thumbnail")
});

export const action = formAction({
  mutation: ({ data, params }) => resourceCollectionsAPI.update(params.id, data)
});

export default function ResourceCollectionProperties() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resourceCollection = useOutletContext();

  return (
    <section>
      <FormContainer.Form
        model={resourceCollection}
        fetcher={fetcher}
        className="form-secondary"
        formatData={formatData}
        notifyOnSuccess
      >
        <Form.TextInput
          label={t("resource_collections.forms.title_label")}
          name="attributes[title]"
          placeholder={t("resource_collections.forms.title_placeholder")}
        />
        <Form.TextArea
          label={t("resource_collections.forms.descript_label")}
          name="attributes[description]"
          placeholder={t("resource_collections.forms.descript_placeholder")}
        />
        <Form.TextInput
          wide
          label={t("resource_collections.forms.slug_label")}
          name="attributes[pendingSlug]"
          placeholder={t("resource_collections.forms.sluslug_placeholder")}
        />
        <Form.Upload
          layout="landscape"
          accepts="images"
          label={t("resource_collections.forms.image_label")}
          readFrom="attributes[thumbnailStyles][small]"
          name="attributes[thumbnail]"
          remove="attributes[removeThumbnail]"
          altTextName="attributes[thumbnailAltText]"
          altTextLabel={t("hero.cover_image_alt_label")}
        />
        <Form.Save text={t("resource_collections.forms.save")} />
      </FormContainer.Form>
    </section>
  );
}
