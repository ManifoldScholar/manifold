import React, { Component } from "react";
import Form from "backend/components/form";
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
            label: "delete"
          }
        ]
      : [];

    return (
      <React.Fragment>
        <Navigation.DrawerHeader buttons={buttons}>
          <Form.TextInput
            wide
            focusOnMount
            label="Collection Title:"
            name="attributes[title]"
            placeholder="Enter collection name"
          />
        </Navigation.DrawerHeader>

        <KindPicker {...this.props} />
        <Form.TextInput
          wide
          label="Slug:"
          name="attributes[slug]"
          placeholder="Enter slug"
        />
        <Form.TextArea
          wide
          label="Description:"
          name="attributes[description]"
          placeholder="Enter description"
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
          <React.Fragment>
            <Form.Instructions
              className="form-input"
              instructions="If dates set, project collection will automatically appear on homepage during specified time period."
            />
            <Form.DatePicker
              label="Homepage Visibility Start"
              name="attributes[homepageStartDate]"
            />
            <Form.DatePicker
              label="Homepage Visibility End"
              name="attributes[homepageEndDate]"
            />
            <Form.NumberInput
              label="Projects Shown:"
              name="attributes[homepageCount]"
              instructions="Number of projects shown in homepage blade (0 - 40).  Will show all if none is set."
            />
          </React.Fragment>
        )}
        <IconPicker {...this.props} />
        <SmartAttributes {...this.props} />
      </React.Fragment>
    );
  }
}

export default Form.setter(Fields);
