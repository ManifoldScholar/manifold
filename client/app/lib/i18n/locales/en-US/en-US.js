/* eslint-disable import/extensions */
import base from "./json/base.json";
import backend from "./json/backend";
import reader from "./json/reader";
import frontend from "./json/frontend";
import shared from "./json/shared";
import lti from "./json/lti";
import { enUS } from "date-fns/locale/en-US";

export default {
  translation: {
    ...base,
    ...backend,
    ...frontend,
    ...reader,
    ...shared,
    ...lti,
    date_fns: enUS
  }
};
