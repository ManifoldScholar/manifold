import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Form from "backend/components/form";
import IconComposer from "global/components/utility/IconComposer";

class IngestionFormUpload extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Upload";

  static propTypes = {
    getModelValue: PropTypes.func,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    cancelUrl: PropTypes.string,
    setOther: PropTypes.func,
    header: PropTypes.string
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
    return this.ingestionSource || this.ingestionSourceUrl;
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

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary",
      "button-icon-secondary--in-drawer"
    );
  }

  handleCancelClick = event => {
    event.preventDefault();
    this.props.cancelUrl
      ? this.props.history.push(this.props.cancelUrl)
      : this.props.history.goBack();
  };

  render() {
    const formHeader = this.props.header || "Upload";

    const fileInstructions = (
      <span className="instructions">
        Manifold can ingest texts from single files or a .zip collection.
        <br />
        See the{" "}
        <a
          href="https://manifoldapp.org/docs/projects/preparing"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentation
        </a>{" "}
        for supported file types and directory structure.
      </span>
    );

    /* eslint-disable max-len */
    return (
      <div>
        <Form.Header label={formHeader} />
        <Form.TusUpload
          inlineStyle={{ width: "100%" }}
          layout="landscape"
          instructions={fileInstructions}
          label="Upload a file"
          value={this.props.getModelValue("attributes[source]")}
          initialValue={this.props.getModelValue("attributes[sourceFileName]")}
          set={this.onSourceChange}
          accepts="any"
        />
        <div className="form-divider">or</div>
        <Form.TextInput
          label="URL"
          focusOnMount
          instructions="Manifold can also ingest texts by entering a URL to a Google Doc, EPUB, or HTML file."
          value={this.props.getModelValue("attributes[externalSourceUrl]")}
          onChange={event => this.onUrlChange(event)}
        />
        <div style={{ marginTop: 30 }} className="buttons-icon-horizontal">
          {this.props.cancelUrl ? (
            <button
              onClick={this.handleCancelClick}
              className={classNames(
                this.buttonClasses,
                "button-icon-secondary--dull"
              )}
            >
              <IconComposer
                icon="close16"
                size="default"
                iconClass="button-icon-secondary__icon"
              />
              <span>Cancel</span>
            </button>
          ) : null}
          <button
            type="submit"
            className={this.buttonClasses}
            disabled={!this.valid}
          >
            <IconComposer
              icon="check16"
              size="default"
              iconClass="button-icon-secondary__icon"
            />
            <span>Continue</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Form.setter(IngestionFormUpload);
