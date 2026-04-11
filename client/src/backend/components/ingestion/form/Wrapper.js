import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Upload from "./Upload";

function formatData(dirty, source) {
  const attributes = { ...source.attributes, ...dirty.attributes };
  if (attributes.source) {
    delete attributes.externalSourceUrl;
  } else if (attributes.externalSourceUrl) {
    delete attributes.source;
    delete attributes.sourceFileName;
  }
  return { ...dirty, attributes };
}

export default function IngestionFormWrapper({
  ingestion = {},
  fetcher,
  formatData: formatDataProp,
  cancelUrl,
  header,
  sectionId,
  sectionIngest
}) {
  const composedFormatData = (dirty, source) => {
    const formatted = formatData(dirty, source);
    return formatDataProp ? formatDataProp(formatted, source) : formatted;
  };

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={ingestion}
      fetcher={fetcher}
      formatData={composedFormatData}
      className="form-secondary"
    >
      <Upload
        header={header}
        cancelUrl={cancelUrl}
        sectionId={sectionId}
        sectionIngest={sectionIngest}
      />
    </FormContainer.Form>
  );
}

IngestionFormWrapper.displayName = "ProjectDetail.Text.Ingestion.Form.Wrapper";

IngestionFormWrapper.propTypes = {
  ingestion: PropTypes.object,
  fetcher: PropTypes.object,
  formatData: PropTypes.func,
  cancelUrl: PropTypes.string,
  header: PropTypes.string,
  sectionId: PropTypes.string,
  sectionIngest: PropTypes.bool
};
