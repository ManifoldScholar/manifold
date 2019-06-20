import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Utility from "global/components/utility";
import { UnmountClosed as Collapse } from "react-collapse";
import classNames from "classnames";
import has from "lodash/has";
import isPlainObject from "lodash/isPlainObject";

export default class ListEntitiesListSearch extends PureComponent {
  static displayName = "List.Entities.List.Search";

  static propTypes = {
    params: PropTypes.array,
    values: PropTypes.object,
    setParam: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    searchStyle: PropTypes.oneOf(["horizontal", "vertical"])
  };

  static defaultProps = {
    params: [],
    values: {},
    searchStyle: "horizontal"
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      keyword: ""
    };
    this.searchInput = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (has(prevProps, "values.keyword")) {
      if (prevProps.values.keyword !== this.props.values.keyword) {
        this.setState({ keyword: this.props.values.keyword });
      }
    }
  }

  onSubmit = event => {
    event.preventDefault();
  };

  get filterParams() {
    return this.params.filter(
      p => !this.reservedNames.includes(p.name) && !p.hidden
    );
  }

  get reservedNames() {
    return ["order", "keyword"];
  }

  get hasFilterParams() {
    return this.filterParams.length > 0;
  }

  get hasOptions() {
    return this.hasFilterParams || this.hasOrderParam;
  }

  get params() {
    return this.props.params;
  }

  get values() {
    return this.props.values;
  }

  get keywordParam() {
    return this.paramByName("keyword");
  }

  get orderParam() {
    return this.paramByName("order");
  }

  get hasOrderParam() {
    return this.hasParam(this.orderParam);
  }

  get hasKeywordParam() {
    return this.hasParam(this.keywordParam);
  }

  get searchStyle() {
    return this.props.searchStyle;
  }

  get idPrefix() {
    return "list-search";
  }

  setKeywordState(event) {
    const value = event.target.value;
    this.setState({ keyword: value });
  }

  setParam(event, paramLike) {
    const param = this.ensureParamObject(paramLike);
    const value = event.target.value;
    const { setParam } = this.props;
    setParam(param, value);
  }

  submitKeywordForm = event => {
    event.preventDefault();
    const { setParam } = this.props;
    setParam(this.keywordParam, this.state.keyword);
  };

  ensureParamObject(param) {
    return isPlainObject(param) ? param : this.paramByName(param);
  }

  paramValue(paramLike) {
    const param = this.ensureParamObject(paramLike);
    return this.values[param.name] || "";
  }

  paramLabel(paramLike) {
    const param = this.ensureParamObject(paramLike);
    return param.label || "";
  }

  paramOptions(paramLike) {
    const param = this.ensureParamObject(paramLike);
    return param.options || [];
  }

  paramByName(paramName) {
    return this.params.find(p => p.name === paramName);
  }

  hasParam(paramLike) {
    const param = this.ensureParamObject(paramLike);
    return isPlainObject(param);
  }

  toggleOptions = event => {
    event.preventDefault();
    this.setState({ open: !this.state.open });
  };

  resetSearch = event => {
    event.preventDefault();
    this.setState({ keyword: "" });
    this.props.onReset();

    // focus on search field
    this.searchInput.current.focus();
  };

  classNameWithStyle(className) {
    return classNames({
      [className]: true,
      [`${className}--horizontal`]: this.searchStyle === "horizontal",
      [`${className}--vertical`]: this.searchStyle === "vertical"
    });
  }

  /* eslint-disable react/no-array-index-key */
  /* these filters never change after render */
  render() {
    const baseClass = "entity-list-search";

    return (
      <div className={`entity-list__search ${baseClass}`}>
        {this.hasKeywordParam && (
          <form onSubmit={this.submitKeywordForm}>
            <div className={`${baseClass}__keyword-row`}>
              <button className={`${baseClass}__search-button`}>
                <Utility.IconComposer
                  iconClass="manicon-magnify"
                  icon="search16"
                />
                <span className="screen-reader-text">Search</span>
              </button>
              <div className={`${baseClass}__keyword-input-wrapper`}>
                <UID name={id => `${this.idPrefix}-${id}`}>
                  {id => (
                    <React.Fragment>
                      <label htmlFor={id} className="screen-reader-text">
                        Enter Search Criteria
                      </label>
                      <input
                        ref={this.searchInput}
                        className={`${baseClass}__keyword-input`}
                        id={id}
                        value={this.state.keyword}
                        type="text"
                        placeholder={this.paramLabel(this.keywordParam)}
                        onChange={e => this.setKeywordState(e)}
                      />
                    </React.Fragment>
                  )}
                </UID>
              </div>
              <button
                onClick={this.resetSearch}
                className={`${baseClass}__text-button`}
              >
                Reset
              </button>
              {this.hasOptions && (
                <button
                  onClick={this.toggleOptions}
                  className={`${baseClass}__text-button ${baseClass}__text-button--foregrounded`}
                  aria-haspopup
                  aria-expanded={this.state.open}
                >
                  Options
                </button>
              )}
            </div>
          </form>
        )}
        {this.hasOptions && (
          <Collapse isOpened={this.state.open}>
            <div>
              <div className={this.classNameWithStyle(`${baseClass}__options`)}>
                {this.filterParams.map((param, i) => (
                  <div
                    key={i}
                    className={this.classNameWithStyle(`${baseClass}__option`)}
                  >
                    <div className={`${baseClass}__option-inner`}>
                      <span
                        className={`${baseClass}__options-label ${
                          i > 0 ? `${baseClass}__options-label--empty` : ""
                        }`}
                      >
                        {i === 0 ? "Filter Results:" : "\u00A0"}
                      </span>
                      <div className={`${baseClass}__select-wrapper`}>
                        <UID name={id => `${this.idPrefix}-${id}`}>
                          {id => (
                            <select
                              id={id}
                              onChange={e => this.setParam(e, param)}
                              value={this.paramValue(param)}
                            >
                              {this.paramOptions(param).map(
                                (option, optionIndex) => (
                                  <option
                                    key={optionIndex}
                                    value={option.value || ""}
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        </UID>
                        <Utility.IconComposer icon="disclosureDown24" />
                      </div>
                    </div>
                  </div>
                ))}
                {this.hasOrderParam && (
                  <div
                    className={this.classNameWithStyle(`${baseClass}__option`)}
                  >
                    <div className={`${baseClass}__option-inner`}>
                      <span className={`${baseClass}__options-label`}>
                        Order Results:
                      </span>
                      <div className={`${baseClass}__select-wrapper`}>
                        <UID name={id => `${this.idPrefix}-${id}`}>
                          {id => (
                            <select
                              id={id}
                              onChange={e => this.setParam(e, this.orderParam)}
                              value={this.paramValue(this.orderParam)}
                            >
                              {this.paramOptions(this.orderParam).map(
                                (option, optionIndex) => (
                                  <option
                                    key={optionIndex}
                                    value={option.value || ""}
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        </UID>
                        <Utility.IconComposer icon="disclosureDown24" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Collapse>
        )}
      </div>
    );
  }
}
