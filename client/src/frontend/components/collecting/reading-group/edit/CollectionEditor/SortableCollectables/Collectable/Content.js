import * as React from "react";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import { getCollectableIcon } from "./helpers";
import { Title, Remove } from "../parts";
import PopoverMenu from "global/components/popover/Menu";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";
import { Action } from "../parts/styles";

export default function Content({
  responses,
  type,
  id,
  onRemove,
  onMove,
  onSort,
  collectableRef,
  wrapperRef,
  dragHandleRef,
  dragState,
  index,
  collectableCount,
  categoryIndex,
  categoryCount
}) {
  const groupLabelId = useUID();

  const { t } = useTranslation();

  return (
    <Styled.Wrapper ref={wrapperRef} $hidden={dragState?.status === "has-left"}>
      <Styled.Collectable
        ref={collectableRef}
        tabIndex={-1}
        data-collectable-id={id}
      >
        <Styled.Header>
          <IconComposer icon={getCollectableIcon(type)} size={36} />
          <Title id={id} responses={responses} labelId={groupLabelId} />
        </Styled.Header>
        <Styled.Actions role="group" aria-labelledby={groupLabelId}>
          <Remove id={id} type={type} onRemove={onRemove} />
          <PopoverMenu
            disclosure={
              <Action ref={dragHandleRef} data-drag-handle>
                <IconComposer icon="grabber32" size="default" />
                <span className="screen-reader-text">
                  {t("actions.dnd.reorder_collectable")}
                </span>
              </Action>
            }
            actions={[
              {
                id: "up",
                label: t("actions.dnd.move_up_position"),
                onClick: () => onSort({ id, type, direction: "up" }),
                disabled: index === 0
              },
              {
                id: "down",
                label: t("actions.dnd.move_down_position"),
                onClick: () => onSort({ id, type, direction: "down" }),
                disabled: index === collectableCount - 1
              },
              {
                id: "up_category",
                label: t("actions.dnd.move_up_category"),
                onClick: () => onMove({ id, type, direction: "up" }),
                disabled: categoryIndex === 0
              },
              {
                id: "down_category",
                label: t("actions.dnd.move_down_category"),
                onClick: () => onMove({ id, type, direction: "down" }),
                disabled: categoryIndex === categoryCount - 1
              }
            ]}
          />
        </Styled.Actions>
      </Styled.Collectable>
    </Styled.Wrapper>
  );
}
