import PropTypes from "prop-types";
import Form from "global/components/form";
import { Trans, useTranslation } from "react-i18next";

export default function IngestionFormUpload({
  cancelUrl,
  header,
  sectionIngest,
  sectionId
}) {
  const { t } = useTranslation();

  const fileInstructionsText = (
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

  const fileInstructionsSection = sectionId ? (
    t("texts.section.reingest_instructions")
  ) : (
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

  const formHeader = header || t("texts.ingestion.upload_file");
  const isSection = sectionIngest;

  const fileInstructions = (
    <span className="instructions">
      {isSection ? fileInstructionsSection : fileInstructionsText}
    </span>
  );

  /* eslint-disable no-nested-ternary */
  const urlInstructions = isSection
    ? sectionId
      ? t("texts.section.reingest_url_instructions")
      : t("texts.section.url_instructions")
    : t("texts.ingestion.url_instructions");
  /* eslint-enable no-nested-ternary */

  return (
    <>
      <Form.FieldGroup label={formHeader} instructions={fileInstructions}>
        <Form.TusUpload
          layout="landscape"
          name="attributes[source]"
          readFrom="attributes[sourceFileName]"
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
          name="attributes[externalSourceUrl]"
        />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={cancelUrl}
        submitLabel="actions.continue"
      />
    </>
  );
}

IngestionFormUpload.displayName = "ProjectDetail.Text.Ingestion.Form.Upload";

IngestionFormUpload.propTypes = {
  cancelUrl: PropTypes.string,
  header: PropTypes.string,
  sectionIngest: PropTypes.bool,
  sectionId: PropTypes.string
};
