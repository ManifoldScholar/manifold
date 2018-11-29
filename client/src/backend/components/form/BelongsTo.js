import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import OptionsList from "./OptionsList";
import GlobalForm from "global/components/form";
import get from "lodash/get";

class FormBelongsTo extends PureComponent {
  static displayName = "Form.BelongsTo";

  static propTypes = {
    setOther: PropTypes.func,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    value: PropTypes.object,
    getModelValue: PropTypes.func,
    relationName: PropTypes.string,
    errors: PropTypes.array,
    idForError: PropTypes.string,
    focusOnMount: PropTypes.bool,
    renderAttribute: PropTypes.string,
    placeholder: PropTypes.string,
    searchable: PropTypes.bool
  };

  handleSelect = entity => {
    this.props.setOther(entity, `relationships[${this.props.relationName}]`);
  };

  renderValue() {
    const model = this.props.getModelValue(
      `relationships[${this.props.relationName}]`
    );

    return get(model, `attributes.${this.props.renderAttribute}`);
  }

  render() {
    return (
      <GlobalForm.Errorable
        className="form-input"
        name={`attributes[${this.props.relationName}]`}
        errors={this.props.errors}
        idForError={this.props.idForError}
      >
        <OptionsList
          onSelect={this.handleSelect}
          selectedValue={this.renderValue()}
          mode="single"
          {...this.props}
        />
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormBelongsTo);
