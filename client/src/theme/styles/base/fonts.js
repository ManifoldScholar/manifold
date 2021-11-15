import AleoRegular from "../../assets/fonts/aleo/Aleo-Regular.woff";
import AleoItalic from "../../assets/fonts/aleo/Aleo-Italic.woff";
import AleoBold from "../../assets/fonts/aleo/Aleo-Bold.woff";
import AleoLight from "../../assets/fonts/aleo/Aleo-Light.woff";
import TruenoRg from "../../assets/fonts/trueno/TruenoRg.woff";
import TruenoRgIt from "../../assets/fonts/trueno/TruenoRgIt.woff";
import TruenoBd from "../../assets/fonts/trueno/TruenoBd.woff";
import TruenoSBd from "../../assets/fonts/trueno/TruenoSBd.woff";
import TruenoLt from "../../assets/fonts/trueno/TruenoLt.woff";
import { fontWeight } from "../variables/typography";

export default `
  /* TypeKit fallback serif font */
  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url(${AleoRegular}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url(${AleoItalic}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: optional;
    src: url(${AleoBold}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: optional;
    src: url(${AleoLight}) format("woff");
  }

  /* TypeKit fallback sans-serif font */
  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url(${TruenoRg}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: optional;
    src: url(${TruenoRgIt}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: optional;
    src: url(${TruenoBd}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.semibold};
    font-display: optional;
    src: url(${TruenoSBd}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: optional;
    src: url(${TruenoLt}) format("woff");
  }
`;
