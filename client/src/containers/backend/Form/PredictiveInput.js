import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { ApiClient } from 'api';

class PredictiveInput extends PureComponent {

  static displayName = "Form.PredictiveInput";

  static mapStateToProps(state) {
    return {
      authToken: state.authentication.authToken
    };
  }

  static propTypes = {
    className: PropTypes.string,
    onNew: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    placeholder: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearHighlighted = this.clearHighlighted.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.debouncedUpdateOptions = debounce(this.updateOptions, 500);

    this.state = {
      value: "",
      open: false,
      options: [],
      highlighted: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.value !== this.state.value) {
      this.debouncedUpdateOptions(nextState.value, nextProps.fetch);
    }
  }

  updateOptions(value, fetch) {
    if (value === "") {
      const state = update(this.state, {
        options: { $set: [] },
        highlighted: { $set: false },
        open: { $set: false }
      });
      this.setState(state);
      return;
    }
    const { endpoint, method, options } = fetch({ keyword: value, typeahead: true });
    options.authToken = this.props.authToken;
    const client = new ApiClient;
    client.call(endpoint, method, options).then((results) => {
      const items = results.data;
      const open = results.data.length > 0 ? true : false;
      // Check to see if key-selected option is still available
      const selected = this.getHighlightedOption(items, this.state.highlighted);
      const state = update(this.state, {
        open: { $set: open },
        options: { $set: items },
        highlighted: { $set: selected ? selected : false }
      });
      this.setState(state);
    });
  }

  handleChange(event) {
    const value = event.target.value;
    const set = {
      value: { $set: value },
      highlighted: { $set: false }
    };
    if (value === "") set.open = { $set: false };
    const state = update(this.state, set);
    this.setState(state);
  }

  handleBlur(event) {
    setTimeout(() => {
      this.close();
    }, 250);
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

  handleFocus(event) {
    this.open();
  }

  hasOptions(options) {
    if (!options) return false;
    return options.length > 0;
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Otherwise, submit a new one
      if (this.state.highlighted) {
        const selected = this.getHighlightedOption(this.state.options, this.state.highlighted);
        this.select(selected);
      } else {
        this.submit();
      }
    }
  }

  getOptionOrdinal(list, id) {
    return list.map((item) => { return item.id; }).indexOf(id);
  }

  getHighlightedOption(list, id) {
    return list.filter((item) => { return item.id === id; })[0];
  }

  clearHighlighted(event) {
    this.setState({
      highlighted: false
    });
  }

  handleKeyDown(event) {
    const highlighted = this.state.highlighted;
    const options = this.state.options;
    // Only track keystate if there are options
    // to be highlighted

    if (options.length > 0) {
      // If the down key is pressed...
      if (event.key === 'ArrowDown') {
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
      } else if (event.key === 'ArrowUp' && highlighted) {
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
  }

  handleNew(event) {
    event.preventDefault();
    this.submit();
  }

  submit() {
    this.props.onNew(this.state.value);
    this.close();
    this.clear();
  }

  select(option) {
    this.close();
    this.clear();
    this.props.onSelect(option);
  }

  handleSelect(event, option) {
    this.select(option);
  }

  render() {

    const classes = classNames(this.props.className, {
      'predictive-open': this.state.open === true && this.hasOptions(this.state.options)
    });

    return (
      <div className={classes}>
        <div className="input">
          <button className="manicon manicon-plus"></button>
          <input
            className="text-input"
            type="text"
            onChange={this.handleChange}
            value={this.state.value}
            placeholder={this.props.placeholder}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyDown}
          />
          <button className="submit" onClick={this.handleNew} >
            {'Create New'}
          </button>
        </div>
        <nav className="predictive-list">
          <ul>
            {this.state.options.map((option) => {
              const listingClass = classNames({
                highlighted: option.id === this.state.highlighted
              });
              return (
                <li
                  key={option.id}
                  className={listingClass}
                  onClick={(event) => { this.handleSelect(event, option); }}
                  onMouseOver={(event) => { this.clearHighlighted(event); }}
                >
                  {this.props.label(option)}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect(
  PredictiveInput.mapStateToProps
)(PredictiveInput);
