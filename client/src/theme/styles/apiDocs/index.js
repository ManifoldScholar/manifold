import authorize from "./authorize";
import buttons from "./buttons";
import errors from "./errors";
import fonts from "./fonts";
import form from "./form";
import information from "./information";
import layout from "./layout";
import markdown from "./markdown";
import misc from "./misc";
import modal from "./modal";
import models from "./models";
import servers from "./servers";
import table from "./table";
import topBar from "./topBar";
import variables from "./variables";
import { textBody } from "./mixins";

export default `
  ${fonts}
  ${variables}

  .swagger-ui {
    width: 100%;
    ${textBody}
    ${misc}
    ${layout}
    ${buttons}
    ${form}
    ${modal}
    ${models}
    ${servers}
    ${table}
    ${topBar}
    ${information}
    ${authorize}
    ${errors}
    ${markdown}
  }
`;
