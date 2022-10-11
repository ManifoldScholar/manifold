import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class Search extends PureComponent {
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
    const { t } = this.props;

    return (
      <Styled.Form
        role="search"
        className="search-form"
        $withTopMargin={this.props.withTopMargin}
        onSubmit={this.doSearch}
      >
        <Styled.SearchButton>
          <label htmlFor="app-footer-search" className="screen-reader-text">
            {t("search.global_label")}
          </label>
          <input
            type="text"
            id="app-footer-search"
            placeholder={t("search.title")}
            value={this.state.keyword}
            onChange={this.updateSearchWord}
          />
          <button className="icon">
            <Utility.IconComposer
              className="search-icon"
              icon="search16"
              size={20}
            />
            <span className="screen-reader-text">{t("search.title")}</span>
          </button>
        </Styled.SearchButton>
      </Styled.Form>
    );
  }
}

export default withTranslation()(Search);
