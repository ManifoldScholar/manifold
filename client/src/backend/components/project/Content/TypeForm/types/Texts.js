import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";

export default class ProjectContentTypeFormTexts extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Texts";

  static propTypes = {
    project: PropTypes.object
  };

  get categories() {
    return this.props.project.relationships.textCategories;
  }

  render() {
    return (
      <React.Fragment>
        <Form.TextInput label="Title" name="attributes[title]" focusOnMount />
        <Form.TextArea label="Description" name="attributes[description]" />
        <div className="form-section">
          <div className="form-input-group">
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
          </div>
        </div>
        <Form.HasMany
          label="Categories"
          placeholder="Add a Category"
          name="relationships[includedCategories]"
          options={this.categories}
          entityLabelAttribute={"title"}
          wide
        />
      </React.Fragment>
    );
  }
}
