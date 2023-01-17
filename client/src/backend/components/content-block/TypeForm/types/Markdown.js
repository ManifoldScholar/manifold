import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { withTranslation } from "react-i18next";

class ProjectContentTypeFormMarkdown extends PureComponent {
  static displayName = "Project.Content.TypeForm.Types.Markdown";

  static propTypes = {
    setOther: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  static defaultAttributes = {
    style: "normal"
  };

  render() {
    return (
      <>
        <Form.TextArea
          focusOnMount
          label={this.props.t("content_blocks.markdown.body")}
          name="attributes[body]"
          wide
          height={300}
        />
        <Form.Radios
          label={this.props.t("content_blocks.markdown.style")}
          name="attributes[style]"
          options={[
            { label: this.props.t("layout.normal"), value: "normal" },
            { label: this.props.t("layout.shaded"), value: "shaded" }
          ]}
          inline
          wide
        />
      </>
    );
  }
}

export default withTranslation()(ProjectContentTypeFormMarkdown);
