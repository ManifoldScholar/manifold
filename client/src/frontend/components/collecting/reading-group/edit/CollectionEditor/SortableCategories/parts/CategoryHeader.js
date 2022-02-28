import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import IconComposer from "global/components/utility/IconComposer";
import CategoryEdit from "./CategoryEdit";
import CategoryRemove from "./CategoryRemove";
import * as Styled from "./styles";

function CategoryHeader({
  category,
  groupId,
  dragProps,
  onCategoryEdit,
  onCategoryRemove
}) {
  const { t } = useTranslation();

  return (
    <>
      <Collapse>
        <Styled.Header>
          <Styled.Title>{category?.attributes.title}</Styled.Title>
          {dragProps && (
            <Styled.Actions>
              <CategoryRemove onRemove={() => onCategoryRemove(category)} />
              <Styled.Action as={Collapse.Toggle}>
                <IconComposer icon="annotate32" size="default" />
                <span className="screen-reader-text">
                  {t("forms.category.edit")}
                </span>
              </Styled.Action>
              <Styled.Action {...dragProps.provided.dragHandleProps}>
                <IconComposer icon="grabber32" size="default" />
              </Styled.Action>
            </Styled.Actions>
          )}
        </Styled.Header>
        {dragProps && (
          <Collapse.Content maxDuration={400}>
            {(visible, toggleVisible) => {
              return (
                <Styled.Inner>
                  <CategoryEdit
                    category={category}
                    groupId={groupId}
                    onSuccess={() => {
                      onCategoryEdit();
                      toggleVisible();
                    }}
                    onCancel={toggleVisible}
                  />
                </Styled.Inner>
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
