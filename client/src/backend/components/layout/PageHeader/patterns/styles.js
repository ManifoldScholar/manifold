import styled from "@emotion/styled";
import { respond, fluidScale, defaultHoverStyle } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import UniqueIcons from "global/components/icon/unique";
import { Link } from "react-router-dom";
import { transientOptions } from "helpers/emotionHelpers";

export const Row = styled.div`
  padding: ${fluidScale("22px", "24px")} ${fluidScale("28px", "16px")}
    ${fluidScale("22px", "20px")} ${fluidScale("28px", "16px")};
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  ${({ $padStart }) =>
    $padStart && `padding-inline-start: ${fluidScale("36px", "28px")};`}

  & + &,
  &:not(:first-of-type) {
    padding-block-start: 0;
    margin-block-start: -6px;
  }

  ${({ $minHeight }) => $minHeight && `min-height: 85px;`}
  ${({ $compact }) =>
    $compact &&
    `padding: ${fluidScale("16px", "12px")} ${fluidScale("24px", "12px")}`}
`;

export const Figure = styled.figure`
  width: ${fluidScale("64px", "59px")};
  height: ${fluidScale("64px", "59px")};
  background-color: var(--color-base-neutral100);
  border-radius: 12px;
  margin-inline-end: 20px;
  flex-shrink: 0;
`;

export const JournalFigure = styled(Figure)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CountFigure = styled(JournalFigure)`
  width: ${fluidScale("60px", "50px")};
  height: ${fluidScale("60px", "50px")};
  background-color: var(--color-base-neutral-90);
`;

export const ProjectCollectionFigure = styled.figure`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: var(--color-base-neutral90);
  border-radius: var(--box-border-radius);
  color: var(--color-accent-primary);
  margin-inline-end: 24px;
`;

export const ChildLink = styled.div`
  width: ${fluidScale("16px", "12px")};
  height: ${fluidScale("16px", "12px")};
  border-bottom-left-radius: 4px;
  border-left: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  color: var(--color-neutral-ui-light);
  margin-block-start: -12px;
  flex-shrink: 0;

  ${respond(`margin-inline-start: 12px;`, 65)}
`;

export const Icon = styled(IconComposer)`
  width: ${fluidScale("50px", "40px")};
  height: ${fluidScale("50px", "40px")};
`;

export const CountIcon = styled(IconComposer)`
  width: ${fluidScale("44px", "40px")};
  height: ${fluidScale("44px", "40px")};
  color: var(--color-accent-primary);
  margin-inline-end: 24px;
  margin-block-start: 3px;
`;

export const CountIconSmall = styled(CountIcon)`
  width: ${fluidScale("36px", "30px")};
  height: ${fluidScale("36px", "30px")};
`;

export const AnalyticsIcon = styled(CountIconSmall)`
  color: var(--color-accent-secondary);
`;

export const ProjectCollectionIcon = styled(IconComposer)`
  width: ${fluidScale("44px", "40px")};
  height: ${fluidScale("44px", "40px")};
`;

export const ProjectIcon = styled(UniqueIcons.ProjectPlaceholderUnique)`
  width: ${fluidScale("64px", "59px")};
  height: ${fluidScale("64px", "59px")};
  margin-block-start: 3px;
  margin-inline-start: 2px;

  ${Figure} > & {
    margin-inline-start: 4px;
  }
`;

export const TextIcon = styled(IconComposer)`
  width: ${fluidScale("36px", "32px")};
  height: ${fluidScale("36px", "32px")};
  margin-inline-end: ${fluidScale("20px", "16px")};

  ${ChildLink} + & {
    margin-inline-start: 12px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  ${respond(
    `flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap;`,
    65
  )}
`;

export const Title = styled("h1", transientOptions)`
  margin: 0;
  font-size: ${fluidScale("23px", "17px")};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  hyphens: none;
  color: ${({ $parent }) =>
    $parent ? `inherit` : `var(--color-base-neutral20)`};
  text-decoration: none;

  &:hover {
    ${({ $parent }) => $parent && defaultHoverStyle}
  }
`;

export const Subtitle = styled.span`
  font-size: ${fluidScale("20px", "17px")};
  font-family: var(--font-family-serif);
  color: var(--color-neutral-text-light);
  margin-block-start: 8px;

  ${respond(`margin-block-start: 4px;`, 65)}
`;

export const Count = styled.span`
  color: var(--color-accent-primary);
  margin-inline-end: 12px;
`;

export const SeeAllLink = styled(Link)`
  margin-inline-start: auto;
`;
