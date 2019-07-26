import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class Search extends PureComponent {

  static displayName = "Global.Footers.Parts.Search";

  static propTypes = {
    push: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      keyword: ""
    };
  }

  updateSearchWord = event => {
    this.setState({ keyword: event.target.value });
  };

  doSearch = event => {
    event.preventDefault();
    const path = lh.link("frontendSearch");
    this.props.push(path, {
      searchQueryState: { keyword: this.state.keyword }
    });
    this.setState({ keyword: "" });
  };

  render() {

    const containerClasses = classNames(
      "app-footer-search-form",
      "search-form",
      {
        "app-footer-search-form--with-top-margin": this.props.withTopMargin
      }
    );


    return (
      <form className={containerClasses} onSubmit={this.doSearch}>
        <div className="search-button-inline">
          <label htmlFor="app-footer-search" className="screen-reader-text">
            Site Search
          </label>
          <input
            type="text"
            id="app-footer-search"
            placeholder="Search"
            value={this.state.keyword}
            onChange={this.updateSearchWord}
          />
          <button className="icon">
            <Utility.IconComposer
              className="search-icon"
              icon="search16"
              size={20}
            />
            <span className="screen-reader-text">Search</span>
          </button>
        </div>
      </form>
    );
  }
}
