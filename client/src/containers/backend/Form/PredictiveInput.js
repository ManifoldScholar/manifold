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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.debouncedUpdateOptions = debounce(this.updateOptions, 500);

    this.state = {
      value: "",
      open: false,
      options: []
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
        open: { $set: false }
      });
      this.setState(state);
      return;
    }
    const { endpoint, method, options } = fetch({ name: value });
    options.authToken = this.props.authToken;
    const client = new ApiClient;
    client.call(endpoint, method, options).then((results) => {
      const items = results.data;
      const open = results.data.length > 0 ? true : false;
      const state = update(this.state, {
        open: { $set: open },
        options: { $set: items }
      });
      this.setState(state);
    });
  }

  handleChange(event) {
    const value = event.target.value;
    const set = { value: { $set: value } };
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
      this.submit();
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

  handleSelect(event, option) {
    this.close();
    this.clear();
    this.props.onSelect(option);
  }

  render() {

    const classes = classNames(this.props.className, {
      'autofill-open': this.state.open === true && this.hasOptions(this.state.options)
    });

    return (
      <div className={classes}>

        <button className="manicon manicon-plus"></button>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.value}
          placeholder={this.props.placeholder}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyPress={this.handleKeyPress}
        />
        <button className="new" onClick={this.handleNew} >
          {'Create New'}
        </button>
        <nav className="autofill-list">
          <ul>
            {this.state.options.map((option) => {
              return (
                <li
                  key={option.id}
                  onClick={(event) => { this.handleSelect(event, option); }}
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
