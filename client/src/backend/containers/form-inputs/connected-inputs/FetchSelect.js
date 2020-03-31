import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import find from "lodash/find";
import { UID } from "react-uid";
import { ApiClient } from "api";
import IconComposer from "global/components/utility/IconComposer";

class FetchSelect extends PureComponent {
  static mapStateToProps = state => {
    return {
      authToken: state.authentication.authToken
    };
  };

  static displayName = "Form.FetchSelect";

  static propTypes = {
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selectedLabel: PropTypes.func.isRequired,
    fetch: PropTypes.func,
    fetchOptions: PropTypes.object,
    options: PropTypes.array,
    inputLabel: PropTypes.string,
    authToken: PropTypes.string,
    idForError: PropTypes.string,
    mode: PropTypes.oneOf(["single", "multi"]),
    selectedOption: PropTypes.object,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    fetchOptions: null,
    focusOnMount: false,
    className: "fetch-select",
    mode: "multi"
  };

  constructor(props) {
    super(props);
    this.debouncedUpdateOptions = debounce(this.updateOptions, 500);

    this.state = {
      options: props.options || [],
      selectedValue: props.options ? props.options[0].id : ""
    };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.selectElement) {
      this.selectElement.focus();
    }

    if (this.props.options) return null;
    this.debouncedUpdateOptions(this.props.fetch);
  }

  get multiSelect() {
    return this.props.mode === "multi";
  }

  get idPrefix() {
    return "fetch-select";
  }

  hasOptions(options) {
    if (!options) return false;
    return options.length > 0;
  }

  updateOptions = fetch => {
    const { endpoint, method, options = {} } = fetch({
      ...this.props.fetchOptions
    });

    options.authToken = this.props.authToken;
    options.params = options.params || {};
    options.params.noPagination = true;

    const client = new ApiClient();
    client.call(endpoint, method, options).then(results => {
      const items = results.data;
      this.setState(
        {
          options: items,
          selectedValue: items[0].id
        },
        this.props.onSelect(items[0])
      );
    });
  };

  handleChange = event => {
    const option = find(this.state.options, { id: event.target.value });
    this.setState({ selectedValue: option.id }, this.props.onSelect(option));
  };

  selectAll = () => {
    this.props.onSelect(this.state.options);
  };

  removeAll = () => {
    this.props.onSelect([]);
  };

  renderAddRemoveAll() {
    if (!this.multiSelect) return null;
    if (!this.hasOptions(this.state.options)) return null;

    return (
      <div className="fetch-select__utility utility-button-group utility-button-group--inline">
        <button
          className="utility-button"
          type="button"
          onClick={this.selectAll}
        >
          <IconComposer
            icon="circlePlus32"
            size="default"
            iconClass="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">Add All</span>
        </button>
        <button
          className="utility-button"
          type="button"
          onClick={this.removeAll}
        >
          <IconComposer
            icon="circleMinus32"
            size="default"
            iconClass="utility-button__icon utility-button__icon--notice"
          />
          <span className="utility-button__text">Remove All</span>
        </button>
      </div>
    );
  }

  render() {
    return (
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div className={this.props.className}>
            <label htmlFor={id}>{this.props.inputLabel}</label>
            <div className="form-select">
              <IconComposer
                icon="disclosureDown16"
                size={20}
                iconClass="form-select__icon"
              />
              <select
                id={id}
                onChange={this.handleChange}
                value={this.state.selectedValue}
                ref={input => {
                  this.selectElement = input;
                }}
              >
                {this.state.options.map(option => (
                  <option key={option.id} value={option.id}>
                    {this.props.selectedLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            {this.renderAddRemoveAll()}
          </div>
        )}
      </UID>
    );
  }
}

export default connect(FetchSelect.mapStateToProps)(FetchSelect);
