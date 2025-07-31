import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Label = styled.div`
  background-color: var(--color-base-neutral10);
  padding-block: 0.25rem;
  padding-inline: 0.75rem;
  ${utilityPrimary}
  font-size: 11px;
  display: flex;
  gap: 0.25rem;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-top: 1px solid var(--color-base-neutral40);
  border-left: 1px solid var(--color-base-neutral40);
  border-right: 1px solid var(--color-base-neutral40);
`;

export const Content = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-base-neutral40);
  border-left: 1px solid var(--color-base-neutral40);
  border-right: 1px solid var(--color-base-neutral40);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  > * + * {
    padding-block-start: 10px;
  }
`;

export const Wrapper = styled.article`
  width: 200px;
  max-height: 165px;
  border-radius: 6px;
  text-indent: 0;
  color: var(--color-base-neutral75);
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};

  ${({ $visible }) => $visible && `opacity: 1; transform: translateX(0);`}

  &:hover {
    color: var(--color-base-neutral90);
    box-shadow: 0 8px 35.8px -6px rgba(0, 0, 0, 0.3);

    ${Label} {
      background-color: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
    }

    ${Content} {
      border-color: transparent;
    }
  }

  ${({ $hidden }) => $hidden && `opacity: 0; pointer-events: none;`}
`;

export const ImageWrapper = styled.figure`
  width: 100px;
  height: 63px;
  border-radius: 4px;
  border: 1px solid var(--color-base-neutral40);
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Title = styled.h3`
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  font-variant: none;
  text-align: left;
  margin-block: 0;
`;
