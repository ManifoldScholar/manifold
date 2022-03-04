import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function SearchResultsEmpty() {
  const { t } = useTranslation();
  return (
    <Styled.Wrapper>
      <Styled.NoResults role="status" aria-live="polite" aria-atomic>
        {t("search.no_results")}
      </Styled.NoResults>
    </Styled.Wrapper>
  );
}

SearchResultsEmpty.displayName = "Search.Results.Empty";
