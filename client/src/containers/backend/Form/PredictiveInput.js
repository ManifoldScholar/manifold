import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import update from "immutability-helper";
import debounce from "lodash/debounce";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import { ApiClient } from "api";

class PredictiveInput extends PureComponent {
  static displayName = "Form.PredictiveInput";

  static mapStateToProps = state => {
    return {
      authToken: state.authentication.authToken
    };
  };

  static propTypes = {
    className: PropTypes.string,
    onNew: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    placeholder: PropTypes.string,
    authToken: PropTypes.string
  };

  static defaultProps = {
    fetchOptions: null
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
    this.id = uniqueId("predictive-input-");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.debouncedUpdateOptions(this.state.value, this.props.fetch);
    }
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
    this.props.onSelect(option);
  }

  handleSelect(event, option) {
    this.select(option);
  }

  render() {
    const classes = classNames(this.props.className, {
      "predictive-open":
        this.state.open === true && this.hasOptions(this.state.options)
    });

    return (
      <div className={classes}>
        <div className="input">
          <button className="manicon manicon-plus" aria-hidden="true" />
          <input
            className="text-input"
            type="text"
            onChange={this.handleChange}
            value={this.state.value}
            placeholder={this.props.placeholder}
            aria-label={this.props.placeholder}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyDown}
          />
          {this.props.onNew ? (
            <button className="submit" onClick={this.handleNew}>
              {"Create New"}
            </button>
          ) : null}
        </div>
        <nav className="predictive-list">
          <ul>
            {this.state.options.map(option => {
              const listingClass = classNames({
                highlighted: option.id === this.state.highlighted
              });
              return (
                /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
                <li
                  key={option.id}
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
        </nav>
      </div>
    );
  }
}

export default connect(PredictiveInput.mapStateToProps)(PredictiveInput);
