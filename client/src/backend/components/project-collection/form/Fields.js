import React, { Component } from "react";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import PropTypes from "prop-types";
import KindPicker from "./KindPicker";
import IconPicker from "./IconPicker";
import SmartAttributes from "./SmartAttributes";
import Layout from "backend/components/layout";
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
        <Layout.DrawerHeader
          title={t("project_collections.manage", {
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
            label={t("project_collections.collection_title")}
            name="attributes[title]"
            placeholder={t("project_collections.collection_title_placeholder")}
          />
        </Layout.DrawerHeader>
        <KindPicker {...this.props} />
        <Form.TextInput
          wide
          label={t("common.slug")}
          name="attributes[pendingSlug]"
          placeholder={t("project_collections.slug_placeholder")}
        />
        <Form.TextArea
          wide
          label={t("project_collections.full_description")}
          name="attributes[description]"
          placeholder={t("project_collections.full_description_placeholder")}
        />
        <Form.TextArea
          wide
          label={t("project_collections.short_description")}
          name="attributes[shortDescription]"
          placeholder={t("project_collections.short_description_placeholder")}
          instructions={t("project_collections.short_description_instructions")}
        />
        <Form.Upload
          wide
          layout="portrait"
          label={t("project_collections.hero_image")}
          accepts="images"
          readFrom="attributes[heroStyles][small]"
          name="attributes[hero]"
          remove="attributes[removeHero]"
          altTextName="attributes[heroAltText]"
          altTextLabel={t("project_collections.hero_alt_label")}
        />
        <Form.Select
          name="attributes[heroLayout]"
          label={t("hero.layout")}
          options={[
            { label: "Square Inset", value: "square_inset" },
            { label: "Wide Inset", value: "wide_inset" },
            { label: "Full Bleed", value: "full_bleed" }
          ]}
        />
        <Form.Switch
          label={t("project_collections.visible")}
          name="attributes[visible]"
        />
        <Form.Switch
          label={t("project_collections.homepage_visible")}
          name="attributes[homepage]"
        />
        {this.homepageVisible && (
          <Form.FieldGroup
            instructions={t(
              "project_collections.homepage_visible_instructions"
            )}
          >
            <Form.DatePicker
              label={t("project_collections.homepage_visible_start")}
              name="attributes[homepageStartDate]"
              wide
            />
            <Form.DatePicker
              label={t("project_collections.homepage_visible_end")}
              name="attributes[homepageEndDate]"
              wide
            />
            <Form.NumberInput
              label={t("project_collections.projects_shown")}
              name="attributes[homepageCount]"
              instructions={t(
                "project_collections.projects_shown_instructions"
              )}
              wide
            />
          </Form.FieldGroup>
        )}
        <IconPicker {...this.props} />
        <Form.Upload
          wide
          layout="portrait"
          label={t("project_collections.custom_icon")}
          accepts="images"
          readFrom="attributes[customIconStyles][small]"
          name="attributes[customIcon]"
          remove="attributes[removeCustomIcon]"
        />
        <Form.Upload
          wide
          layout="portrait"
          label={t("project_collections.social_image")}
          accepts="images"
          readFrom="attributes[socialImageStyles][small]"
          name="attributes[socialImage]"
          remove="attributes[removeSocialImage]"
        />
        <Form.TextInput
          wide
          label={t("project_collections.social_title")}
          name="attributes[socialTitle]"
          placeholder={t("project_collections.social_title_placeholder")}
        />
        <Form.TextArea
          wide
          label={t("project_collections.social_description")}
          name="attributes[socialDescription]"
          placeholder={t("project_collections.social_description_placeholder")}
        />
        <SmartAttributes {...this.props} />
      </>
    );
  }
}

export default withTranslation()(setter(Fields));
