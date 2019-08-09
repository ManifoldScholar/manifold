import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Upload from "./Upload";
import cloneDeep from "lodash/cloneDeep";
import { ingestionsAPI } from "api";

export default class IngestionFormWrapper extends PureComponent {
  static displayName = "ProjectDetail.Text.Ingestion.Form.Wrapper";

  static propTypes = {
    name: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    text: PropTypes.object,
    ingestion: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    triggerClose: PropTypes.func,
    cancelUrl: PropTypes.string,
    header: PropTypes.string
  };

  static defaultProps = {
    ingestion: {}
  };

  updateIngestion = (id, attributes) => {
    return ingestionsAPI.update(this.props.ingestion.id, attributes);
  };

  createIngestion = _data => {
    const data = cloneDeep(_data);

    if (this.props.text) {
      if (!data.relationships) data.relationships = {};
      data.relationships.text = {
        data: {
          type: "texts",
          id: this.props.text.id
        }
      };
    }

    return ingestionsAPI.create(this.props.project.id, data);
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { ingestion, onSuccess } = this.props;
    /* eslint-enable no-unused-vars */

    return (
      <FormContainer.Form
        doNotWarn
        groupErrors
        model={ingestion}
        name={this.props.name}
        update={this.updateIngestion}
        create={this.createIngestion}
        className="form-secondary"
        onSuccess={this.props.onSuccess}
      >
        <Upload
          header={this.props.header}
          cancelUrl={this.props.cancelUrl}
          history={this.props.history}
          location={this.props.location}
          triggerClose={this.props.triggerClose}
        />
      </FormContainer.Form>
    );
  }
}
