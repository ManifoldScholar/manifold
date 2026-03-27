import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Upload from "./Upload";

export default function IngestionFormWrapper({
  ingestion = {},
  fetcher,
  cancelUrl,
  header
}) {
  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={ingestion}
      fetcher={fetcher}
      className="form-secondary"
    >
      <Upload header={header} cancelUrl={cancelUrl} />
    </FormContainer.Form>
  );
}

IngestionFormWrapper.displayName = "ProjectDetail.Text.Ingestion.Form.Wrapper";

IngestionFormWrapper.propTypes = {
  ingestion: PropTypes.object,
  fetcher: PropTypes.object,
  cancelUrl: PropTypes.string,
  header: PropTypes.string
};
