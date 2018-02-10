import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as FormContainer } from "containers/backend";
import { Form as GlobalForm } from "components/global";

class FormPredictiveBelongsTo extends PureComponent {
  static displayName = "Form.PredictiveBelongsTo";

  static propTypes = {
    setOther: PropTypes.func,
    renderSelected: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    value: PropTypes.object,
    getModelValue: PropTypes.func,
    readOnly: PropTypes.bool,
    relationName: PropTypes.string,
    errors: PropTypes.array
  };

  handleSelect = entity => {
    this.props.setOther(entity, `relationships[${this.props.relationName}]`);
  };

  render() {
    const value = this.props.getModelValue(
      `relationships[${this.props.relationName}]`
    );

    return (
      <div className="form-input">
        {this.props.renderSelected(value)}
        {!this.props.readOnly ? (
          <GlobalForm.Errorable
            className="form-input"
            name={`attributes[${this.props.relationName}]`}
            errors={this.props.errors}
          >
            <FormContainer.PredictiveInput
              className="input-predictive"
              fetch={this.props.fetch}
              fetchOptions={this.props.fetchOptions}
              placeholder="Select User"
              label={this.props.label}
              onSelect={entity => this.handleSelect(entity)}
            />
          </GlobalForm.Errorable>
        ) : null}
      </div>
    );
  }
}

export default setter(FormPredictiveBelongsTo);
