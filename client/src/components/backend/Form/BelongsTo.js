import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as BackendForm } from "components/backend";
import { Form as GlobalForm } from "components/global";

class FormBelongsTo extends PureComponent {
  static displayName = "Form.BelongsTo";

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
    errors: PropTypes.array,
    idForError: PropTypes.string,
    focusOnMount: PropTypes.bool,
    placeholder: PropTypes.string,
    searchable: PropTypes.bool
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
            idForError={this.props.idForError}
          >
            <BackendForm.OptionsList
              onSelect={this.handleSelect}
              {...this.props}
            />
          </GlobalForm.Errorable>
        ) : null}
      </div>
    );
  }
}

export default setter(FormBelongsTo);
