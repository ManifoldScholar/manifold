import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import classNames from "classnames";
import { ApiClient } from "api";

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
    label: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    fetchOptions: PropTypes.object,
    placeholder: PropTypes.string,
    authToken: PropTypes.string,
    idForError: PropTypes.string,
    focusOnMount: PropTypes.bool
  };

  static defaultProps = {
    fetchOptions: null,
    focusOnMount: false,
    className: "fetch-select"
  };

  constructor(props) {
    super(props);
    this.debouncedUpdateOptions = debounce(this.updateOptions, 500);

    this.state = {
      open: false,
      options: [],
      highlighted: null
    };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.selectElement) {
      this.selectElement.focus();
    }

    this.debouncedUpdateOptions(this.props.fetch);
  }

  getHighlightedOption(list, id) {
    return list.filter(item => {
      return item.id === id;
    })[0];
  }

  clearHighlighted = eventIgnored => {
    this.setState({
      highlighted: null
    });
  };

  toggle = () => {
    this.state.open ? this.close() : this.open();
  };

  close = () => {
    this.setState({ open: false });
  };

  open = () => {
    this.setState({ open: true }, this.resetListPosition);
  };

  resetListPosition = () => {
    if (!this._list) return null;
    return (this._list.scrollTop = 0);
  };

  hasOptions(options) {
    if (!options) return false;
    return options.length > 0;
  }

  updateOptions = fetch => {
    const { endpoint, method, options } = fetch({ ...this.props.fetchOptions });

    options.authToken = this.props.authToken;
    options.params = options.params || {};
    options.params.noPagination = true;

    const client = new ApiClient();
    client.call(endpoint, method, options).then(results => {
      const items = results.data;
      // Check to see if key-selected option is still available
      const selected = this.getHighlightedOption(items, this.state.highlighted);
      this.setState({
        options: items,
        highlighted: selected || null
      });
    });
  };

  select(option) {
    this.close();
    this.props.onSelect(option);
  }

  handleSelect(event, option) {
    this.select(option);
  }

  selectAll = () => {
    this.select(this.state.options);
  };

  removeAll = () => {
    this.select([]);
  };

  renderAddRemoveAll() {
    if (!this.hasOptions(this.state.options)) return null;

    return (
      <div className="button-row">
        <button
          className="button-bare-primary add-button"
          type="button"
          onClick={this.selectAll}
        >
          <i className="manicon manicon-plus-bold" />
          Add All
        </button>
        <button
          className="button-bare-primary remove-button"
          type="button"
          onClick={this.removeAll}
        >
          <i className="manicon manicon-minus-bold" />
          Remove All
        </button>
      </div>
    );
  }

  render() {
    const listClasses = classNames(this.props.className, {
      "fetch-select-open":
        this.state.open === true && this.hasOptions(this.state.options)
    });

    return (
      <nav className={listClasses}>
        <div
          role="button"
          className="fetch-select-trigger"
          onClick={this.toggle}
          ref={e => (this.selectElement = e)}
        >
          {this.props.placeholder}
          <i className="manicon manicon-caret-down" />
        </div>
        <ul ref={e => (this._list = e)}>
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
                onMouseOver={this.clearHighlighted}
              >
                {this.props.label(option)}
              </li>
              /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
            );
          })}
        </ul>
        {this.renderAddRemoveAll()}
      </nav>
    );
  }
}

export default connect(FetchSelect.mapStateToProps)(FetchSelect);
