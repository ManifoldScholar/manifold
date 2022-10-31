import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import { Trans, withTranslation } from "react-i18next";
import { t } from "i18next";

class IngestionFormUpload extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Upload";

  static propTypes = {
    getModelValue: PropTypes.func,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    cancelUrl: PropTypes.string,
    setOther: PropTypes.func,
    header: PropTypes.string,
    t: PropTypes.func
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
    return classNames("button-secondary", "button-secondary--outlined");
  }

  handleCancelClick = event => {
    event.preventDefault();
    this.props.cancelUrl
      ? this.props.history.push(this.props.cancelUrl)
      : this.props.history.goBack();
  };

  render() {
    const formHeader =
      this.props.header || t("backend.forms.ingestion.upload_file");

    const fileInstructions = (
      <span className="instructions">
        <Trans
          i18nKey="backend.forms.ingestion.instructions"
          components={[
            <a
              href="https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/texts#adding-texts"
              target="_blank"
              rel="noopener noreferrer"
            >
              #
            </a>
          ]}
        />
      </span>
    );

    /* eslint-disable max-len */
    return (
      <>
        <Form.FieldGroup label={formHeader} instructions={fileInstructions}>
          <Form.TusUpload
            inlineStyle={{ width: "100%" }}
            layout="landscape"
            value={this.props.getModelValue("attributes[source]")}
            initialValue={this.props.getModelValue(
              "attributes[sourceFileName]"
            )}
            set={this.onSourceChange}
            accepts="any"
          />
        </Form.FieldGroup>
        <Form.FieldGroup
          label={t("backend.forms.ingestion.upload_from_url")}
          instructions={t("backend.forms.ingestion.url_instructions")}
        >
          <Form.TextInput
            label={t("backend.forms.ingestion.url")}
            focusOnMount
            value={this.props.getModelValue("attributes[externalSourceUrl]")}
            onChange={event => this.onUrlChange(event)}
            placeholder={t("backend.forms.ingestion.url_placeholder")}
          />
          <div className="buttons-icon-horizontal authoring-drawer">
            <button
              type="submit"
              className={this.buttonClasses}
              disabled={!this.valid}
            >
              <span>{t("actions.continue")}</span>
            </button>
            {this.props.cancelUrl ? (
              <button
                onClick={this.handleCancelClick}
                className={classNames(
                  this.buttonClasses,
                  "button-secondary--dull"
                )}
              >
                <span>{t("actions.cancel")}</span>
              </button>
            ) : null}
          </div>
        </Form.FieldGroup>
      </>
    );
  }
}

export default withTranslation()(setter(IngestionFormUpload));
