import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import * as Styled from "./styles";

function Search({ inputRef }) {
  const uid = useUID();
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.Button type="submit">
        <span className="screen-reader-text">{t("search.title")}</span>
        <Utility.IconComposer icon="search16" size={20} />
      </Styled.Button>
      <label htmlFor={uid} className="screen-reader-text">
        {t("search.instructions")}
      </label>
      <Styled.Input
        type="text"
        id={uid}
        placeholder={t("search.placeholder")}
        ref={inputRef}
      />
    </Styled.Wrapper>
  );
}

Search.displayName = "Global.List.Filters.Search";

Search.propTypes = {
  inputRef: PropTypes.object.isRequired
};

export default Search;
