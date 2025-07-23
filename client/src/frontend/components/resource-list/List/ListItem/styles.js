import styled from "@emotion/styled";
import { Link as NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  utilityPrimary,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";
import { fluidScale } from "theme/styles/mixins/common";

export const ImageWrapper = styled.figure`
  aspect-ratio: 25 / 16;
  inline-size: 100px;
  flex-shrink: 0;
  border-radius: 6px;
  /* fallback if light-dark() not supported */
  background-color: var(--box-medium-bg-color);
  background-color: light-dark(
    var(--color-base-neutral10),
    var(--color-base-neutral95)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 2px solid transparent;
  transition: outline-color ${defaultTransitionProps};
`;

export const Link = styled(NavLink)`
  inline-size: fit-content;
  display: block;
  color: var(--strong-color);
  text-decoration-line: none;

  &:hover {
    text-decoration-line: underline;
  }
`;

export const Title = styled.h3`
  font-family: var(--font-family-sans);
  margin: 0;
  font-weight: 400;
  font-size: ${fluidScale("18px", "16px")};
`;

export const Button = styled.button`
  ${buttonUnstyled}
  color: var(--strong-color);

  &:hover {
    text-decoration-line: underline;
  }

  &::after {
    cursor: pointer;
    position: absolute;
    display: block;
    content: "";
    inset: 0;
  }
`;

export const Wrapper = styled.article`
  position: relative;
  padding-block-end: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: ${fluidScale("30px", "20px")};
  border-bottom: 1px solid;
  border-color: var(--color-base-neutral30);
  border-color: light-dark(
    var(--color-base-neutral30),
    var(--color-base-neutral75)
  );

  @container (max-width: 400px) {
    flex-direction: column-reverse;
  }

  ${({ $active }) =>
    $active &&
    `
    ${Button} {
      color: var(--highlight-color);
      text-decoration-line: underline;
    }

    ${ImageWrapper} {
      outline-color: var(--highlight-color);
    }
    `}
`;

export const TextColumn = styled.div`
  flex-grow: 1;
`;

export const Metadata = styled.div`
  padding-block-start: 20px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;
  column-gap: 16px;
  align-items: center;
`;

export const Tag = styled.div`
  padding-inline: 12px;
  padding-block: 4px;
  min-block-size: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--box-medium-bg-color);
  color: var(--color);
  border-radius: 4px;

  > span {
    ${utilityPrimary}
    font-size: 11px;
  }
`;

export const Date = styled.span`
  font-style: italic;
  color: var(--color);
  font-family: var(--font-family-copy);

  > * + * {
    margin-inline-start: 0.5ch;
  }
`;

export const Thumb = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 4px;
`;

export const Icon = styled(IconComposer)`
  height: 36px;
  width: 36px;
  color: var(--color);
`;
