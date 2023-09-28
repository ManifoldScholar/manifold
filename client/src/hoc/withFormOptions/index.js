import React, { Component } from "react";
import PropTypes from "prop-types";
import isNumber from "lodash/isNumber";
import has from "lodash/has";
import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import startsWith from "lodash/startsWith";
import isBoolean from "lodash/isBoolean";
import isNil from "lodash/isNil";
import keyBy from "lodash/keyBy";
import setter from "global/components/form/setter";
import { ApiClient } from "api";
import { isPromise } from "utils/promise";
import Authorization from "helpers/authorization";
import { connect } from "react-redux";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withFormOptions(WrappedComponent) {
  const displayName = `HigherOrder.WithFormOptions('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFormOptions extends Component {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static mapStateToProps = state => {
      return {
        authentication: state.authentication
      };
    };

    /* See the Form.Picker component for documentation of most of these props */
    static propTypes = {
      name: PropTypes.string.isRequired,
      set: PropTypes.func.isRequired,
      updateOptions: PropTypes.func,
      options: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              instructions: PropTypes.string,
              value: PropTypes.any.isRequired
            }),
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              attributes: PropTypes.object
            })
          ])
        ),
        PropTypes.func
      ]).isRequired,
      value: PropTypes.any,
      predictive: PropTypes.bool,
      optionToLabel: PropTypes.func,
      optionToValue: PropTypes.func,
      optionToInstructions: PropTypes.func,
      optionToString: PropTypes.func,
      newToValue: PropTypes.func,
      beforeOnChange: PropTypes.func,
      beforeSetValue: PropTypes.func,
      beforeGetValue: PropTypes.func,
      optionFilter: PropTypes.func,
      belongsTo: PropTypes.bool
    };

    static defaultProps = {
      options: [],
      optionFilter: WithFormOptions.optionFilter,
      optionToLabel: WithFormOptions.optionToLabel,
      optionToValue: WithFormOptions.passthrough,
      optionToInstructions: WithFormOptions.optionToInstructions,
      optionToString: WithFormOptions.valueToString,
      newToValue: WithFormOptions.passthrough,
      beforeOnChange: WithFormOptions.passthrough,
      beforeSetValue: WithFormOptions.passthrough,
      beforeGetValue: WithFormOptions.passthrough,
      predictive: false,
      allowNew: false,
      belongsTo: false
    };

    static passthrough(value) {
      return value;
    }

    static optionFilter(searchWord, option) {
      return startsWith(option.label.toLowerCase(), searchWord.toLowerCase());
    }

    static optionToLabel(value) {
      if (WithFormOptions.isSimpleValue(value)) return value.toString();
      if (WithFormOptions.hasResourceShape(value))
        return `${value.type} - ${value.id}`;
    }

    static valueToString(value) {
      if (WithFormOptions.isSimpleValue(value)) return value.toString();
      if (WithFormOptions.hasResourceShape(value)) return value.id;
    }

    static optionToInstructions(_valueIgnored) {
      return null;
    }

    static isSimpleValue(value) {
      return isString(value) || isNumber(value) || isBoolean(value);
    }

    static hasOptionShape(option) {
      return has(option, "label") && has(option, "value");
    }

    static hasResourceShape(option) {
      return has(option, "id");
    }

    static rawOptionToOption(rawOption) {
      if (WithFormOptions.hasOptionShape(rawOption))
        return {
          label: rawOption.label,
          instructions: rawOption.instructions,
          originalValue: rawOption.value
        };
      return {
        label: null,
        instructions: null,
        originalValue: rawOption
      };
    }

    static enhanceOption(option, props) {
      const originalValue = props.optionToValue(option.originalValue);
      const value = props.optionToString(originalValue);
      const enhancements = { originalValue, value };

      if (isNil(option.label)) {
        enhancements.label = props.optionToLabel(option.originalValue);
      }
      if (isNil(option.instructions)) {
        enhancements.instructions = props.optionToInstructions(
          option.originalValue
        );
      }
      if (isNil(option.key)) enhancements.key = enhancements.value;
      return Object.assign(option, enhancements);
    }

    static deriveStateFromOptions(optionsIn, props) {
      const options = Array.isArray(optionsIn)
        ? optionsIn.map(rawOption => {
            return WithFormOptions.enhanceOption(
              WithFormOptions.rawOptionToOption(rawOption),
              props
            );
          })
        : [];
      const valueMap = keyBy(options, "value");
      const labelMap = keyBy(options, "label");
      return { options, valueMap, labelMap };
    }

    static getDerivedStateFromProps(props, state) {
      if (state.rawOptions === props.options) return null;
      if (isFunction(props.options)) {
        return null;
      }
      return WithFormOptions.deriveStateFromOptions(props.options, props);
    }

    constructor(props) {
      super(props);
      this.authorization = new Authorization();
      this.state = {
        announcement: null,
        rawOptions: null,
        options: [],
        valueMap: null,
        labelMap: null,
        activeOption: null,
        searchWord: null
      };
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.options !== this.props.options) {
        if (this.canFetchOptions) this.fetchOptions();
      }
      if (prevState.searchWord !== this.state.searchWord) {
        this.handleSearchWordChange();
      }
    }

    componentDidMount() {
      if (this.canFetchOptions) this.fetchOptions();
    }

    componentWillUnmount() {
      this.unmounting = true;
    }

    get childProps() {
      const childProps = {
        select: this.select,
        value: this.currentValue,
        onChange: this.onChange,
        allowNew: this.allowsNew,
        isMultiple: this.isMultiple,
        options: this.optionsForWrappedComponent,
        optionsMeta: this.optionsMeta,
        optionsHandlers: this.optionsHandlers,
        filteredOptions: this.optionsForWrappedComponent
      };
      return childProps;
    }

    get optionsForWrappedComponent() {
      if (this.filterOptionsInternally) return this.filteredOptions;
      return this.unfilteredOptions;
    }

    get optionsHandlers() {
      return {
        originalOnChange: this.props.onChange,
        originalSet: this.props.set,
        toggleOption: this.toggleOptionSelection,
        activateOption: this.activateOption,
        activateOptionByValue: this.activateOptionByValue,
        filterOptions: this.updateSearchWord,
        deselect: this.deselect,
        reorderSelection: this.reorderSelection,
        selectAll: this.selectAll,
        unselectAll: this.unselectAll
      };
    }

    get isPredictive() {
      return this.props.predictive === true;
    }

    get isBelongsTo() {
      return this.props.belongsTo === true;
    }

    get optionsMeta() {
      const activeOption = this.activeOption;
      const selectedOptions = this.selectedOptions;
      return {
        activeOption,
        selectedOptions,
        value: this.currentValue,
        stringValue: this.props.optionToString(this.currentValue),
        allOptions: this.unfilteredOptions,
        announcement: this.state.announcement
      };
    }

    get isMultiple() {
      return Array.isArray(this.currentValue);
    }

    get activeOption() {
      if (isNil(this.state.activeOption)) return null;
      return this.state.activeOption;
    }

    get currentValue() {
      return this.props.beforeGetValue(this.props.value);
    }

    get selectedOptions() {
      const values = this.isMultiple
        ? this.currentValue
        : [this.currentValue].filter(i => i);
      return values
        .map(v => this.findOption(this.props.optionToString(v)))
        .filter(i => i);
    }

    get filterOptionsInternally() {
      return isNil(this.props.updateOptions);
    }

    get unfilteredOptions() {
      return this.state.options;
    }

    get canFetchOptions() {
      return isFunction(this.props.options);
    }

    get filteredOptions() {
      const { searchWord } = this.state;
      if (!searchWord || searchWord === "") return this.unfilteredOptions;
      return this.unfilteredOptions.filter(option =>
        this.props.optionFilter(searchWord, option)
      );
    }

    fetchOptions() {
      const { endpoint, method, options = {} } = this.props.options();

      options.authToken = this.props.authentication.authToken;
      options.params = options.params || {};
      options.params.noPagination = true;

      const client = new ApiClient();
      client.call(endpoint, method, options).then(results => {
        if (this.unmounting) return;
        const resources = results.data;
        const newState = this.constructor.deriveStateFromOptions(
          resources,
          this.props
        );
        this.setState(newState);
      });
    }

    handleSearchWordChange() {
      if (this.filterOptionsInternally) return;
      this.props.updateOptions(this.state.searchWord);
    }

    findOption(value) {
      const stringValue = this.constructor.valueToString(value);
      const byValue = has(this.state.valueMap, stringValue)
        ? this.state.valueMap[stringValue]
        : null;
      if (byValue || !this.isPredictive) return byValue;
      return has(this.state.labelMap, value)
        ? this.state.labelMap[value]
        : null;
    }

    selectToOriginalValue(select) {
      const option = this.findOption(select);
      return option ? option.originalValue : null;
    }

    get allowsNew() {
      const { allowNew } = this.props;
      if (typeof allowNew === "boolean") return allowNew;
      return this.authorization.authorizeAbility({
        authentication: this.props.authentication,
        entity: allowNew.entity,
        ability: allowNew.ability
      });
    }

    valueToLabel(value) {
      const option = this.findOption(value);
      if (!option || !option.label) return value;
      return option.label;
    }

    toggleOptionSelection = value => {
      const originalValue = this.selectToOriginalValue(value);
      if (this.isSelected(originalValue)) {
        this.deselect(originalValue);
      } else {
        this.select(value);
      }
    };

    select = value => {
      const originalValue = this.selectToOriginalValue(value);
      if (originalValue == null && this.allowsNew && value)
        return this.newThenSelectValue(value);
      return this.addOrReplaceSelection(originalValue);
    };

    deselect = value => {
      if (!this.isMultiple) {
        if (this.currentValue === value) return this.replaceSelection(null);
      }
      const newValue = this.currentValue.filter(
        compareValue => !this.doValuesMatch(value, compareValue)
      );
      if (newValue.length !== this.currentValue.length) {
        this.announceDeselection(value);
      }
      this.replaceSelection(newValue);
    };

    newThenSelectValue = inputValue => {
      const value = this.props.newToValue(inputValue);
      if (!isPromise(value)) return this.addOrReplaceSelection(value);
      value
        .then(this.addOrReplaceSelection.bind(this), () => {
          // noop
        })
        .then(
          () => {
            if (this.canFetchOptions) this.fetchOptions();
          },
          () => {
            // noop
          }
        );
    };

    addOrReplaceSelection(value) {
      this.announceSelection(value);
      this.isMultiple
        ? this.appendSelection(value)
        : this.replaceSelection(value);
    }

    appendSelection(value) {
      if (value === null) return;
      if (this.currentValue.includes(value)) return;
      const newValue = [...this.currentValue, value];
      this.replaceSelection(newValue);
    }

    replaceSelection(value) {
      this.props.set(this.props.beforeSetValue(value));
    }

    reorderSelection = ({ id, position }) => {
      const thingToMove = this.currentValue.find(
        thing => this.props.optionToString(thing) === id
      );
      const newCollection = this.currentValue.filter(
        thing => thing !== thingToMove
      );
      let insertIndex;
      switch (position) {
        case "top":
          insertIndex = 0;
          break;
        case "bottom":
          insertIndex = newCollection.length - 1;
          break;
        default:
          insertIndex = position - 1;
      }
      newCollection.splice(insertIndex, 0, thingToMove);
      this.replaceSelection(newCollection);
    };

    selectAll = () => {
      if (!this.isMultiple) return;
      const values = this.filteredOptions.map(option => option.originalValue);
      this.replaceSelection(values);
    };

    unselectAll = () => {
      const nullValue = this.isBelongsTo ? { _remove: true } : null;
      this.replaceSelection(this.isMultiple ? [] : nullValue);
    };

    announceDeselection(value) {
      const announcement = `${this.valueToLabel(value)} was deselected`;
      this.setState({ announcement });
    }

    announceSelection(value) {
      const announcement = `${this.valueToLabel(value)} was selected`;
      this.setState({ announcement });
    }

    isSelected = value => {
      if (!this.isMultiple) return this.currentValue === value;
      if (this.isMultiple)
        return this.currentValue.some(compareValue =>
          this.doValuesMatch(value, compareValue)
        );
    };

    doValuesMatch(value, compareValue) {
      if (value === compareValue) return true;
      return (
        this.constructor.valueToString(value) ===
        this.constructor.valueToString(compareValue)
      );
    }

    onChange = event => {
      const value = event.target.value === "" ? null : event.target.value;
      const res = this.props.beforeOnChange(this.currentValue, value, event);
      if (!isPromise(res)) return this.select(value);
      res.then(
        () => {
          return this.select(value);
        },
        () => {
          // Do nothing!
        }
      );
    };

    activateOptionByValue = value => {
      this.setState({ activeOption: this.findOption(value) });
    };

    activateOption = option => {
      this.setState({ activeOption: option });
    };

    updateSearchWord = searchWord => {
      this.setState({ searchWord: searchWord ? searchWord.trim() : null });
    };

    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        ...this.childProps
      });
    }
  }

  return connect(WithFormOptions.mapStateToProps)(setter(WithFormOptions));
}

export default withFormOptions;
