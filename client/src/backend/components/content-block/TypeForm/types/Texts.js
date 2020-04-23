import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ProjectContentTypeFormTexts extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Texts";

  static propTypes = {
    project: PropTypes.object
  };

  static defaultAttributes = {
    showDates: true,
    showSubtitles: true,
    showCategoryLabels: true,
    showCovers: true,
    showUncategorized: true
  };

  get categories() {
    return this.props.project.relationships.textCategories;
  }

  get hasCategories() {
    return this.categories.length > 0;
  }

  render() {
    return (
      <>
        <Form.TextInput label="Title" name="attributes[title]" focusOnMount />
        <Form.TextArea label="Description" name="attributes[description]" />
        <div className="form-section form-section--primary">
          <div className="form-input-group form-input-group--primary">
            <Form.Switch
              label="Show Author Names?"
              name="attributes[showAuthors]"
            />
            <Form.Switch
              label="Show Descriptions?"
              name="attributes[showDescriptions]"
            />
            <Form.Switch
              label="Show Subtitles?"
              name="attributes[showSubtitles]"
            />
            <Form.Switch
              label="Show Cover Images?"
              name="attributes[showCovers]"
            />
            <Form.Switch label="Show Dates?" name="attributes[showDates]" />
            <Form.Switch
              label="Show Category Labels?"
              name="attributes[showCategoryLabels]"
            />
            <Form.Switch
              label="Show Uncategorized Texts?"
              name="attributes[showUncategorized]"
            />
          </div>
        </div>
        {this.hasCategories && (
          <Form.Picker
            placeholder="Add a Text Category"
            label="Include Texts in these Categories"
            optionToLabel={rc => rc.attributes.title}
            name="relationships[includedCategories]"
            options={this.categories}
            listStyle="well"
            showAddRemoveAll
            listRowComponent="TextCategoryRow"
          />
        )}
      </>
    );
  }
}
