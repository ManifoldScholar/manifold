/* eslint-disable import/extensions */
import base from "./json/base.json";
import it from "date-fns/locale/it";

export default {
  translation: {
    ...base,
    date_fns: it
  }
};
