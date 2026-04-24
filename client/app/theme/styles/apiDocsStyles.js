import { createGlobalStyle } from "styled-components";
import apiDocsStyles from "./apiDocs";

export const rawCss = apiDocsStyles;

export default createGlobalStyle`${apiDocsStyles}`;
