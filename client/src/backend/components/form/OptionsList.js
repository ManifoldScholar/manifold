import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ConnectedInputs from "backend/containers/form-inputs/connected-inputs";
import setter from "./setter";

class FormOptionsList extends PureComponent {
  static defaultProps = {
    focusOnMount: false,
    searchable: true
  };

  static displayName = "Form.OptionsList";

  static propTypes = {
    setOther: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    options: PropTypes.array,
    fetch: PropTypes.func,
    fetchOptions: PropTypes.object,
    focusOnMount: PropTypes.bool,
    placeholder: PropTypes.string,
    mode: PropTypes.string,
    selectedValue: PropTypes.string,
    searchable: PropTypes.bool
  };

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  handleSelect = entity => {
    this.props.onSelect(entity);
  };

  renderSearchable(props) {
    return (
      <ConnectedInputs.PredictiveInput
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

  renderStatic(props) {
    return (
      <ConnectedInputs.FetchSelect
        fetch={props.fetch}
        fetchOptions={props.fetchOptions}
        options={props.options}
        placeholder={props.placeholder}
        label={props.label}
        onSelect={this.handleSelect}
        mode={props.mode}
        selectedValue={props.selectedValue}
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
