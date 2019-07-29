import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import ConnectedInputs from "backend/containers/form-inputs/connected-inputs";

class FormOptionsList extends PureComponent {
  static displayName = "Form.OptionsList";

  static propTypes = {
    setOther: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    selectedLabel: PropTypes.func.isRequired,
    options: PropTypes.array,
    fetch: PropTypes.func,
    fetchOptions: PropTypes.object,
    focusOnMount: PropTypes.bool,
    inputLabel: PropTypes.string,
    mode: PropTypes.string,
    selectedValue: PropTypes.string,
    searchable: PropTypes.bool,
    idForLabel: PropTypes.string,
    idForError: PropTypes.string,
    idForInstructions: PropTypes.string
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

  renderStatic(props) {
    return (
      <ConnectedInputs.FetchSelect
        fetch={props.fetch}
        fetchOptions={props.fetchOptions}
        options={props.options}
        inputLabel={props.inputLabel}
        selectedLabel={props.selectedLabel}
        onSelect={this.handleSelect}
        mode={props.mode}
        selectedOption={props.selectedOption}
      />
    );
  }

  renderSearchable(props) {
    return (
      <ConnectedInputs.PredictiveInput
        fetch={props.fetch}
        fetchOptions={props.fetchOptions}
        placeholder={props.inputLabel}
        selectedLabel={props.selectedLabel}
        onSelect={this.handleSelect}
        onNew={props.onNew}
        idForLabel={props.idForLabel}
        idForError={props.idForError}
        idForInstructions={props.idForInstructions}
        focusOnMount={props.focusOnMount}
      />
    );
  }

  render() {
    if (this.props.options) return this.renderStatic(this.props);

    return this.props.searchable
      ? this.renderSearchable(this.props)
      : this.renderStatic(this.props);
  }
}

export default setter(FormOptionsList);
