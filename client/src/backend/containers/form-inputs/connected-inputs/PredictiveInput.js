import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import classNames from "classnames";
import { ApiClient } from "api";
import { UID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

class PredictiveInput extends PureComponent {
  static mapStateToProps = state => {
    return {
      authToken: state.authentication.authToken
    };
  };

  static displayName = "Form.PredictiveInput";

  static propTypes = {
    onNew: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    placeholder: PropTypes.string,
    authToken: PropTypes.string,
    idForError: PropTypes.string,
    idForInstructions: PropTypes.string,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    fetchOptions: null,
    focusOnMount: false
  };

  constructor(props) {
    super(props);
    this.debouncedUpdateOptions = debounce(this.updateOptions, 500);

    this.state = {
      value: "",
      open: false,
      options: [],
      highlighted: false
    };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.debouncedUpdateOptions(this.state.value, this.props.fetch);
    }
  }

  get ariaDescribedBy() {
    const { idForError, idForInstructions } = this.props;

    if (!idForError && !idForInstructions) return null;

    return [idForError, idForInstructions].filter(Boolean).join(" ");
  }

  get idPrefix() {
    return "predictive-input";
  }

  getHighlightedOption(list, id) {
    return list.filter(item => {
      return item.id === id;
    })[0];
  }

  getOptionOrdinal(list, id) {
    return list
      .map(item => {
        return item.id;
      })
      .indexOf(id);
  }

  clear() {
    const state = update(this.state, { value: { $set: "" } });
    this.setState(state);
  }

  close() {
    const state = update(this.state, { open: { $set: false } });
    this.setState(state);
  }

  open() {
    const state = update(this.state, { open: { $set: true } });
    this.setState(state);
  }

  handleFocus = eventIgnored => {
    this.open();
  };

  hasOptions(options) {
    if (!options) return false;
    return options.length > 0;
  }

  handleKeyPress = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Otherwise, submit a new one
      if (this.state.highlighted) {
        const selected = this.getHighlightedOption(
          this.state.options,
          this.state.highlighted
        );
        this.select(selected);
      } else {
        this.submit();
      }
    }
  };

  handleBlur = eventIgnored => {
    setTimeout(() => {
      this.close();
    }, 250);
  };

  handleChange = event => {
    const value = event.target.value;
    const set = {
      value: { $set: value },
      highlighted: { $set: false }
    };
    if (value === "") set.open = { $set: false };
    const state = update(this.state, set);
    this.setState(state);
  };

  updateOptions = (value, fetch) => {
    if (value === "") {
      const state = update(this.state, {
        options: { $set: [] },
        highlighted: { $set: false },
        open: { $set: false }
      });
      this.setState(state);
      return;
    }
    const { endpoint, method, options } = fetch({
      keyword: value,
      typeahead: true,
      ...this.props.fetchOptions
    });
    options.authToken = this.props.authToken;
    const client = new ApiClient();
    client.call(endpoint, method, options).then(results => {
      const items = results.data;
      const open = results.data.length > 0;
      // Check to see if key-selected option is still available
      const selected = this.getHighlightedOption(items, this.state.highlighted);
      const state = update(this.state, {
        open: { $set: open },
        options: { $set: items },
        highlighted: { $set: selected || false }
      });
      this.setState(state);
    });
  };

  clearHighlighted = eventIgnored => {
    this.setState({
      highlighted: false
    });
  };

  handleKeyDown = event => {
    const highlighted = this.state.highlighted;
    const options = this.state.options;
    // Only track keystate if there are options
    // to be highlighted

    if (options.length > 0) {
      // If the down key is pressed...
      if (event.key === "ArrowDown") {
        event.preventDefault();
        // If nothing has been highlighted, select
        // the first option
        if (!highlighted) {
          this.setState({
            highlighted: options[0].id
          });
        } else {
          const nextOrdinal = this.getOptionOrdinal(options, highlighted) + 1;
          if (nextOrdinal < options.length) {
            this.setState({
              highlighted: options[nextOrdinal].id
            });
          }
        }
      } else if (event.key === "ArrowUp" && highlighted) {
        // If the up key is pressed... (highlighted only)
        event.preventDefault();
        const prevOrdinal = this.getOptionOrdinal(options, highlighted) - 1;
        if (prevOrdinal >= 0) {
          this.setState({
            highlighted: options[prevOrdinal].id
          });
        } else if (prevOrdinal === -1) {
          this.setState({
            highlighted: false
          });
        }
      }
    }
  };

  handleNew = event => {
    event.preventDefault();
    this.submit();
  };

  submit() {
    this.props.onNew(this.state.value);
    this.close();
    this.clear();
  }

  select(option) {
    this.close();
    this.clear();
    if (this.inputElement) {
      this.inputElement.focus();
    }
    this.props.onSelect(option);
    this.props.setScreenReaderStatus(`${this.props.label(option)} added.`);
  }

  handleSelect(event, option) {
    this.select(option);
  }

  renderInput(id) {
    // aria-controls` is placed on input in this case rather than combobox
    /* eslint-disable jsx-a11y/role-has-required-aria-props */
    return (
      <div
        role="combobox"
        aria-expanded={this.state.options.length > 0}
        aria-owns={`${id}-listbox`}
        aria-haspopup="listbox"
        className="input-predictive__input"
      >
        <input
          ref={input => {
            this.inputElement = input;
          }}
          className="input-predictive__text-input text-input"
          type="text"
          onChange={this.handleChange}
          value={this.state.value}
          placeholder={this.props.placeholder}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
          aria-describedby={this.ariaDescribedBy}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={this.state.highlighted || null}
        />
        {this.props.onNew ? (
          <button
            type="button"
            aria-hidden="true"
            onClick={this.handleNew}
            className="input-predictive__button"
          >
            <IconComposer
              icon="plus16"
              size={20}
              iconClass="input-predictive__icon"
            />
          </button>
        ) : null}
      </div>
    );
    /* eslint-enable jsx-a11y/role-has-required-aria-props */
  }

  renderResults(id) {
    return (
      <ul
        aria-label={this.props.placeholder}
        role="listbox"
        id={`${id}-listbox`}
        className="input-predictive__results"
      >
        {this.state.options.map(option => {
          const listingClass = classNames("input-predictive__result", {
            highlighted: option.id === this.state.highlighted
          });
          return (
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
            <li
              key={option.id}
              role="option"
              id={option.id}
              aria-selected={option.id === this.state.highlighted}
              className={listingClass}
              onClick={event => {
                this.handleSelect(event, option);
              }}
              onMouseOver={event => {
                this.clearHighlighted(event);
              }}
            >
              {this.props.label(option)}
            </li>
            /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
          );
        })}
      </ul>
    );
  }

  render() {
    const wrapperClasses = classNames({
      "input-predictive": true,
      "input-predictive--open":
        this.state.open === true && this.hasOptions(this.state.options)
    });

    return (
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div className={wrapperClasses}>
            {this.renderInput(id)}
            {this.renderResults(id)}
          </div>
        )}
      </UID>
    );
  }
}

export default connect(PredictiveInput.mapStateToProps)(
  withScreenReaderStatus(PredictiveInput)
);
