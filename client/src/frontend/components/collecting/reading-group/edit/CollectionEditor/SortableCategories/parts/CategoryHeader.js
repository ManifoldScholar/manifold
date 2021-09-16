import React, { useState } from "react";
import PropTypes from "prop-types";
import { UnmountClosed as Collapse } from "react-collapse";
import { useUID } from "react-uid";
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
  const groupLabelId = useUID();
  const [showDrawer, setShowDrawer] = useState(false);

  function handleSuccess() {
    setShowDrawer(false);
    onCategoryEdit();
  }

  function handleCancel() {
    setShowDrawer(false);
  }

  function handleRemove() {
    onCategoryRemove(category);
  }

  return (
    <>
      <header className="group-collection-editor__block group-collection-editor__block--category">
        <h3
          id={groupLabelId}
          className="group-collection-editor__label group-collection-editor__label--category"
        >
          {category?.attributes.title}
        </h3>
        {dragProps && (
          <div
            role="group"
            aria-labelledby={groupLabelId}
            className="group-collection-editor__actions"
          >
            <CategoryRemove onRemove={handleRemove} />
            <button
              onClick={() => setShowDrawer(prevState => !prevState)}
              aria-expanded={showDrawer}
              className="group-collection-editor__action"
            >
              <IconComposer icon="annotate32" size="default" />
              <span className="screen-reader-text">Edit category</span>
            </button>
            <div
              {...dragProps.provided.dragHandleProps}
              className="group-collection-editor__action"
            >
              <IconComposer icon="grabber32" size="default" />
              <span className="screen-reader-text">Drag category</span>
            </div>
          </div>
        )}
      </header>
      {dragProps && (
        <Collapse isOpened={showDrawer}>
          <div className="group-collection-editor__category-inner group-collection-editor__category-inner--drawer">
            <CategoryEdit
              category={category}
              groupId={groupId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </Collapse>
      )}
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
