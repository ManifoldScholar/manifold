import React, { PureComponent } from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class ProjectContentTypeFormTableOfContents extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.TableOfContents";

  static propTypes = {
    project: PropTypes.object.isRequired,
    setOther: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultAttributes = {
    depth: 6
  };

  get project() {
    return this.props.project;
  }

  render() {
    return (
      <>
        <Form.TextInput
          label={this.props.t("common.title")}
          name="attributes[title]"
          focusOnMount
        />
        <Form.Picker
          label={this.props.t("glossary.text_title_case_one")}
          options={this.project.relationships.texts}
          optionToLabel={t => t.attributes.title}
          placeholder={this.props.t("content_blocks.toc.select_text")}
          name="relationships[text]"
          wide
        />
        <Form.NumberInput
          label={this.props.t("content_blocks.toc.depth")}
          name="attributes[depth]"
          wide
        />
        <Form.Switch
          label={this.props.t("content_blocks.toc.show_text_title")}
          name="attributes[showTextTitle]"
          wide
          isPrimary
        />
      </>
    );
  }
}

export default withTranslation()(ProjectContentTypeFormTableOfContents);
