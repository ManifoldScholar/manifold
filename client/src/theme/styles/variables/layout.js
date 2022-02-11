import { createCSSVariables } from "./helpers";

const fullContainerWidth = 1235;
const fullContainerPadding = 50;

export const containerWidth = {
  full: `${fullContainerWidth}px`,
  min: "320px",
  inner: `${fullContainerWidth - fullContainerPadding * 2}px`,
  focus: "680px"
};

export const containerPaddingInline = {
  full: `${fullContainerPadding}px`,
  responsive: "4.5%",
  narrow: "20px",
  responsiveGlobal: "4.5vw",
  min: "15px",
  get fluid() {
    return `clamp(${this.narrow}, calc(${this.narrow} + ${parseInt(
      this.full,
      10
    ) - parseInt(this.narrow, 10)} * (100vw - 620px) / 404), ${this.full})`;
  }
};

export const containerPaddingBlock = {
  start: "clamp(39px, calc(39px + 21 * (100vw - 620px) / 404), 60px)",
  end: "clamp(45px, calc(45px + 25 * (100vw - 620px) / 404), 70px)"
};

export const readerHeaderHeight = "46px";

export default `
  ${createCSSVariables("container-width", containerWidth)}
  ${createCSSVariables("container-padding-inline", containerPaddingInline)}
  ${createCSSVariables("container-padding-block", containerPaddingBlock)}
  --reader-header-height: ${readerHeaderHeight};
`;
