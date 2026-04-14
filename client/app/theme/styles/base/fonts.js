import AleoRegular from "../../assets/fonts/aleo/Aleo-Regular.woff";
import AleoItalic from "../../assets/fonts/aleo/Aleo-Italic.woff";
import AleoBold from "../../assets/fonts/aleo/Aleo-Bold.woff";
import AleoLight from "../../assets/fonts/aleo/Aleo-Light.woff";
import TruenoRg from "../../assets/fonts/trueno/TruenoRg.woff";
import TruenoRgIt from "../../assets/fonts/trueno/TruenoRgIt.woff";
import TruenoBd from "../../assets/fonts/trueno/TruenoBd.woff";
import TruenoSBd from "../../assets/fonts/trueno/TruenoSBd.woff";
import TruenoLt from "../../assets/fonts/trueno/TruenoLt.woff";
import LatinModernMath from "../../assets/fonts/LatinModern/latinmodern-math.woff2";
import LatinModernRg from "../../assets/fonts/LatinModern/lmroman12-regular.woff2";
import LatinModernBd from "../../assets/fonts/LatinModern/lmroman12-bold.woff2";
import LatinModernIt from "../../assets/fonts/LatinModern/lmroman12-italic.woff2";
import STIXBd from "../../assets/fonts/STIX/STIXTwoText-Bold.woff2";
import STIXBdIt from "../../assets/fonts/STIX/STIXTwoText-BoldItalic.woff2";
import STIXIt from "../../assets/fonts/STIX/STIXTwoText-Italic.woff2";
import STIXRg from "../../assets/fonts/STIX/STIXTwoText-Regular.woff2";
import STIXMath from "../../assets/fonts/STIX/STIXTwoMath-Regular.woff2";
import FiraMath from "../../assets/fonts/FiraMath/FiraMath-Regular.woff2";

import { fontWeight } from "../variables/typography";

export default `
  /* TypeKit fallback serif font */
  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: swap;
    src: url(${AleoRegular}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: swap;
    src: url(${AleoItalic}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: swap;
    src: url(${AleoBold}) format("woff");
  }

  @font-face {
    font-family: "aleo";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: swap;
    src: url(${AleoLight}) format("woff");
  }

  /* TypeKit fallback sans-serif font */
  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.regular};
    font-display: swap;
    src: url(${TruenoRg}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: italic;
    font-weight: ${fontWeight.regular};
    font-display: swap;
    src: url(${TruenoRgIt}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.bold};
    font-display: swap;
    src: url(${TruenoBd}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.semibold};
    font-display: swap;
    src: url(${TruenoSBd}) format("woff");
  }

  @font-face {
    font-family: "trueno";
    font-style: normal;
    font-weight: ${fontWeight.light};
    font-display: swap;
    src: url(${TruenoLt}) format("woff");
  }

  @font-face {
      font-family: LMRoman12;
      src: url(${LatinModernRg}) format("woff2");
  }
  @font-face {
      font-family: LMRoman12;
      src: url(${LatinModernBd}) format("woff2");
      font-weight: bold;
  }
  @font-face {
      font-family: LMRoman12;
      src: url(${LatinModernIt}) format("woff2");
      font-style: italic;
  }

  @font-face {
      font-family: Latin Modern Math;
      src: local('Latin Modern Math'), local('LatinModernMath-Regular'),
           url(${LatinModernMath}) format("woff2");
  }

  @font-face {
      font-family: STIX Two Text;
      src: local('STIXTwoText'),
           url(${STIXRg}) format("woff2");
  }
  @font-face {
      font-family: STIX Two Text;
      src: local('STIXTwoText-Bold'),
           url(${STIXBd}) format("woff2");
      font-weight: bold;
  }
  @font-face {
      font-family: STIX Two Text;
      src: local('STIXTwoText-Italic'),
           url(${STIXIt}) format("woff2");
      font-style: italic;
  }
  @font-face {
      font-family: STIX Two Text;
      src: local('STIXTwoText-BoldItalic'),
           url(${STIXBdIt}) format("woff2");
      font-weight: bold;
      font-style: italic;
  }
  @font-face {
      font-family: STIX Two Math;
      src: local('STIXTwoMath-Regular'),
           url(${STIXMath}) format("woff2");
  }

  @font-face {
      font-family: Fira Math;
      src: local('Fira Math'), local('FiraMath-Regular'),
           url(${FiraMath}) format("woff2");
  }
`;
