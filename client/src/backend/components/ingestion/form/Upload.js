import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import { Trans, withTranslation } from "react-i18next";
import { t } from "i18next";

class IngestionFormUpload extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Upload";

  static propTypes = {
    getModelValue: PropTypes.func,
    cancelUrl: PropTypes.string,
    setOther: PropTypes.func,
    header: PropTypes.string,
    t: PropTypes.func,
    sectionIngest: PropTypes.bool,
    sectionId: PropTypes.string
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

  get fileInstructionsText() {
    return (
      <Trans
        i18nKey="texts.ingestion.instructions"
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
    );
  }

  // TODO: update the link here after docs are updated
  get fileInstructionsSection() {
    if (this.props.sectionId)
      return this.props.t("texts.section.reingest_instructions");

    return (
      <Trans
        i18nKey="texts.section.ingest_instructions"
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
    );
  }

  render() {
    const formHeader = this.props.header || t("texts.ingestion.upload_file");

    const isSection = this.props.sectionIngest;

    const fileInstructions = (
      <span className="instructions">
        {isSection ? this.fileInstructionsSection : this.fileInstructionsText}
      </span>
    );

    /* eslint-disable no-nested-ternary */
    const urlInstructions = isSection
      ? this.props.sectionId
        ? t("texts.section.reingest_url_instructions")
        : t("texts.section.url_instructions")
      : t("texts.ingestion.url_instructions");
    /* eslint-enable no-nested-ternary */

    /* eslint-disable max-len */
    return (
      <>
        <Form.FieldGroup label={formHeader} instructions={fileInstructions}>
          <Form.TusUpload
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
          label={t("texts.ingestion.upload_from_url")}
          instructions={urlInstructions}
        >
          <Form.TextInput
            label={t("texts.ingestion.url")}
            focusOnMount
            value={this.props.getModelValue("attributes[externalSourceUrl]")}
            onChange={event => this.onUrlChange(event)}
            placeholder={t("texts.ingestion.url_placeholder")}
          />
        </Form.FieldGroup>
        <Form.DrawerButtons
          showCancel
          cancelUrl={this.props.cancelUrl}
          submitLabel="actions.continue"
        />
      </>
    );
  }
}

export default withTranslation()(setter(IngestionFormUpload));
