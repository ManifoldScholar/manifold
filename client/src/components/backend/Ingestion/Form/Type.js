import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class IngestionFormType extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Type";

  static propTypes = {
    getModelValue: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    triggerClose: PropTypes.func
  };

  static defaultProps = {
    getModelValue: () => {}
  };

  static types = [
    {
      value: "epub",
      label: "EPUB v2 or v3"
    },
    {
      value: "markdown",
      label: "Markdown document(s)"
    },
    {
      value: "googledoc",
      label: "Google Doc"
    },
    {
      value: "html",
      label: "HTML document"
    }
  ];

  get valid() {
    const value = this.props.getModelValue("attributes[ingestionType]");
    return this.ingestionTypeOptions.map(o => o.value).includes(value);
  }

  get ingestionTypeOptions() {
    return IngestionFormType.types;
  }

  handleProceedClick = event => {
    event.preventDefault();
    this.props.history.push(this.props.location.pathname, { stage: "upload" });
  };

  close = event => {
    if (this.props.triggerClose) {
      event.preventDefault();
      this.props.triggerClose();
    }
  };

  render() {
    return (
      <Form.FieldGroup {...this.props}>
        <Form.Radios
          name="attributes[ingestionType]"
          label="Text Format"
          options={this.ingestionTypeOptions}
        />
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          <button onClick={this.close} className="button-icon-secondary dull">
            <i className="manicon manicon-x small" />
            Cancel
          </button>
          <button
            onClick={this.handleProceedClick}
            className="button-icon-secondary"
            disabled={!this.valid}
          >
            <i className="manicon manicon-check small" />
            Continue
          </button>
        </div>
      </Form.FieldGroup>
    );
  }
}
