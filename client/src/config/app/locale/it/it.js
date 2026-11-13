/* eslint-disable import/extensions */
import base from "./json/base.json";
import backend from "./json/backend";
import reader from "./json/reader";
import frontend from "./json/frontend";
import shared from "./json/shared";
import it from "date-fns/locale/it";

export default {
  translation: {
    ...base,
    ...backend,
    ...frontend,
    ...reader,
    ...shared,
    date_fns: it
  }
};
