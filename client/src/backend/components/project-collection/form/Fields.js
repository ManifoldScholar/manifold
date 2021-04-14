import React, { Component } from "react";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import PropTypes from "prop-types";
import KindPicker from "./KindPicker";
import IconPicker from "./IconPicker";
import SmartAttributes from "./SmartAttributes";
import Navigation from "backend/components/navigation";

class Fields extends Component {
  static displayName = "ProjectCollection.Form.Fields";

  static propTypes = {
    handleDestroy: PropTypes.func,
    getModelValue: PropTypes.func.isRequired
  };

  get homepageVisible() {
    return this.props.getModelValue("attributes[homepage]");
  }

  get id() {
    return this.props.getModelValue("id");
  }

  render() {
    const buttons = this.id
      ? [
          {
            onClick: this.props.handleDestroy,
            icon: "delete32",
            label: "delete",
            iconClass: "utility-button__icon--notice"
          }
        ]
      : [];

    return (
      <>
        <Navigation.DrawerHeader buttons={buttons}>
          <Form.TextInput
            wide
            focusOnMount
            label="Collection Title"
            name="attributes[title]"
            placeholder="Enter collection name"
          />
        </Navigation.DrawerHeader>

        <KindPicker {...this.props} />
        <Form.TextInput
          wide
          label="Slug"
          name="attributes[pendingSlug]"
          placeholder="Enter URL slug"
        />
        <Form.TextArea
          wide
          label="Description"
          name="attributes[description]"
          placeholder="Enter description"
        />
        <Form.Upload
          wide
          layout="portrait"
          label="Hero Image"
          accepts="images"
          readFrom="attributes[heroStyles][small]"
          name="attributes[hero]"
          remove="attributes[removeHero]"
        />
        <Form.Select
          name="attributes[heroLayout]"
          label="Hero Layout:"
          options={[
            { label: "Square Inset", value: "square_inset" },
            { label: "Wide Inset", value: "wide_inset" },
            { label: "Full Bleed", value: "full_bleed" }
          ]}
        />
        <Form.Switch
          className="form-toggle-secondary"
          label="Visible:"
          name="attributes[visible]"
        />
        <Form.Switch
          className="form-toggle-secondary"
          label="Show on homepage:"
          name="attributes[homepage]"
        />
        {this.homepageVisible && (
          <Form.FieldGroup instructions="If dates set, project collection will automatically appear on homepage during specified time period.">
            <Form.DatePicker
              label="Homepage Visibility Start"
              name="attributes[homepageStartDate]"
              wide
            />
            <Form.DatePicker
              label="Homepage Visibility End"
              name="attributes[homepageEndDate]"
              wide
            />
            <Form.NumberInput
              label="Projects Shown:"
              name="attributes[homepageCount]"
              instructions="Number of projects shown in homepage blade (0 - 40).  Will show all if none is set."
              wide
            />
          </Form.FieldGroup>
        )}
        <IconPicker {...this.props} />
        <Form.Upload
          wide
          layout="portrait"
          label="Custom Icon"
          accepts="images"
          readFrom="attributes[customIconStyles][small]"
          name="attributes[customIcon]"
          remove="attributes[removeCustomIcon]"
        />
        <Form.Upload
          wide
          layout="portrait"
          label="Social Card Image"
          accepts="images"
          readFrom="attributes[socialImageStyles][small]"
          name="attributes[socialImage]"
          remove="attributes[removeSocialImage]"
        />
        <Form.TextInput
          wide
          label="Social Card Title"
          name="attributes[socialTitle]"
          placeholder="Optionally, Enter a Social Card Title"
        />
        <Form.TextArea
          wide
          label="Social Card Description"
          name="attributes[socialDescription]"
          placeholder="Optionally, Enter a Social Card Description"
        />
        <SmartAttributes {...this.props} />
      </>
    );
  }
}

export default setter(Fields);
