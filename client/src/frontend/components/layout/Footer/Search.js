import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";

export default class Search extends PureComponent {
  static displayName = "Layout.Footer.Search";

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
    return (
      <form className="search-form" onSubmit={this.doSearch}>
        <div className="search-button-inline">
          <label htmlFor="footer-search" className="screen-reader-text">
            Site Search
          </label>
          <input
            type="text"
            id="footer-search"
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
