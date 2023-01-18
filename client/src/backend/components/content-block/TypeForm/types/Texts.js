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
          label={this.props.t("common.title")}
          name="attributes[title]"
          focusOnMount
          wide
        />
        <Form.TextArea
          label={this.props.t("common.description")}
          name="attributes[description]"
          wide
        />
        <Form.FieldGroup>
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_author_names")}
            name="attributes[showAuthors]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_descriptions")}
            name="attributes[showDescriptions]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_subtitles")}
            name="attributes[showSubtitles]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_cover_images")}
            name="attributes[showCovers]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_dates")}
            name="attributes[showDates]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t("content_blocks.texts.show_category_labels")}
            name="attributes[showCategoryLabels]"
            isPrimary
          />
          <Form.Switch
            label={this.props.t(
              "content_blocks.texts.show_uncategorized_texts"
            )}
            name="attributes[showUncategorized]"
            isPrimary
          />
        </Form.FieldGroup>
        {this.hasCategories && (
          <Form.Picker
            placeholder={this.props.t("content_blocks.texts.add_text_category")}
            label={this.props.t(
              "content_blocks.texts.include_texts_in_category"
            )}
            optionToLabel={rc => rc.attributes.title}
            name="relationships[includedCategories]"
            options={this.categories}
            listStyle="rows"
            reorderable
            showAddRemoveAll
            listRowComponent="TextCategoryRow"
            wide
          />
        )}
      </>
    );
  }
}

export default withTranslation()(ProjectContentTypeFormTexts);
