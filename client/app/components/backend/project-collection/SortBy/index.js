import React from "react";
import PropTypes from "prop-types";
import { useRevalidator } from "react-router";
import { useListFilters } from "hooks";
import { projectCollectionsAPI } from "api";
import { Toggle } from "components/global/form/Switch/ToggleOnly";
import { useTranslation } from "react-i18next";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

export default function ProjectCollectionSortBy({ projectCollection }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();

  const isManualSort = projectCollection.attributes.manuallySorted;

  const sortOrder = projectCollection.attributes.sortOrder;

  const updateProjectCollection = useApiCallback(projectCollectionsAPI.update);

  const handleSortOrderChange = async order => {
    if (!projectCollection) return;
    await updateProjectCollection(projectCollection.id, {
      attributes: { sortOrder: order.sortBy }
    });
    revalidate();
  };

  const handleClick = event => {
    event.preventDefault();
    const order = isManualSort
      ? { sortBy: "created_at_asc" }
      : { sortBy: "manual" };
    return handleSortOrderChange(order);
  };

  const filterProps = useListFilters({
    onFilterChange: handleSortOrderChange,
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
          <Toggle
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
          </Toggle>
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
  projectCollection: PropTypes.object
};
