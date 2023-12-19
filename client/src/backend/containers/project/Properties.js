import React, { useCallback } from "react";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, journalVolumesAPI, projectsAPI, tagsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useApiCallback } from "hooks";
import { useTranslation } from "react-i18next";

function ProjectPropertiesContainer({ project }) {
  const createSubject = useApiCallback(subjectsAPI.create);

  const createSubjectFromValue = useCallback(
    name => {
      return createSubject({ type: "subject", attributes: { name } });
    },
    [createSubject]
  );

  const { journal, journalIssue } = project.relationships;

  const fetchJournalVolumes = useCallback(() => {
    if (!journal) return [];
    return journalVolumesAPI.index(journal.id);
  }, [journal]);

  const { t } = useTranslation();

  const formatData = data => {
    const { avatarAltText, avatar: avatarData, ...rest } =
      data?.attributes ?? {};

    /* eslint-disable no-nested-ternary */
    const finalAvatarData =
      typeof avatarAltText === "string"
        ? { avatar: { ...avatarData, altText: avatarAltText } }
        : avatarData
        ? { avatar: avatarData }
        : {};

    const { subjects, journalVolume } = data.relationships ?? {};

    const relationships = {
      ...(subjects && { subjects: { data: subjects } }),
      ...(journalVolume && {
        journalVolume: {
          data: journalVolume
        }
      })
    };

    return {
      relationships,
      attributes: { ...finalAvatarData, ...rest }
    };
  };

  return (
    <Authorize
      entity={project}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <section>
        <FormContainer.Form
          model={project}
          name="backend-project-update"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
          formatData={formatData}
        >
          <Form.FieldGroup label={t("projects.forms.properties.header")}>
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
              label={t("projects.forms.title_label")}
              name="attributes[title]"
              placeholder={t("projects.forms.title_placeholder")}
            />
            <Form.TextInput
              wide
              label={t("projects.forms.subtitle_label")}
              name="attributes[subtitle]"
              placeholder={t("projects.forms.subtitle_placeholder")}
            />
            {journalIssue && (
              <>
                <Form.TextInput
                  label={t("issues.forms.number_label")}
                  wide
                  name="attributes[journalIssueNumber]"
                />
                <Form.NumberInput
                  label={t("issues.forms.sort_number_label")}
                  wide
                  name="attributes[journalIssuePendingSortTitle]"
                  placeholder={t("issues.forms.sort_number_placeholder")}
                  instructions={t("issues.forms.sort_number_instructions")}
                />
                <Form.Picker
                  instructions={t("issues.forms.volume_instructions")}
                  wide
                  belongsTo
                  label={t("issues.forms.volume_label")}
                  name="relationships[journalVolume]"
                  optionToLabel={volume => volume.attributes.number}
                  predictive
                  listStyle={"rows"}
                  options={fetchJournalVolumes}
                />
              </>
            )}
            <Form.DatePicker
              label={t("projects.forms.properties.pub_date_label")}
              name="attributes[publicationDate]"
            />
            <Form.TextInput
              wide
              label={t("projects.forms.properties.slug_label")}
              name="attributes[pendingSlug]"
              placeholder={t("projects.forms.properties.slug_placeholder")}
            />
            <Project.Form.AvatarBuilder wide project={project} />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.properties.taxonomy_header")}
          >
            <Form.Picker
              label={t("projects.forms.properties.subjects_label")}
              listStyle={"well"}
              name="relationships[subjects]"
              options={subjectsAPI.index}
              optionToLabel={subject => subject.attributes.name}
              newToValue={createSubjectFromValue}
              placeholder={t("projects.forms.properties.subjects_placeholder")}
              listRowComponent="SubjectRow"
            />

            <Form.Picker
              label={t("projects.forms.properties.tags_label")}
              listStyle="well"
              listRowComponent="StringRow"
              name="attributes[tagList]"
              placeholder={t("projects.forms.properties.tags_placeholder")}
              options={tagsAPI.index}
              optionToLabel={tag => tag.attributes.name}
              optionToValue={tag => tag.attributes.name}
              allowNew
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.properties.presentation_header")}
          >
            <Form.Switch
              wide
              label={t("projects.forms.properties.draft_mode_label")}
              name="attributes[draft]"
              instructions={t(
                "projects.forms.properties.draft_mode_instructions"
              )}
            />
            <Form.Switch
              wide
              label={t("projects.forms.properties.featured_label")}
              name="attributes[featured]"
              instructions={t(
                "projects.forms.properties.featured_instructions"
              )}
            />
            <Form.Switch
              wide
              label={t("projects.forms.properties.finished_label")}
              name="attributes[finished]"
              instructions={t(
                "projects.forms.properties.finished_instructions"
              )}
            />
            <Form.Select
              label={t("projects.forms.properties.standalone_label")}
              wide
              name="attributes[standaloneMode]"
              options={[
                {
                  value: "disabled",
                  label: t(
                    "projects.forms.properties.standalone_options.disabled"
                  )
                },
                {
                  value: "enabled",
                  label: t(
                    "projects.forms.properties.standalone_options.enabled"
                  )
                },
                {
                  value: "enforced",
                  label: t(
                    "projects.forms.properties.standalone_options.enforced"
                  )
                }
              ]}
              instructions={t(
                "projects.forms.properties.standalone_instructions"
              )}
            />
            <Form.TextInput
              label={t("projects.forms.properties.top_bar_text_label")}
              name="attributes[standaloneModePressBarText]"
              instructions={t(
                "projects.forms.properties.top_bar_text_instructions"
              )}
            />
            <Form.TextInput
              label={t("projects.forms.properties.top_bar_url_label")}
              name="attributes[standaloneModePressBarUrl]"
              instructions={t(
                "projects.forms.properties.top_bar_url_instructions"
              )}
            />
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("projects.forms.properties.restrictions_header")}
          >
            <Form.Switch
              wide
              label={t("projects.forms.properties.disable_public_label")}
              name="attributes[disableEngagement]"
              instructions={t(
                "projects.forms.properties.disable_public_instructions"
              )}
            />
          </Form.FieldGroup>
          <Form.Save text={t("projects.forms.properties.save")} />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

export default ProjectPropertiesContainer;
