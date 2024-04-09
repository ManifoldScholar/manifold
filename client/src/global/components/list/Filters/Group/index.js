import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Search from "../Search";
import Filter from "../Filter";
import * as Styled from "./styles";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function FiltersGroup(props) {
  const {
    filters,
    hideSearch = false,
    updateFilterState,
    onReset,
    showReset,
    setScreenReaderStatus,
    className,
    visibleLabels = false
  } = props;

  const searchInput = useRef(null);

  const { t } = useTranslation();

  const handleReset = () => {
    onReset();
    setScreenReaderStatus(t("filters.reset_announcement"));
    if (searchInput.current) {
      searchInput.current.value = "";
    }
  };

  const onSubmit = e =>
    updateFilterState(e, "keyword", searchInput.current.value);

  /* eslint-disable no-nested-ternary */
  const resetLabel =
    filters?.length && !hideSearch
      ? t("filters.reset_search_and_filters")
      : filters?.length
      ? t("filters.reset_filters")
      : t("filters.reset_search");
  /* eslint-disable no-nested-ternary */

  return (
    <Styled.Wrapper
      as={onSubmit ? "form" : "div"}
      role={onSubmit ? "search" : null}
      onSubmit={onSubmit}
      $count={filters?.length || 0}
      $searchCount={hideSearch ? 0 : 1}
      className={className}
    >
      {!hideSearch && <Search inputRef={searchInput} />}
      {!!filters?.length && (
        <Styled.SelectGroup $count={filters?.length}>
          {filters.map(filter => (
            <Filter
              key={filter.label}
              visibleLabel={visibleLabels}
              {...filter}
            />
          ))}
        </Styled.SelectGroup>
      )}
      {showReset && (
        <Styled.ResetButton type="reset" onClick={handleReset}>
          {resetLabel}
        </Styled.ResetButton>
      )}
    </Styled.Wrapper>
  );
}

FiltersGroup.displayName = "Global.List.Filters.FiltersGroup";

FiltersGroup.propTypes = {
  onReset: PropTypes.func,
  showReset: PropTypes.bool,
  filters: PropTypes.array,
  updateFilterState: PropTypes.func,
  hideSearch: PropTypes.bool,
  setScreenReaderStatus: PropTypes.func,
  className: PropTypes.string,
  visibleLabels: PropTypes.bool
};

export default withScreenReaderStatus(FiltersGroup);
