import { createGlobalStyle } from "styled-components";
import vdsTheme from "./vds_theme";
import vdsDefaultVideo from "./vds_default_video";
import vdsDefaultAudio from "./vds_default_audio";
import customTheme from "./customTheme";

const rawCss = `
${vdsTheme}
${vdsDefaultVideo}
${vdsDefaultAudio}
${customTheme}
`;

export default createGlobalStyle`${rawCss}`;
