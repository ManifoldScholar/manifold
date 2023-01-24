import React, { Component } from "react";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import PropTypes from "prop-types";
import KindPicker from "./KindPicker";
import IconPicker from "./IconPicker";
import SmartAttributes from "./SmartAttributes";
import Navigation from "backend/components/navigation";
import { withTranslation } from "react-i18next";

class Fields extends Component {
  static displayName = "ProjectCollection.Form.Fields";

  static propTypes = {
    handleDestroy: PropTypes.func,
    getModelValue: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  get homepageVisible() {
    return this.props.getModelValue("attributes[homepage]");
  }

  get id() {
    return this.props.getModelValue("id");
  }

  render() {
    const t = this.props.t;
    const buttons = this.id
      ? [
          {
            onClick: this.props.handleDestroy,
            icon: "delete32",
            label: t("actions.delete"),
            className: "utility-button__icon--notice"
          }
        ]
      : [];

    return (
      <>
        <Navigation.DrawerHeader
          title={t("backend.forms.manage_entity", {
            entity: t("glossary.project_collection_other")
          })}
          hideTitle
          buttons={buttons}
          small
        >
          <Form.TextInput
            wide
            header
            focusOnMount
            label={t("backend.forms.project_collection.collection_title")}
            name="attributes[title]"
            placeholder={t(
              "backend.forms.project_collection.collection_title_placeholder"
            )}
          />
        </Navigation.DrawerHeader>
        <KindPicker {...this.props} />
        <Form.TextInput
          wide
          label={t("backend.slug")}
          name="attributes[pendingSlug]"
          placeholder={t("backend.forms.project_collection.slug_placeholder")}
        />
        <Form.TextArea
          wide
          label={t("backend.forms.project_collection.full_description")}
          name="attributes[description]"
          placeholder={t(
            "backend.forms.project_collection.full_description_placeholder"
          )}
        />
        <Form.TextArea
          wide
          label={t("backend.forms.project_collection.short_description")}
          name="attributes[shortDescription]"
          placeholder={t(
            "backend.forms.project_collection.short_description_placeholder"
          )}
          instructions={t(
            "backend.forms.project_collection.short_description_instructions"
          )}
        />
        <Form.Upload
          wide
          layout="portrait"
          label={t("backend.forms.project_collection.hero_image")}
          accepts="images"
          readFrom="attributes[heroStyles][small]"
          name="attributes[hero]"
          remove="attributes[removeHero]"
        />
        <Form.Select
          name="attributes[heroLayout]"
          label={t("backend.forms.hero_layout")}
          options={[
            { label: "Square Inset", value: "square_inset" },
            { label: "Wide Inset", value: "wide_inset" },
            { label: "Full Bleed", value: "full_bleed" }
          ]}
        />
        <Form.Switch
          label={t("backend.forms.visible")}
          name="attributes[visible]"
        />
        <Form.Switch
          label={t("backend.forms.project_collection.homepage_visible")}
          name="attributes[homepage]"
        />
        {this.homepageVisible && (
          <Form.FieldGroup
            instructions={t(
              "backend.forms.project_collection.homepage_visible_instructions"
            )}
          >
            <Form.DatePicker
              label={t(
                "backend.forms.project_collection.homepage_visible_start"
              )}
              name="attributes[homepageStartDate]"
              wide
            />
            <Form.DatePicker
              label={t("backend.forms.project_collection.homepage_visible_end")}
              name="attributes[homepageEndDate]"
              wide
            />
            <Form.NumberInput
              label={t("backend.forms.project_collection.projects_shown")}
              name="attributes[homepageCount]"
              instructions={t(
                "backend.forms.project_collection.projects_shown_instructions"
              )}
              wide
            />
          </Form.FieldGroup>
        )}
        <IconPicker {...this.props} />
        <Form.Upload
          wide
          layout="portrait"
          label={t("backend.forms.project_collection.custom_icon")}
          accepts="images"
          readFrom="attributes[customIconStyles][small]"
          name="attributes[customIcon]"
          remove="attributes[removeCustomIcon]"
        />
        <Form.Upload
          wide
          layout="portrait"
          label={t("backend.forms.project_collection.social_image")}
          accepts="images"
          readFrom="attributes[socialImageStyles][small]"
          name="attributes[socialImage]"
          remove="attributes[removeSocialImage]"
        />
        <Form.TextInput
          wide
          label={t("backend.forms.project_collection.social_title")}
          name="attributes[socialTitle]"
          placeholder={t(
            "backend.forms.project_collection.social_title_placeholder"
          )}
        />
        <Form.TextArea
          wide
          label={t("backend.forms.project_collection.social_description")}
          name="attributes[socialDescription]"
          placeholder={t(
            "backend.forms.project_collection.social_description_placeholder"
          )}
        />
        <SmartAttributes {...this.props} />
      </>
    );
  }
}

export default withTranslation()(setter(Fields));
