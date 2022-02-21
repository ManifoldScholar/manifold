import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useListFilters } from "hooks";
import * as Styled from "./styles";

export default function ProjectCollectionSortBy({
  projectCollection,
  sortChangeHandler
}) {
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

    const classes = classnames({
      "boolean-primary": true,
      checked: isManualSort
    });

    return (
      <div className="form-secondary">
        <div className="form-input">
          <div className="form-input-heading">Order Manually</div>
          <div className="toggle-indicator">
            <div
              onClick={handleClick}
              className={classes}
              role="button"
              tabIndex="0"
              aria-pressed={isManualSort}
            >
              <span className="screen-reader-text">
                Order collection manually
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderManualInstructions = (
    <Styled.Instructions>
      Click and drag projects to rearrange them.
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
