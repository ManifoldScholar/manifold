import styled from "@emotion/styled";
import { dragging, utilityPrimary, panelRounded } from "theme/styles/mixins";
import {
  collapsed,
  collapsible
} from "../../SortableCategories/Category/styles";

const collectableMinHeight = `50px`;
const collectableVerticalPadding = `5px`;

export const Wrapper = styled.div`
  padding-block-start: ${collectableVerticalPadding};
  padding-block-end: ${collectableVerticalPadding};

  ${collapsible}
  overflow: visible;

  ${({ $hidden }) => $hidden && collapsed};
`;

export const WrapperEmpty = styled(Wrapper)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(${collectableMinHeight} + ${collectableVerticalPadding} * 2);

  ${collapsible}
  ${({ $hidden }) => $hidden && collapsed};
`;

export const Collectable = styled.article`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--box-medium-bg-color);
  padding-inline-start: 14px;
  border-radius: var(--box-border-radius);

  ${({ $preview }) => $preview && dragging}

  &:focus-visible {
    outline: none;
  }
`;

export const CollectableEmpty = styled.div`
  --label-margin-bottom: 0;

  display: flex;
  background-color: var(--box-medium-bg-color);
  align-items: center;
  justify-content: center;
  padding-block-start: 9px;
  padding-block-end: 9px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  color: var(--color-base-neutral80);
  border-radius: var(--box-border-radius);

  > * + * {
    margin-left: 8px;
  }

  svg {
    transform: translateY(1px);
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  min-width: 0;
  margin-block-start: 6px;
  margin-block-end: 8px;

  > * + * {
    margin-left: 15px;
  }

  svg {
    flex-shrink: 0;
    color: var(--color-base-neutral80);
    transform: translateY(2px);
  }
`;

export const Actions = styled.div`
  --PopoverMenu-inset-block-start: calc(100% + 10px);
  --PopoverMenu-inset-inline-end: -20px;

  display: flex;
  flex-shrink: 0;
  gap: min(1vw, 10px);
  align-items: center;
  margin-inline-start: 10px;
  color: var(--color);
`;

export const Label = styled.span`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  margin-block-start: 0;
  letter-spacing: 0.089em;
  font-size: 13px;
  color: inherit;
`;

export const Title = styled.div`
  display: block;
  font-family: var(--font-family-heading);
  color: var(--label-color);
  inline-size: min(995px, 80vw);
  margin: 0;
`;

export const Shadow = styled.div`
  ${panelRounded}
  background-color: var(--weak-color);
  height: 50px;
`;
