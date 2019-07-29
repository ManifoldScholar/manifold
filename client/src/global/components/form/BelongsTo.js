import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import OptionsList from "./OptionsList";
import Errorable from "global/components/form/Errorable";

class FormBelongsTo extends PureComponent {
  static displayName = "Form.BelongsTo";

  static propTypes = {
    setOther: PropTypes.func,
    selectedLabel: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    value: PropTypes.object,
    getModelValue: PropTypes.func,
    relationName: PropTypes.string,
    errors: PropTypes.array,
    idForError: PropTypes.string,
    focusOnMount: PropTypes.bool,
    renderAttribute: PropTypes.string,
    inputLabel: PropTypes.string,
    searchable: PropTypes.bool
  };

  handleSelect = entity => {
    this.props.setOther(entity, `relationships[${this.props.relationName}]`);
  };

  get selectedOption() {
    return this.props.getModelValue(
      `relationships[${this.props.relationName}]`
    );
  }

  render() {
    return (
      <Errorable
        className="form-input"
        name={`attributes[${this.props.relationName}]`}
        errors={this.props.errors}
        idForError={this.props.idForError}
      >
        <OptionsList
          onSelect={this.handleSelect}
          selectedOption={this.selectedOption}
          mode="single"
          {...this.props}
        />
      </Errorable>
    );
  }
}

export default setter(FormBelongsTo);
