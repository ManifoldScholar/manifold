import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { resourceCollectionsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const formatData = data => ({
  ...data,
  attributes: mergeImageAltText(data?.attributes, "thumbnail")
});

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(
      resourceCollectionsAPI.update(params.id, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceCollectionProperties() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { resourceCollection } = useOutletContext();

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
