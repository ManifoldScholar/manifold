import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function SearchResultsEmpty({
  messageKey = "search.no_results"
}) {
  const { t } = useTranslation();
  return (
    <Styled.Wrapper>
      <Styled.NoResults role="status">{t(messageKey)}</Styled.NoResults>
    </Styled.Wrapper>
  );
}

SearchResultsEmpty.displayName = "Search.Results.Empty";

SearchResultsEmpty.propTypes = {
  messageKey: PropTypes.string
};
