import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import IconComposer from "global/components/utility/IconComposer";
import CategoryEdit from "./CategoryEdit";
import CategoryRemove from "./CategoryRemove";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import * as Styled from "./styles";

function CategoryHeader({
  category,
  groupId,
  dragHandleRef,
  onCategoryEdit,
  onCategoryRemove,
  initExpanded,
  setCollapsed,
  manualCollapsed,
  collectableOver
}) {
  const { t } = useTranslation();

  const { markdownOnly, title, descriptionPlaintext } =
    category?.attributes ?? {};

  const [categoryDragActive, setCategoryDragActive] = useState();

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        if (source.data.type === "categories") {
          setCategoryDragActive(true);
        }
      },
      onDrop({ source }) {
        if (source.data.type === "categories") {
          setCategoryDragActive(false);
        }
      }
    });
  }, []);

  const kind = markdownOnly ? "block" : "category";
  const collapseToggleLabel = manualCollapsed
    ? `forms.expand_${kind}`
    : `forms.collapse_${kind}`;

  return (
    <>
      <Collapse initialVisible={initExpanded}>
        <Styled.Header
          $borderRadius={categoryDragActive || manualCollapsed}
          $bg={collectableOver}
        >
          <Styled.TitleWrapper>
            <Styled.Action as="button" onClick={setCollapsed}>
              <IconComposer
                icon={manualCollapsed ? "disclosureDown24" : "disclosureUp24"}
                size="default"
              />
              <span className="screen-reader-text">
                {t(collapseToggleLabel)}
              </span>
            </Styled.Action>
            {!markdownOnly && <Styled.Title>{title}</Styled.Title>}
            {markdownOnly && (categoryDragActive || manualCollapsed) && (
              <Styled.Title>{descriptionPlaintext}</Styled.Title>
            )}
          </Styled.TitleWrapper>
          {dragHandleRef && (
            <Styled.Actions>
              <CategoryRemove
                isMarkdown={!!markdownOnly}
                onRemove={() => onCategoryRemove(category)}
              />
              <Styled.Action as={Collapse.Toggle}>
                <IconComposer icon="annotate32" size="default" />
                <span className="screen-reader-text">
                  {t("forms.category.edit")}
                </span>
              </Styled.Action>
              <Styled.Action as="button" ref={dragHandleRef} data-drag-handle>
                <IconComposer icon="grabber32" size="default" />
              </Styled.Action>
            </Styled.Actions>
          )}
        </Styled.Header>
        {dragHandleRef && (
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
  onCategoryRemove: PropTypes.func,
  initExpanded: PropTypes.bool
};

export default CategoryHeader;
