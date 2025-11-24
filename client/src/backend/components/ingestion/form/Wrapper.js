import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Upload from "./Upload";
import cloneDeep from "lodash/cloneDeep";
import { ingestionsAPI } from "api";

export default function IngestionFormWrapper({
  name,
  project,
  location,
  history,
  text,
  ingestion = {},
  onSuccess,
  triggerClose,
  cancelUrl,
  header
}) {
  const updateIngestion = (_id, attributes) => {
    return ingestionsAPI.update(ingestion.id, attributes);
  };

  const createIngestion = _data => {
    const data = cloneDeep(_data);

    if (text) {
      if (!data.relationships) data.relationships = {};
      data.relationships.text = {
        data: {
          type: "texts",
          id: text.id
        }
      };
    }

    return ingestionsAPI.create(project.id, data);
  };

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={ingestion}
      name={name}
      update={updateIngestion}
      create={createIngestion}
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Upload
        header={header}
        cancelUrl={cancelUrl}
        history={history}
        location={location}
        triggerClose={triggerClose}
      />
    </FormContainer.Form>
  );
}

IngestionFormWrapper.displayName = "ProjectDetail.Text.Ingestion.Form.Wrapper";

IngestionFormWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  text: PropTypes.object,
  ingestion: PropTypes.object,
  onSuccess: PropTypes.func,
  triggerClose: PropTypes.func,
  cancelUrl: PropTypes.string,
  header: PropTypes.string
};
