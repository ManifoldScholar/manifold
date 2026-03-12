import { useFetcher, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, tagsAPI, journalsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import { useApiCallback } from "hooks";

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(journalsAPI.update(params.id, data), context);
    if (result?.errors) return { errors: result.errors };
    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function JournalProperties() {
  const journal = useOutletContext();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const createSubject = useApiCallback(subjectsAPI.create);

  const createSubjectFromValue = name => {
    return createSubject({ type: "subject", attributes: { name } });
  };

  const formatData = data => {
    const { avatarAltText, avatar, ...rest } = data?.attributes ?? {};

    const finalAvatarData =
      typeof avatarAltText === "string"
        ? { ...avatar, altText: avatarAltText }
        : avatar;

    const relationships = data.relationships?.subjects
      ? { subjects: { data: data.relationships?.subjects } }
      : {};

    return {
      relationships,
      attributes: { avatar: finalAvatarData, ...rest }
    };
  };

  return (
    <section>
      <FormContainer.Form
        model={journal}
        fetcher={fetcher}
        className="form-secondary"
        formatData={formatData}
        notifyOnSuccess
      >
        {getModelValue => (
          <>
            <Form.FieldGroup label={t("journals.forms.properties.header")}>
              <Form.TextInput
                wide
                validation={["required"]}
                focusOnMount
                label={t("journals.forms.title_label")}
                name="attributes[title]"
                placeholder={t("journals.forms.title_placeholder")}
              />
              <Form.TextInput
                wide
                label={t("journals.forms.subtitle_label")}
                name="attributes[subtitle]"
                placeholder={t("journals.forms.subtitle_placeholder")}
              />
              <Form.TextInput
                wide
                label={t("journals.forms.properties.slug_label")}
                name="attributes[pendingSlug]"
                placeholder={t("journals.forms.properties.slug_placeholder")}
              />
              <Project.Form.AvatarBuilder wide />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("journals.forms.properties.presentation_header")}
            >
              <Form.Switch
                wide
                label={t("journals.forms.properties.draft_mode_label")}
                name="attributes[draft]"
                instructions={t(
                  "journals.forms.properties.draft_mode_instructions"
                )}
              />
              <Form.Switch
                wide
                label={t("journals.forms.properties.show_home_label")}
                name="attributes[showOnHomepage]"
                instructions={t(
                  "journals.forms.properties.show_home_instructions"
                )}
              />
              {getModelValue("attributes[showOnHomepage]") && (
                <Form.NumberInput
                  wide
                  label={t("journals.forms.properties.homepage_priority_label")}
                  name="attributes[homePagePriority]"
                  placeholder="0"
                  instructions={t(
                    "journals.forms.properties.homepage_priority_instructions"
                  )}
                />
              )}
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("journals.forms.properties.social_header")}
            >
              <Form.TextInput
                label={t("journals.forms.properties.social_card_label")}
                name="attributes[socialTitle]"
                placeholder={t(
                  "journals.forms.properties.social_card_placeholder"
                )}
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
                instructions={t(
                  "journals.forms.properties.social_description_instructions"
                )}
                instructionsPosition="below"
              />
              <Form.Upload
                layout="portrait"
                label={t("journals.forms.properties.social_image_label")}
                accepts="images"
                readFrom="attributes[socialImageStyles][small]"
                name="attributes[socialImage]"
                remove="attributes[removeSocialImage]"
                instructions={t(
                  "journals.forms.properties.social_image_instructions"
                )}
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("journals.forms.properties.taxonomy_header")}
            >
              <Form.Picker
                label={t("journals.forms.properties.subjects_label")}
                listStyle={"well"}
                name="relationships[subjects]"
                options={subjectsAPI.index}
                optionToLabel={subject => subject.attributes.name}
                newToValue={createSubjectFromValue}
                placeholder={t(
                  "journals.forms.properties.subjects_placeholder"
                )}
                listRowComponent="SubjectRow"
              />
              <Form.Picker
                label={t("journals.forms.properties.tags_label")}
                listStyle="well"
                listRowComponent="StringRow"
                name="attributes[tagList]"
                placeholder={t("journals.forms.properties.tags_placeholder")}
                options={tagsAPI.index}
                optionToLabel={tag => tag.attributes.name}
                optionToValue={tag => tag.attributes.name}
                allowNew
              />
            </Form.FieldGroup>
            <Form.Save text={t("journals.forms.properties.save")} />
          </>
        )}
      </FormContainer.Form>
    </section>
  );
}
