import React from "react";
import PropTypes from "prop-types";
import Collapse from "global/components/Collapse";
import IconComposer from "global/components/utility/IconComposer";
import CategoryEdit from "./CategoryEdit";
import CategoryRemove from "./CategoryRemove";

function CategoryHeader({
  category,
  groupId,
  dragProps,
  onCategoryEdit,
  onCategoryRemove
}) {
  function handleRemove() {
    onCategoryRemove(category);
  }

  return (
    <>
      <Collapse>
        <header className="group-collection-editor__block group-collection-editor__block--category">
          <h3 className="group-collection-editor__label group-collection-editor__label--category">
            {category?.attributes.title}
          </h3>
          {dragProps && (
            <div className="group-collection-editor__actions">
              <CategoryRemove onRemove={handleRemove} />
              <Collapse.Toggle className="group-collection-editor__action">
                <IconComposer icon="annotate32" size="default" />
                <span className="screen-reader-text">Edit category</span>
              </Collapse.Toggle>
              <div
                {...dragProps.provided.dragHandleProps}
                className="group-collection-editor__action"
              >
                <IconComposer icon="grabber32" size="default" />
              </div>
            </div>
          )}
        </header>
        {dragProps && (
          <Collapse.Content maxDuration={400}>
            {(visible, toggleVisible) => {
              return (
                <div className="group-collection-editor__category-inner group-collection-editor__category-inner--drawer">
                  <CategoryEdit
                    category={category}
                    groupId={groupId}
                    onSuccess={() => {
                      onCategoryEdit();
                      toggleVisible();
                    }}
                    onCancel={toggleVisible}
                  />
                </div>
              );
            }}
          </Collapse.Content>
        )}
      </Collapse>
    </>
  );
}

CategoryHeader.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Header";

CategoryHeader.propTypes = {
  category: PropTypes.object.isRequired,
  groupId: PropTypes.string,
  dragProps: PropTypes.shape({
    provided: PropTypes.object.isRequired,
    snapshot: PropTypes.object.isRequired
  }),
  onCategoryEdit: PropTypes.func,
  onCategoryRemove: PropTypes.func
};

export default CategoryHeader;
