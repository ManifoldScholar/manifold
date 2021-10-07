import { fontWeight } from "../variables/typography";

export default `
  // TypeKit fallback serif font
  // --------------------------
  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url("../../assets/fonts/aleo/Aleo-Regular.woff") format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url("../../assets/fonts/aleo/Aleo-Italic.woff") format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: optional;
    src: url("../../assets/fonts/aleo/Aleo-Bold.woff") format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: optional;
    src: url("../../assets/fonts/aleo/Aleo-Light.woff") format("woff");
  }

  // TypeKit fallback san-serif font
  // --------------------------
  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url("../../assets/fonts/trueno/TruenoRg.woff") format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url("../../assets/fonts/trueno/TruenoRgIt.woff") format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: optional;
    src: url("../../assets/fonts/trueno/TruenoBd.woff") format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.semibold};
    font-display: optional;
    src: url("../../assets/fonts/trueno/TruenoSBd.woff") format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: optional;
    src: url("../../assets/fonts/trueno/TruenoLt.woff") format("woff");
  }
`;
