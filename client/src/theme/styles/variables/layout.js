import { createCSSVariables } from "../mixins";

const fullContainerWidth = 1235;
const fullContainerPadding = 50;

export const containerWidth = {
  full: `${fullContainerWidth}px`,
  min: "320px",
  inner: `${fullContainerWidth - fullContainerPadding * 2}px`,
  focus: "680px"
};

export const containerPadding = {
  full: `${fullContainerPadding}px`,
  responsive: "4.5%",
  narrow: "20px",
  responsiveGlobal: "4.5vw",
  min: "15px"
};

export const readerHeaderHeight = "46px";

export default `
  ${createCSSVariables("container-width", containerWidth)}
  ${createCSSVariables("container-padding", containerPadding)}
  --reader-header-height: ${readerHeaderHeight};
`;
