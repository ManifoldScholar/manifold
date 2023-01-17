import React from "react";
import PropTypes from "prop-types";
import { useListFilters } from "hooks";
import * as Styled from "./styles";
import { Unwrapped } from "global/components/form";
import { useTranslation } from "react-i18next";

export default function ProjectCollectionSortBy({
  projectCollection,
  sortChangeHandler
}) {
  const { t } = useTranslation();

  const isManualSort = projectCollection.attributes.manuallySorted;

  const sortOrder = projectCollection.attributes.sortOrder;

  const handleClick = event => {
    event.preventDefault();
    const order = isManualSort
      ? { sortBy: "created_at_asc" }
      : { sortBy: "manual" };
    return sortChangeHandler(order);
  };

  const filterProps = useListFilters({
    onFilterChange: sortChangeHandler,
    initialState: { sortBy: sortOrder },
    options: { orderCollection: true }
  });

  const renderToggle = () => {
    if (projectCollection.attributes.smart) return null;

    return (
      <Styled.Toggle>
        <Styled.Label
          as="div"
          label={t("project_collections.order_manually")}
        />
        <div className="toggle-indicator">
          <Unwrapped.Toggle
            as="div"
            onClick={handleClick}
            $checked={isManualSort}
            role="button"
            tabIndex="0"
            aria-pressed={isManualSort}
          >
            <span className="screen-reader-text">
              {t("project_collections.order_collection_manually")}
            </span>
          </Unwrapped.Toggle>
        </div>
      </Styled.Toggle>
    );
  };

  const renderManualInstructions = (
    <Styled.Instructions>
      {t("project_collections.order_manually_instructions")}
    </Styled.Instructions>
  );

  return projectCollection ? (
    <Styled.Wrapper>
      {isManualSort && renderManualInstructions}
      {!isManualSort && <Styled.ListFilters {...filterProps} hideSearch />}
      {renderToggle()}
    </Styled.Wrapper>
  ) : null;
}

ProjectCollectionSortBy.displayName = "ProjectCollection.SortBy";

ProjectCollectionSortBy.propTypes = {
  projectCollection: PropTypes.object,
  sortChangeHandler: PropTypes.func.isRequired
};
