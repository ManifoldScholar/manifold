import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { utilityPrimary } from "theme/styles/mixins/typography";
import { fluidScale } from "theme/styles/mixins/common";

export const ImageWrapper = styled.figure`
  inline-size: 100px;
  block-size: 63px;
  flex-shrink: 0;
  border-radius: 6px;
  background-color: var(--box-medium-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: border-color 200ms ease;
`;

export const Title = styled.h3`
  font-family: var(--font-family-sans);
  color: var(--strong-color);
  margin: 0;
  font-weight: 400;
  font-size: ${fluidScale("18px", "16px")};
  transition: color 200ms ease;
`;

const titleUnderline = `
text-decoration-line: underline;
text-decoration-style: solid;
text-decoration-skip-ink: auto;
text-decoration-thickness: 10.5%;
text-underline-offset: 25%;
`;

export const Wrapper = styled.li`
  padding-block-end: 20px;
  width: 100%;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--color-base-neutral30);
  cursor: pointer;

  &:hover {
    ${Title} {
      ${titleUnderline}
    }
  }

  ${({ $active }) =>
    $active &&
    `
    ${Title} {
      color: var(--highlight-color);
      ${titleUnderline}
    }

    ${ImageWrapper} {
      border-color: var(--highlight-color);
    }
    `}
`;

export const TextColumn = styled.div`
  flex-grow: 1;
`;

export const Metadata = styled.div`
  padding-block-start: 20px;
  display: flex;
  gap: 1rem;
  display: flex;
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
