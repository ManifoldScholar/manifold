import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext, redirect } from "react-router";
import { journalsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(journalsAPI.update(params.id, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/journals/${params.id}/layout`);
  } catch (error) {
    return handleActionError(error);
  }
}

function formatData(dirty, source) {
  const merged = {
    attributes: { ...source.attributes, ...dirty.attributes },
    relationships: { ...dirty.relationships }
  };

  return {
    ...merged,
    attributes: mergeImageAltText(merged.attributes, "logo", "hero")
  };
}

export default function JournalHeroEdit() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const journal = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader
        icon="journals64"
        title={t("layout.description_and_images")}
      />
      <FormContainer.Form
        model={journal}
        fetcher={fetcher}
        formatData={formatData}
        className="form-secondary"
        notifyOnSuccess
      >
        <Form.TextArea
          wide
          focusOnMount
          height={250}
          label={t("common.description")}
          name="attributes[description]"
          placeholder={t("hero.description_placeholder", {
            entity: "journal"
          })}
          instructions={t("hero.description_instructions", {
            entity: "journal"
          })}
        />
        <Form.Upload
          layout="landscape"
          accepts="images"
          label={t("hero.image_label")}
          readFrom="attributes[heroStyles][small]"
          name="attributes[hero]"
          remove="attributes[removeHero]"
          instructions={t("hero.image_instructions")}
          altTextName="attributes[heroAltText]"
          altTextLabel={t("hero.image_alt_label")}
        />
        <Form.Select
          name="attributes[heroLayout]"
          label={t("hero.layout")}
          options={[
            { label: t("hero.square_inset"), value: "square_inset" },
            { label: t("hero.wide_inset"), value: "wide_inset" },
            { label: t("hero.full_bleed"), value: "full_bleed" }
          ]}
        />
        <Form.Upload
          layout="portrait"
          label={t("journals.forms.logo")}
          accepts="images"
          readFrom="attributes[logoStyles][small]"
          name="attributes[logo]"
          remove="attributes[removeLogo]"
          instructions={t("journals.forms.logo_instructions", {
            entity: "journal"
          })}
          altTextName="attributes[logoAltText]"
          altTextLabel={t("journals.forms.logo_alt_label")}
        />
        <Form.ColorInput
          label={t("hero.background_color")}
          name="attributes[heroBackgroundColor]"
          defaultValue="#52e3ac"
          instructions={t("hero.background_color_instructions")}
          container=".drawer--backend"
          wide
        />
        <Form.TextArea
          label={t("hero.image_credits")}
          name="attributes[imageCredits]"
          placeholder={t("hero.image_credits_placeholder")}
          instructions={t("hero.image_credits_instructions")}
          height={250}
          wide
        />
        <Form.Save text={t("actions.save")} />
      </FormContainer.Form>
    </section>
  );
}
