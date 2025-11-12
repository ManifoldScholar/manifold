import { useState } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom-v5-compat";
import * as Styled from "./styles";

export default function Search({ withTopMargin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const updateSearchWord = event => {
    setKeyword(event.target.value);
  };

  const doSearch = event => {
    event.preventDefault();
    const path = lh.link("frontendSearch");
    const search = queryString.stringify({ keyword });
    navigate({
      pathname: path,
      search
    });
    setKeyword("");
  };

  return (
    <Styled.Form
      role="search"
      className="search-form"
      $withTopMargin={withTopMargin}
      onSubmit={doSearch}
    >
      <Styled.SearchButton>
        <label htmlFor="app-footer-search" className="screen-reader-text">
          {t("search.global_label")}
        </label>
        <input
          type="text"
          id="app-footer-search"
          placeholder={t("search.title")}
          value={keyword}
          onChange={updateSearchWord}
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

Search.displayName = "Global.Footers.Parts.Search";

Search.propTypes = {
  withTopMargin: PropTypes.bool
};
