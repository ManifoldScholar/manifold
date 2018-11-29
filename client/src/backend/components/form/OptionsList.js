import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import FormContainer from "backend/containers/form";

class FormOptionsList extends PureComponent {
  static displayName = "Form.OptionsList";

  static propTypes = {
    setOther: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    focusOnMount: PropTypes.bool,
    placeholder: PropTypes.string,
    mode: PropTypes.string,
    selectedValue: PropTypes.string,
    searchable: PropTypes.bool
  };
  static defaultProps = {
    focusOnMount: false,
    searchable: true
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  handleSelect = entity => {
    this.props.onSelect(entity);
  };

  renderOptions(props) {
    return props.searchable
      ? this.renderSearchable(props)
      : this.renderStatic(props);
  }

  renderStatic(props) {
    return (
      <FormContainer.FetchSelect
        fetch={props.fetch}
        fetchOptions={props.fetchOptions}
        placeholder={props.placeholder}
        label={props.label}
        onSelect={this.handleSelect}
        mode={props.mode}
        selectedValue={props.selectedValue}
      />
    );
  }

  renderSearchable(props) {
    return (
      <FormContainer.PredictiveInput
        className="input-predictive"
        fetch={props.fetch}
        fetchOptions={props.fetchOptions}
        placeholder={props.placeholder}
        label={props.label}
        onSelect={this.handleSelect}
        onNew={props.onNew}
        idForError={props.idForError}
        focusOnMount={props.focusOnMount}
      />
    );
  }

  render() {
    return this.renderOptions(this.props);
  }
}

export default setter(FormOptionsList);
