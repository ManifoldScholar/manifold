import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import setter from "components/backend/Form/setter";

class IngestionFormUpload extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Upload";

  static propTypes = {
    getModelValue: PropTypes.func,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    setOther: PropTypes.func
  };

  onSourceChange = source => {
    this.props.setOther(source, "attributes[source]");
    this.props.setOther(null, "attributes[externalSourceUrl]");
  };

  onUrlChange = event => {
    this.props.setOther(event.target.value, "attributes[externalSourceUrl]");
    this.props.setOther(null, "attributes[source]");
  };

  get valid() {
    return (
      this.ingestionType && (this.ingestionSource || this.ingestionSourceUrl)
    );
  }

  get ingestionSource() {
    return (
      this.props.getModelValue("attributes[source]") ||
      this.props.getModelValue("attributes[sourceFileName]")
    );
  }

  get ingestionSourceUrl() {
    return this.props.getModelValue("attributes[externalSourceUrl]");
  }

  get ingestionType() {
    return this.props.getModelValue("attributes[ingestionType]");
  }

  handleBackClick = event => {
    event.preventDefault();
    this.props.history.push(this.props.location.pathname, { stage: "type" });
  };

  render() {
    const ingestionType = this.ingestionType;

    /* eslint-disable max-len */
    return (
      <div>
        {ingestionType === "googledoc" ? (
          <Form.FieldGroup {...this.props}>
            <Form.TextInput
              label="URL"
              instructions="Manifold can ingest any publicly available Google doc by entering its URL."
              value={this.props.getModelValue("attributes[externalSourceUrl]")}
              onChange={event => this.onUrlChange(event)}
            />
          </Form.FieldGroup>
        ) : null}
        {ingestionType === "epub" ? (
          <Form.FieldGroup {...this.props}>
            <Form.Upload
              inlineStyle={{ width: "100%" }}
              layout="landscape"
              instructions="Manifold supports both v2 and v3 epub files."
              label="Upload a file ending in .epub"
              value={this.props.getModelValue("attributes[source]")}
              initialValue={this.props.getModelValue(
                "attributes[sourceFileName]"
              )}
              set={this.onSourceChange}
              accepts="epubs"
            />
            <div className="form-divider">or</div>
            <Form.TextInput
              label="URL"
              instructions="Manifold can also ingest epub files by entering a URL"
              value={this.props.getModelValue("attributes[externalSourceUrl]")}
              onChange={event => this.onUrlChange(event)}
            />
          </Form.FieldGroup>
        ) : null}
        {ingestionType === "html" ? (
          <Form.FieldGroup {...this.props}>
            <Form.Upload
              inlineStyle={{ width: "100%" }}
              layout="landscape"
              value={this.props.getModelValue("attributes[source]")}
              initialValue={this.props.getModelValue(
                "attributes[sourceFileName]"
              )}
              set={this.onSourceChange}
              instructions="Upload a single index.htm/html file or create a zip archive with an index.htm/html file in the root."
              label="HTML or .zip source file"
              accepts="zips"
            />
          </Form.FieldGroup>
        ) : null}
        {ingestionType === "markdown" ? (
          <Form.FieldGroup {...this.props}>
            <Form.Upload
              inlineStyle={{ width: "100%" }}
              layout="landscape"
              value={this.props.getModelValue("attributes[source]")}
              initialValue={this.props.getModelValue(
                "attributes[sourceFileName]"
              )}
              set={this.onSourceChange}
              instructions="Upload a zipped collection of markdown files with a book.json file in root directory"
              label="Markdown or .zip source file"
              accepts="zips"
            />
          </Form.FieldGroup>
        ) : null}
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          <button
            onClick={this.handleBackClick}
            className="button-icon-secondary dull"
          >
            <i className="manicon manicon-x small" aria-hidden="true" />
            Back
          </button>
          <button
            type="submit"
            className="button-icon-secondary"
            disabled={!this.valid}
          >
            <i className="manicon manicon-check small" aria-hidden="true" />
            Continue
          </button>
        </div>
      </div>
    );
  }
}

export default setter(IngestionFormUpload);
