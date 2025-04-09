import * as React from "react";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import { getCollectableIcon } from "./helpers";
import { Title, Remove } from "../parts";
import Disclosure from "frontend/components/collecting/Disclosure";
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
  dragState
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
          <Disclosure.Provider>
            <Disclosure.Toggle>
              <Action ref={dragHandleRef} data-drag-handle>
                <IconComposer icon="grabber32" size="default" />
              </Action>
            </Disclosure.Toggle>
            <Disclosure.Content>
              {({ closeMenu }) => (
                <>
                  <Action
                    onClick={() => {
                      closeMenu();
                      onSort({ id, type, direction: "up" });
                    }}
                  >
                    {t("forms.category.collectable_move_up")}
                  </Action>
                  <Action
                    onClick={() => {
                      closeMenu();
                      onSort({ id, type, direction: "down" });
                    }}
                  >
                    {t("forms.category.collectable_move_down")}
                  </Action>
                  <Action
                    onClick={() => {
                      closeMenu();
                      onMove({ id, type, direction: "up" });
                    }}
                  >
                    {t("forms.category.collectable_category_up")}
                  </Action>
                  <Action
                    onClick={() => {
                      closeMenu();
                      onMove({ id, type, direction: "down" });
                    }}
                  >
                    {t("forms.category.collectable_category_down")}
                  </Action>
                </>
              )}
            </Disclosure.Content>
          </Disclosure.Provider>
        </Styled.Actions>
      </Styled.Collectable>
    </Styled.Wrapper>
  );
}
