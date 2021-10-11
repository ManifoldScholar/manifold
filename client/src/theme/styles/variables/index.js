import colorVariables from "./colors";
import appearanceVariables from "./appearance";
import typographyVariables from "./typography";
import layoutVariables from "./layout";
import motionVariables from "./motion";
import mediaVariables from "./media";

export default `
  :root {
    ${colorVariables}
    ${appearanceVariables}
    ${typographyVariables}
    ${layoutVariables}
    ${motionVariables}
    ${mediaVariables}
  }
`;
