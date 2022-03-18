import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ProjectContentTypeFormTexts extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Texts";

  static propTypes = {
    project: PropTypes.object,
    t: PropTypes.func
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
        <Form.TextInput
          label={this.props.t("backend.forms.title")}
          name="attributes[title]"
          focusOnMount
        />
        <Form.TextArea
          label={this.props.t("backend.forms.description")}
          name="attributes[description]"
        />
        <div className="form-section form-section--primary">
          <div className="form-input-group form-input-group--primary">
            <Form.Switch
              label={this.props.t("backend.forms.text.show_author_names")}
              name="attributes[showAuthors]"
            />
            <Form.Switch
              label={this.props.t("backend.forms.text.show_descriptions")}
              name="attributes[showDescriptions]"
            />
            <Form.Switch
              label={this.props.t("backend.forms.text.show_subtitles")}
              name="attributes[showSubtitles]"
            />
            <Form.Switch
              label={this.props.t("backend.forms.text.show_cover_images")}
              name="attributes[showCovers]"
            />
            <Form.Switch
              label={this.props.t("backend.forms.text.show_dates")}
              name="attributes[showDates]"
            />
            <Form.Switch
              label={this.props.t("backend.forms.text.show_category_labels")}
              name="attributes[showCategoryLabels]"
            />
            <Form.Switch
              label={this.props.t(
                "backend.forms.text.show_uncategorized_texts"
              )}
              name="attributes[showUncategorized]"
            />
          </div>
        </div>
        {this.hasCategories && (
          <Form.Picker
            placeholder={this.props.t("backend.forms.text.add_text_category")}
            label={this.props.t("backend.forms.text.include_texts_in_category")}
            optionToLabel={rc => rc.attributes.title}
            name="relationships[includedCategories]"
            options={this.categories}
            listStyle="rows"
            reorderable
            showAddRemoveAll
            listRowComponent="TextCategoryRow"
          />
        )}
      </>
    );
  }
}

export default withTranslation()(ProjectContentTypeFormTexts);
