import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import PopoverMenu from "global/components/popover/Menu";
import IconComposer from "global/components/utility/IconComposer";
import CategoryEdit from "./CategoryEdit";
import CategoryRemove from "./CategoryRemove";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { MD_TITLE_REGEX } from "../../helpers/constants";
import * as Styled from "./styles";

function CategoryHeader({
  category,
  groupId,
  dragHandleRef,
  onCategoryRemove,
  initExpanded,
  setCollapsed,
  manualCollapsed,
  collectableOver,
  onCategoryMove,
  onCategoryEditError,
  index,
  categoryCount
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

  const [editActive, setEditActive] = useState(false);
  const toggleEditActive = () => setEditActive(prevActive => !prevActive);

  const kind = markdownOnly ? "block" : "category";
  const collapseToggleLabel = manualCollapsed
    ? `forms.category.expand_${kind}`
    : `forms.category.collapse_${kind}`;

  const mdTitleHidden =
    MD_TITLE_REGEX.test(title) && !categoryDragActive && !manualCollapsed;

  return (
    <>
      <Collapse initialVisible={initExpanded}>
        <Styled.Header
          data-collapsed={categoryDragActive || manualCollapsed}
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
            {markdownOnly && (
              <Styled.Title data-invisible={mdTitleHidden}>
                {MD_TITLE_REGEX.test(title) ? descriptionPlaintext : title}
              </Styled.Title>
            )}
          </Styled.TitleWrapper>
          {dragHandleRef && (
            <Styled.Actions>
              <CategoryRemove
                isMarkdown={!!markdownOnly}
                onRemove={() => onCategoryRemove(category)}
              />
              <Styled.Action as="button" onClick={toggleEditActive}>
                <IconComposer icon="annotate32" size="default" />
                <span className="screen-reader-text">
                  {t("forms.category.edit")}
                </span>
              </Styled.Action>
              <PopoverMenu
                disclosure={
                  <Styled.Action
                    as="button"
                    ref={dragHandleRef}
                    data-drag-handle
                  >
                    <IconComposer icon="grabber32" size="default" />
                    <span className="screen-reader-text">
                      {t("actions.dnd.reorder_category")}
                    </span>
                  </Styled.Action>
                }
                actions={[
                  {
                    id: "up",
                    label: t("actions.dnd.move_up_position"),
                    onClick: () => onCategoryMove(category.id, "up"),
                    disabled: index === 0
                  },
                  {
                    id: "down",
                    label: t("actions.dnd.move_down_position"),
                    onClick: () => onCategoryMove(category.id, "down"),
                    disabled: index === categoryCount - 1
                  }
                ]}
              />
            </Styled.Actions>
          )}
        </Styled.Header>
        {editActive && (
          <CategoryEdit
            category={category}
            groupId={groupId}
            onClose={toggleEditActive}
            onError={onCategoryEditError}
            index={index}
          />
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
